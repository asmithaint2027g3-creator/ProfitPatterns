/**
 * =============================================================================
 * PROFITPATTERNS — JIRA INTEGRATION MODULE
 * =============================================================================
 * Creates a Jira Task (parent) + sub-tasks for every lead submitted.
 *
 * Parent Task summary: "[LEAD_TYPE] — {Name} — {Date}"
 * Sub-tasks:
 *   1. 📋 Contact Information
 *   2. 📝 Requirement & Business Context
 *   3. ✅ Follow-up Action Required
 *   4. 📁 NDA & Documents (Audit leads only)
 *
 * Project: DLF (configurable via JIRA_PROJECT_KEY env var)
 * =============================================================================
 */

// ─── Dynamic Config & Auth ───────────────────────────────────────────────────

// ✅ Defaults → asmithaint2027g3.atlassian.net | DealFlow_INT2027G3 (Project: DI)
export function getJiraConfig() {
  const baseUrl = (
    process.env["JIRA_BASE_URL"] ||
    process.env["VITE_JIRA_BASE_URL"] ||
    "https://asmithaint2027g3.atlassian.net"
  ).replace(/\/+$/, "");
  const email =
    process.env["JIRA_EMAIL"] ||
    process.env["VITE_JIRA_EMAIL"] ||
    "asmitha.int2027g3@gmail.com";
  const apiToken =
    process.env["JIRA_API_TOKEN"] ||
    process.env["VITE_JIRA_API_TOKEN"] ||
    "ATATT3xFfGF0JoxzMyLRSgTCMFyHLwpwAq0IUJ9m-v_tV5rGF9H0vd__j1kDJw4PxztxdGvX46dB2u0WtTTxdqysjPR06GjLNF0iUigNmWymn4I1lEtf55v4Gym1uSkpynSayg9EKujVlUPJIyL0R2lpvRKRyzISCtP1J-w4mzT7HYvT40VFIZM=874B6BD6";
  const projectKey =
    process.env["JIRA_PROJECT_KEY"] ||
    process.env["VITE_JIRA_PROJECT_KEY"] ||
    "DI";
  return { baseUrl, email, apiToken, projectKey };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JiraLeadPayload {
  /** Form type label */
  leadType: "Quick Form" | "Consultation" | "Process Audit" | "Chatbot";
  name: string;
  email: string;
  phone?: string | null | undefined;
  company?: string | null | undefined;
  jobTitle?: string | null | undefined;
  industry?: string | null | undefined;
  companySize?: string | null | undefined;
  website?: string | null | undefined;
  /** Primary requirement / challenge category */
  requirement?: string | null | undefined;
  /** Detailed description of the challenge */
  challenge?: string | null | undefined;
  desiredOutcome?: string | null | undefined;
  currentTools?: string | null | undefined;
  existingAIUsage?: string | null | undefined;
  projectScope?: string | null | undefined;
  budgetRange?: string | null | undefined;
  preferredContactTime?: string | null | undefined;
  message?: string | null | undefined;
  /** Audit-specific */
  auditDocType?: string | null | undefined;
  weeklyHoursSpent?: string | null | undefined;
  primaryGoal?: string | null | undefined;
  processSummary?: string | null | undefined;
  filesCount?: number | undefined;
  filesList?: string | undefined;
  ndaRequested?: boolean | undefined;
  driveLink?: string | null | undefined;
  /** Common */
  pageUrl?: string | undefined;
  leadStatus?: string | undefined;
}

export interface JiraCreateResult {
  ok: boolean;
  parentIssueKey?: string;
  parentIssueUrl?: string;
  subTaskKeys?: string[];
  error?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAuthHeader(): string {
  const cfg = getJiraConfig();
  const creds = `${cfg.email}:${cfg.apiToken}`;
  return `Basic ${Buffer.from(creds).toString("base64")}`;
}

function isJiraConfigured(): boolean {
  const cfg = getJiraConfig();
  return !!(cfg.email && cfg.apiToken && cfg.baseUrl && cfg.projectKey);
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function row(label: string, value: string | number | boolean | undefined | null): string {
  const display = value === undefined || value === null || value === "" ? "—" : String(value);
  return `|| *${label}* || ${display} ||\n`;
}

// ─── Jira REST API wrapper ────────────────────────────────────────────────────

async function jiraPost(
  endpoint: string,
  body: unknown,
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const cfg = getJiraConfig();
    const res = await fetch(`${cfg.baseUrl}/rest/api/3/${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.error(`Jira API error [${res.status}]:`, text.slice(0, 500));
      return { ok: false, error: `Jira API returned ${res.status}: ${text.slice(0, 200)}` };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("Jira network error:", err);
    return { ok: false, error: String(err) };
  }
}

// ─── Description builders ──────────────────────────────────────────────────────

/**
 * Jira REST API v3 uses Atlassian Document Format (ADF) for description.
 * We convert plain wiki-style text into a simple paragraph ADF node.
 */
function textDoc(text: string): object {
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

function buildParentDescription(p: JiraLeadPayload): object {
  const text =
    `📊 LEAD OVERVIEW\n` +
    `Lead Type: ${p.leadType}\n` +
    `Status: ${p.leadStatus || "New"}\n` +
    `Source Page: ${p.pageUrl || "—"}\n` +
    `Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n\n` +
    `Sub-tasks contain full Contact Info, Requirement Details, Follow-up Actions, and Documents.`;
  return textDoc(text);
}

function buildContactInfoDescription(p: JiraLeadPayload): object {
  const text =
    `📋 CONTACT INFORMATION\n\n` +
    `Full Name: ${p.name || "—"}\n` +
    `Email: ${p.email || "—"}\n` +
    `Phone: ${p.phone || "—"}\n` +
    `Company: ${p.company || "—"}\n` +
    `Job Title: ${p.jobTitle || "—"}\n` +
    `Industry: ${p.industry || "—"}\n` +
    `Company Size: ${p.companySize || "—"}\n` +
    `Website: ${p.website || "—"}\n` +
    `Preferred Contact Time: ${p.preferredContactTime || "—"}`;
  return textDoc(text);
}

function buildRequirementDescription(p: JiraLeadPayload): object {
  const text =
    `📝 REQUIREMENT & BUSINESS CONTEXT\n\n` +
    `Primary Requirement: ${p.requirement || "—"}\n` +
    `Challenge / Goal: ${p.challenge || p.processSummary || p.message || "—"}\n` +
    `Desired Outcome: ${p.desiredOutcome || "—"}\n` +
    `Current Tools: ${p.currentTools || "—"}\n` +
    `Existing AI Usage: ${p.existingAIUsage || "—"}\n` +
    `Project Scope: ${p.projectScope || "—"}\n` +
    `Budget Range: ${p.budgetRange || "—"}\n` +
    `Weekly Hours on Process: ${p.weeklyHoursSpent || "—"}\n` +
    `Audit Document Type: ${p.auditDocType || "—"}\n` +
    `Primary Audit Goal: ${p.primaryGoal || "—"}`;
  return textDoc(text);
}

function buildFollowUpDescription(p: JiraLeadPayload): object {
  const actions =
    p.leadType === "Process Audit"
      ? "1. Review uploaded documents on Google Drive\n2. Prepare Process AI Audit dossier\n3. Schedule initial discovery call\n4. Send NDA if requested"
      : p.leadType === "Consultation"
        ? "1. Review consultation request details\n2. Qualify budget & scope\n3. Schedule strategy call\n4. Send proposal if qualified"
        : p.leadType === "Chatbot"
          ? "1. Review chatbot conversation summary\n2. Reach out within 24 hrs\n3. Qualify intent\n4. Route to appropriate consultant"
          : "1. Respond within 2 business hours\n2. Confirm requirement\n3. Route to correct form or book a call";

  const text =
    `✅ FOLLOW-UP ACTION CHECKLIST\n\n` +
    `Lead: ${p.name} (${p.email})\n` +
    `Type: ${p.leadType}\n\n` +
    `Recommended next steps:\n${actions}`;
  return textDoc(text);
}

function buildDocumentsDescription(p: JiraLeadPayload): object {
  const text =
    `📁 NDA & UPLOADED DOCUMENTS\n\n` +
    `NDA Requested: ${p.ndaRequested ? "✅ Yes" : "❌ No"}\n` +
    `Files Count: ${p.filesCount ?? "—"}\n` +
    `Files List: ${p.filesList || "—"}\n` +
    `Google Drive Link: ${p.driveLink || "—"}\n\n` +
    (p.ndaRequested ? `⚠️ NDA Required — send NDA before sharing any analysis results.` : "");
  return textDoc(text);
}

// ─── Active Sprint helper ─────────────────────────────────────────────────────

async function addToActiveSprint(issueKey: string): Promise<void> {
  const sprintId = process.env["JIRA_SPRINT_ID"] || process.env["VITE_JIRA_SPRINT_ID"];
  if (!sprintId) {
    console.log(`ℹ️ No JIRA_SPRINT_ID set — ${issueKey} will stay in Backlog.`);
    return;
  }
  try {
    const cfg = getJiraConfig();
    const auth = getAuthHeader();
    const res = await fetch(`${cfg.baseUrl}/rest/agile/1.0/sprint/${sprintId}/issue`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ issues: [issueKey] }),
    });
    if (res.ok) {
      console.log(`📌 Moved ${issueKey} to Active Sprint ${sprintId} (PP Board)`);
    } else {
      const errText = await res.text();
      console.warn(`Sprint assignment notice for ${issueKey}:`, errText.slice(0, 200));
    }
  } catch (err) {
    console.warn("⚠️ Could not add to active sprint:", err);
  }
}

// ─── Issue creator ────────────────────────────────────────────────────────────

async function createIssue(
  summary: string,
  description: object,
  issueType: "Task" | "Subtask",
  parentKey?: string,
): Promise<{ ok: boolean; key?: string; url?: string; error?: string }> {
  const cfg = getJiraConfig();
  const fields: Record<string, unknown> = {
    project: { key: cfg.projectKey },
    summary,
    description,
    issuetype: { name: issueType === "Subtask" ? "Subtask" : "Task" },
  };

  // Optionally assign to a specific account if JIRA_ASSIGNEE_ID is set
  const assigneeId = process.env["JIRA_ASSIGNEE_ID"] || process.env["VITE_JIRA_ASSIGNEE_ID"];
  if (assigneeId) {
    fields["assignee"] = { accountId: assigneeId };
  }

  if (issueType === "Subtask" && parentKey) {
    fields["parent"] = { key: parentKey };
  }

  // Attempt issue creation
  let result = await jiraPost("issue", { fields });

  // If assignee field fails, retry without assignee
  if (!result.ok && result.error && result.error.includes("assignee")) {
    console.warn("Assignee field rejected, retrying without assignee...");
    delete fields["assignee"];
    result = await jiraPost("issue", { fields });
  }

  if (!result.ok || !result.data) {
    return result.error ? { ok: false, error: result.error } : { ok: false };
  }

  const data = result.data as { key: string; id: string };

  // If this is a parent task, attach it to the active sprint so it shows on the Board view immediately!
  if (issueType === "Task") {
    await addToActiveSprint(data.key);
  }

  return {
    ok: true,
    key: data.key,
    url: `${cfg.baseUrl}/browse/${data.key}`,
  };
}

// ─── 13 Sub-Task Workflow Definitions ─────────────────────────────────────────

function build13SubTasks(p: JiraLeadPayload): Array<{ summary: string; desc: object }> {
  const leadName = p.name || "Inbound Lead";
  const leadEmail = p.email || "";
  const leadType = p.leadType || "Inbound Lead";

  return [
    {
      summary: `01. 📋 Contact Enrichment & Verification — ${leadName}`,
      desc: textDoc(
        `📋 STEP 1: CONTACT ENRICHMENT & VERIFICATION\n\n` +
        `• Full Name: ${leadName}\n` +
        `• Work Email: ${leadEmail || "—"}\n` +
        `• Phone Number: ${p.phone || "—"}\n` +
        `• Company: ${p.company || "—"}\n` +
        `• Job Title: ${p.jobTitle || "—"}\n` +
        `• Company Website: ${p.website || "—"}\n` +
        `• Preferred Contact Window: ${p.preferredContactTime || "—"}\n\n` +
        `Action Items:\n` +
        `[ ] Verify corporate email domain authenticity\n` +
        `[ ] Check company profile & team presence on LinkedIn\n` +
        `[ ] Confirm direct phone / WhatsApp reachability`
      ),
    },
    {
      summary: `02. 📝 Requirements & Problem Statement Analysis — ${leadType}`,
      desc: textDoc(
        `📝 STEP 2: REQUIREMENTS & PROBLEM STATEMENT ANALYSIS\n\n` +
        `• Lead Type: ${leadType}\n` +
        `• Primary Requirement: ${p.requirement || "—"}\n` +
        `• Operational Challenge / Message: ${p.challenge || p.processSummary || p.message || "—"}\n` +
        `• Desired Business Outcome: ${p.desiredOutcome || "—"}\n` +
        `• Time Invested Weekly on Bottleneck: ${p.weeklyHoursSpent ? `${p.weeklyHoursSpent} hours/week` : "—"}\n\n` +
        `Action Items:\n` +
        `[ ] Classify problem urgency and operational complexity\n` +
        `[ ] Formulate preliminary problem statement and impact assessment`
      ),
    },
    {
      summary: `03. 🔒 NDA & Confidentiality Clearance — ${leadName}`,
      desc: textDoc(
        `🔒 STEP 3: NDA & CONFIDENTIALITY CLEARANCE\n\n` +
        `• Mutual NDA Requested: ${p.ndaRequested ? "✅ YES — Mutual NDA Required" : "❌ Standard Privacy Policy"}\n` +
        `• Attached Documents: ${p.filesCount || 0} file(s)\n` +
        `• File Name(s): ${p.filesList || "—"}\n` +
        `• Document Type: ${p.auditDocType || "—"}\n` +
        `• Secure Drive Link: ${p.driveLink || "—"}\n\n` +
        `Action Items:\n` +
        (p.ndaRequested
          ? `[ ] Generate and dispatch bilateral Mutual NDA for e-signature\n[ ] Restrict document access until NDA execution`
          : `[ ] Ensure confidentiality compliance under standard terms`)
      ),
    },
    {
      summary: `04. 🔍 Technical & Architecture Feasibility Audit`,
      desc: textDoc(
        `🔍 STEP 4: TECHNICAL & ARCHITECTURE FEASIBILITY AUDIT\n\n` +
        `• Current Tech Stack / Tools: ${p.currentTools || "—"}\n` +
        `• Existing AI Adoption Level: ${p.existingAIUsage || "—"}\n` +
        `• Project Scope Defined: ${p.projectScope || "—"}\n` +
        `• Source Page: ${p.pageUrl || "—"}\n\n` +
        `Action Items:\n` +
        `[ ] Assess API integrations and compatibility with existing toolset\n` +
        `[ ] Evaluate data security, latency, and hosting requirements\n` +
        `[ ] Complete initial AI/automation feasibility matrix`
      ),
    },
    {
      summary: `05. 📊 Market & Industry Competitor Benchmarking`,
      desc: textDoc(
        `📊 STEP 5: MARKET & INDUSTRY BENCHMARKING\n\n` +
        `• Industry Vertical: ${p.industry || "—"}\n` +
        `• Organization Size Tier: ${p.companySize ? `${p.companySize} employees` : "—"}\n` +
        `• Market Tier: Enterprise / Growth\n\n` +
        `Action Items:\n` +
        `[ ] Research standard industry workflows and automation adoption\n` +
        `[ ] Identify competitive benchmarks and efficiency gain targets`
      ),
    },
    {
      summary: `06. 🎯 Strategic Solution Design & Blueprint`,
      desc: textDoc(
        `🎯 STEP 6: STRATEGIC SOLUTION DESIGN & BLUEPRINT\n\n` +
        `• Client: ${leadName} (${p.company || "Direct"})\n` +
        `• Core Objective: ${p.desiredOutcome || p.requirement || "Process Optimization"}\n\n` +
        `Action Items:\n` +
        `[ ] Draft solution architecture diagram and data pipeline flow\n` +
        `[ ] Map key integration points and AI models / agentic layers\n` +
        `[ ] Document estimated time-to-value and productivity ROI`
      ),
    },
    {
      summary: `07. 💰 Commercial Scoping & Budget Estimation`,
      desc: textDoc(
        `💰 STEP 7: COMMERCIAL SCOPING & BUDGET ESTIMATION\n\n` +
        `• Declared Budget Range: ${p.budgetRange || "Not defined yet"}\n` +
        `• Project Scope: ${p.projectScope || "—"}\n` +
        `• Engagement Model: Fixed Deliverable / Retainer Advisory\n\n` +
        `Action Items:\n` +
        `[ ] Calculate resource allocation & development sprint hours\n` +
        `[ ] Validate project scope feasibility against client budget\n` +
        `[ ] Define tiered commercial options (MVP vs. Full Transformation)`
      ),
    },
    {
      summary: `08. 📅 Stakeholder Discovery Call Scheduling`,
      desc: textDoc(
        `📅 STEP 8: STAKEHOLDER DISCOVERY CALL SCHEDULING\n\n` +
        `• Point of Contact: ${leadName} (${leadEmail})\n` +
        `• Preferred Contact Window: ${p.preferredContactTime || "Any time"}\n` +
        `• Direct Contact: ${p.phone || "Email preferred"}\n\n` +
        `Action Items:\n` +
        `[ ] Send calendar invite / booking link for 30-min strategy session\n` +
        `[ ] Dispatch pre-call briefing questionnaire\n` +
        `[ ] Confirm attendee list from client leadership team`
      ),
    },
    {
      summary: `09. 🎙️ Conduct Executive Discovery Session`,
      desc: textDoc(
        `🎙️ STEP 9: CONDUCT EXECUTIVE DISCOVERY SESSION\n\n` +
        `• Target Agenda: Deep dive into operational bottlenecks and workflows\n` +
        `• Key Focus Area: ${p.challenge || p.processSummary || p.requirement || "Operational efficiency"}\n\n` +
        `Action Items:\n` +
        `[ ] Host live discovery session with leadership\n` +
        `[ ] Record call minutes, technical constraints, and expectations\n` +
        `[ ] Confirm agreed target delivery timeline and milestone dates`
      ),
    },
    {
      summary: `10. 📑 Engagement Proposal & Dossier Generation`,
      desc: textDoc(
        `📑 STEP 10: ENGAGEMENT PROPOSAL & DOSSIER GENERATION\n\n` +
        `• Client: ${leadName} — ${p.company || "Independent"}\n` +
        `• Solution Category: ${leadType}\n\n` +
        `Action Items:\n` +
        `[ ] Compile comprehensive Executive Proposal & Roadmap Dossier\n` +
        `[ ] Include architecture diagram, milestone schedule, and pricing\n` +
        `[ ] Deliver proposal to client with executive walkthrough video/link`
      ),
    },
    {
      summary: `11. ✍️ SOW Finalization & Legal Sign-off`,
      desc: textDoc(
        `✍️ STEP 11: SOW FINALIZATION & LEGAL SIGN-OFF\n\n` +
        `• Contract Scope: Statement of Work (SOW) & Master Services Agreement\n\n` +
        `Action Items:\n` +
        `[ ] Finalize contract clauses, IP assignment, and SLAs\n` +
        `[ ] Dispatch digital contract for formal executive signatures\n` +
        `[ ] Verify initial retainer / milestone invoice clearance`
      ),
    },
    {
      summary: `12. 🚀 Client Onboarding & Environment Setup`,
      desc: textDoc(
        `🚀 STEP 12: CLIENT ONBOARDING & ENVIRONMENT SETUP\n\n` +
        `• Dedicated Channel: Slack Connect / Microsoft Teams\n` +
        `• Stakeholder: ${leadName} (${leadEmail})\n\n` +
        `Action Items:\n` +
        `[ ] Setup dedicated communication channel with client team\n` +
        `[ ] Receive credential handoffs (staging environment, APIs, tokens)\n` +
        `[ ] Schedule and confirm Phase 1 Sprint Kickoff date`
      ),
    },
    {
      summary: `13. 🏁 Milestone 1 Kickoff & Delivery`,
      desc: textDoc(
        `🏁 STEP 13: MILESTONE 1 KICKOFF & DELIVERY\n\n` +
        `• First Milestone Focus: ${p.desiredOutcome || p.requirement || "Sprint 1 Implementation"}\n\n` +
        `Action Items:\n` +
        `[ ] Conduct official Project Kickoff meeting\n` +
        `[ ] Spin up development sprint board and assign development backlog\n` +
        `[ ] Deliver initial Prototype / Sprint 1 review within agreed window`
      ),
    },
  ];
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Creates a Jira Task for every lead, plus 13 structured workflow sub-tasks.
 */
export async function createJiraLeadTask(payload: JiraLeadPayload): Promise<JiraCreateResult> {
  if (!isJiraConfigured()) {
    console.warn("⚠️ Jira not configured — skipping Jira task creation.");
    return { ok: false, error: "Jira credentials not configured." };
  }

  const dateStr = formatDate();
  const leadEmoji =
    payload.leadType === "Quick Form"
      ? "⚡"
      : payload.leadType === "Consultation"
        ? "🤝"
        : payload.leadType === "Process Audit"
          ? "🔍"
          : "🤖";

  const parentSummary = `${leadEmoji} [${payload.leadType}] ${payload.name} — ${dateStr}`;

  // 1. Create parent Task
  const parent = await createIssue(parentSummary, buildParentDescription(payload), "Task");
  if (!parent.ok || !parent.key) {
    console.error("❌ Failed to create Jira parent task:", parent.error);
    return parent.error ? { ok: false, error: parent.error } : { ok: false };
  }

  console.log(`✅ Jira parent task created: ${parent.key} → ${parent.url}`);

  // 2. Build 13 sub-tasks
  const subTaskDefs = build13SubTasks(payload);

  // 3. Create 13 sub-tasks sequentially to guarantee order and avoid Jira rate limits
  const subTaskKeys: string[] = [];
  for (const { summary, desc } of subTaskDefs) {
    const res = await createIssue(summary, desc, "Subtask", parent.key);
    if (res.ok && res.key) {
      subTaskKeys.push(res.key);
    } else {
      console.warn(`⚠️ Failed to create subtask "${summary}":`, res.error);
    }
  }

  console.log(`✅ Jira 13 sub-tasks created: [${subTaskKeys.join(", ")}] under ${parent.key}`);

  return {
    ok: true,
    parentIssueKey: parent.key,
    ...(parent.url ? { parentIssueUrl: parent.url } : {}),
    subTaskKeys,
  };
}

