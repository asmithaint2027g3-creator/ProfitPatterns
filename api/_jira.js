// api/_jira.js
// Self-contained Jira Integration Helper for Vercel Serverless Functions

// ✅ Defaults → trustworkz.atlassian.net | DealFlow_INT2027G3 (Project: DI)
const DEFAULT_BASE_URL = "https://trustworkz.atlassian.net";
const DEFAULT_EMAIL = "asmitha.int2027g3@gmail.com";
const DEFAULT_API_TOKEN =
  "ATATT3xFfGF0ZI9BTfm9JkdD0PjvWYle6DBxrQ0puxXIYMLqPb_Ry6QRoWY5LdRdLZyo43BBROTkba4IkJKl9thc3kyfhzmcrSp0bbS0mBw7s3WtYru5bvKv0gSdAz_BOODzmyINlLASkjXkF0z26smsi67zb4aJidlw6e2Uif6MEsfaxmVvJeI=E7953F81";
const DEFAULT_PROJECT_KEY = "DI";


// In-memory deduplication cache: key -> { key: string, timestamp: number }
const recentLeads = new Map();

export function getJiraConfig() {
  const baseUrl = (
    process.env.JIRA_BASE_URL ||
    process.env.VITE_JIRA_BASE_URL ||
    DEFAULT_BASE_URL
  ).replace(/\/+$/, "");
  const email =
    process.env.JIRA_EMAIL ||
    process.env.VITE_JIRA_EMAIL ||
    DEFAULT_EMAIL;
  const apiToken =
    process.env.JIRA_API_TOKEN ||
    process.env.VITE_JIRA_API_TOKEN ||
    DEFAULT_API_TOKEN;
  const projectKey =
    process.env.JIRA_PROJECT_KEY ||
    process.env.VITE_JIRA_PROJECT_KEY ||
    DEFAULT_PROJECT_KEY;

  return { baseUrl, email, apiToken, projectKey };
}

function getAuthHeader() {
  const cfg = getJiraConfig();
  const creds = `${cfg.email}:${cfg.apiToken}`;
  return `Basic ${Buffer.from(creds).toString("base64")}`;
}

function formatDate() {
  return new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

function textDoc(text) {
  return {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: String(text || "—") }],
      },
    ],
  };
}

async function jiraPost(endpoint, body) {
  const cfg = getJiraConfig();
  try {
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
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      console.error(`Jira API error [${res.status}]:`, text.slice(0, 500));
      return { ok: false, error: `Jira API returned ${res.status}: ${text.slice(0, 200)}`, status: res.status };
    }

    return { ok: true, data };
  } catch (err) {
    console.error("Jira network error:", err);
    return { ok: false, error: String(err) };
  }
}

async function addToActiveSprint(issueKey) {
  const sprintId = process.env.JIRA_SPRINT_ID || process.env.VITE_JIRA_SPRINT_ID;
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
    console.warn("Could not add to active sprint:", err);
  }
}

async function createIssue(summary, description, issueType, parentKey) {
  const cfg = getJiraConfig();
  const fields = {
    project: { key: cfg.projectKey },
    summary: summary.slice(0, 250),
    description,
    issuetype: { name: issueType === "Subtask" ? "Subtask" : "Task" },
  };

  // Optionally assign to a specific account if JIRA_ASSIGNEE_ID is set
  const assigneeId = process.env.JIRA_ASSIGNEE_ID || process.env.VITE_JIRA_ASSIGNEE_ID;
  if (assigneeId) {
    fields.assignee = { accountId: assigneeId };
  }

  if (issueType === "Subtask" && parentKey) {
    fields["parent"] = { key: parentKey };
  }

  // Attempt issue creation
  let result = await jiraPost("issue", { fields });

  // If assignee fails due to permissions, fallback to unassigned
  if (!result.ok && result.error && result.error.includes("assignee")) {
    console.warn("Assignee field rejected, retrying without assignee...");
    delete fields.assignee;
    result = await jiraPost("issue", { fields });
  }

  if (!result.ok || !result.data) {
    return { ok: false, error: result.error || "Failed to create issue" };
  }

  const data = result.data;

  // Move parent lead task from backlog into active sprint board
  if (issueType === "Task") {
    await addToActiveSprint(data.key);
  }

  return {
    ok: true,
    key: data.key,
    url: `${cfg.baseUrl}/browse/${data.key}`,
  };
}

export async function createJiraLeadTask(p) {
  const leadName = p.name || p.fullName || "Inbound Lead";
  const leadEmail = (p.email || p.workEmail || "").toLowerCase();
  const leadType = p.leadType || (p.docType ? "Process Audit" : p.workEmail ? "Consultation" : "Quick Form");

  // Deduplication check: 15 second window
  const dedupKey = `${leadEmail}_${leadType}`;
  const now = Date.now();
  const cached = recentLeads.get(dedupKey);
  if (cached && now - cached.timestamp < 15000) {
    console.log(`⚡ Deduplication hit: returning existing Jira key ${cached.key} for ${dedupKey}`);
    return { ok: true, parentIssueKey: cached.key, deduplicated: true };
  }

  const dateStr = formatDate();
  const emoji =
    leadType === "Quick Form"
      ? "⚡"
      : leadType === "Consultation"
        ? "🤝"
        : leadType === "Process Audit"
          ? "🔍"
          : "🤖";

  const parentSummary = `${emoji} [${leadType}] ${leadName} — ${dateStr}`;

  // 1. Parent Task Description
  const parentDesc = textDoc(
    `📊 LEAD OVERVIEW\n` +
    `Lead Type: ${leadType}\n` +
    `Contact Name: ${leadName}\n` +
    `Email: ${leadEmail || "—"}\n` +
    `Phone: ${p.phone || "—"}\n` +
    `Company: ${p.company || "—"}\n` +
    `Job Title: ${p.jobTitle || "—"}\n` +
    `Source Page: ${p.pageUrl || p.page_url || "—"}\n` +
    `Submitted: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}\n\n` +
    `Sub-tasks below contain Contact Information, Detailed Requirements, and Follow-up Actions.`
  );

  // 2. Create Parent Task
  const parent = await createIssue(parentSummary, parentDesc, "Task");
  if (!parent.ok || !parent.key) {
    console.error("❌ Failed to create Jira parent task:", parent.error);
    return { ok: false, error: parent.error };
  }

  // Cache for deduplication
  recentLeads.set(dedupKey, { key: parent.key, timestamp: now });

  // 3. Build 13 structured sub-tasks
  const subTasks = [
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
        `• Primary Requirement: ${p.requirement || p.primaryChallenge || p.primaryGoal || "—"}\n` +
        `• Operational Challenge / Message: ${p.challenge || p.currentChallenge || p.message || p.processSummary || "—"}\n` +
        `• Desired Business Outcome: ${p.desiredOutcome || p.desired_outcome || "—"}\n` +
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
        `• Attached Documents: ${p.filesCount || (p.fileName ? 1 : 0)} file(s)\n` +
        `• File Name(s): ${p.fileName || p.filesList || "—"}\n` +
        `• Document Type: ${p.docType || p.auditDocType || "—"}\n` +
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
        `• Source Page: ${p.pageUrl || p.page_url || "—"}\n\n` +
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
        `• Core Objective: ${p.desiredOutcome || p.desired_outcome || p.requirement || "Process Optimization"}\n\n` +
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
        `• Key Focus Area: ${p.challenge || p.currentChallenge || p.message || p.processSummary || "Operational efficiency"}\n\n` +
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
        `• First Milestone Focus: ${p.desiredOutcome || p.desired_outcome || p.requirement || "Sprint 1 Implementation"}\n\n` +
        `Action Items:\n` +
        `[ ] Conduct official Project Kickoff meeting\n` +
        `[ ] Spin up development sprint board and assign development backlog\n` +
        `[ ] Deliver initial Prototype / Sprint 1 review within agreed window`
      ),
    },
  ];

  // Create 13 sub-tasks sequentially to guarantee order and avoid Jira rate limits
  const subTaskKeys = [];
  for (const st of subTasks) {
    const res = await createIssue(st.summary, st.desc, "Subtask", parent.key);
    if (res.ok && res.key) {
      subTaskKeys.push(res.key);
    } else {
      console.warn(`⚠️ Failed to create subtask "${st.summary}":`, res.error);
    }
  }

  console.log(`✅ Jira Lead Created: ${parent.key} with 13 sub-tasks: [${subTaskKeys.join(", ")}]`);

  return {
    ok: true,
    parentIssueKey: parent.key,
    parentIssueUrl: parent.url,
    subTaskKeys,
  };
}
