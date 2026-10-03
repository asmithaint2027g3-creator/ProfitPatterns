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

export function getJiraConfig() {
  const baseUrl = (
    process.env["JIRA_BASE_URL"] ||
    process.env["VITE_JIRA_BASE_URL"] ||
    "https://trustworkz.atlassian.net"
  ).replace(/\/+$/, "");
  const email =
    process.env["JIRA_EMAIL"] ||
    process.env["VITE_JIRA_EMAIL"] ||
    "asmitha.int2027g3@gmail.com";
  const apiToken =
    process.env["JIRA_API_TOKEN"] ||
    process.env["VITE_JIRA_API_TOKEN"] ||
    "ATATT3xFfGF0kSxqsxW2VQB1HDoEK2a7Imd9ORnLk648J2sekIcpmqhL38amLPZHtYngemmMU3tCpbe3IykSL5dsvoNCDZot9vAtITRX7UBDJ_isvP2f0z_gZCu48PPy9tK_2YvwVomoY9h9REsDQVO0r97T_geEW6fH2sJji1r7djRFmlCPTjg=E5CC331B";
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

const ACTIVE_SPRINT_ID = "35";
const JANE_GRACY_ACCOUNT_ID = "712020:4a35214c-ba12-4524-a70a-699fdcfafb65";

async function addToActiveSprint(issueKey: string): Promise<void> {
  try {
    const cfg = getJiraConfig();
    const auth = getAuthHeader();
    const sprintId = process.env["JIRA_SPRINT_ID"] || ACTIVE_SPRINT_ID;
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
      console.log(`📌 Moved ${issueKey} from Backlog to Active Sprint ${sprintId} (DI Board)`);
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
    assignee: { accountId: JANE_GRACY_ACCOUNT_ID },
  };

  if (issueType === "Subtask" && parentKey) {
    fields["parent"] = { key: parentKey };
  }

  // Attempt creation with Jane Gracy assigned
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

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Creates a Jira Task for every lead, plus 3–4 sub-tasks depending on lead type.
 *
 * Sub-tasks:
 *   1. 📋 Contact Information
 *   2. 📝 Requirement & Business Context
 *   3. ✅ Follow-up Action Required
 *   4. 📁 NDA & Documents  (Audit leads only)
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

  // 2. Build sub-task list
  const subTaskDefs: Array<{ summary: string; desc: object }> = [
    {
      summary: `📋 Contact Info — ${payload.name}`,
      desc: buildContactInfoDescription(payload),
    },
    {
      summary: `📝 Requirement Details — ${payload.leadType}`,
      desc: buildRequirementDescription(payload),
    },
    {
      summary: `✅ Follow-up Actions — ${payload.name}`,
      desc: buildFollowUpDescription(payload),
    },
  ];

  // Audit leads get an extra sub-task for documents/NDA
  if (payload.leadType === "Process Audit") {
    subTaskDefs.push({
      summary: `📁 NDA & Documents — ${payload.name}`,
      desc: buildDocumentsDescription(payload),
    });
  }

  // 3. Create sub-tasks in parallel
  const subTaskResults = await Promise.all(
    subTaskDefs.map(({ summary, desc }) => createIssue(summary, desc, "Subtask", parent.key)),
  );

  const subTaskKeys = subTaskResults.filter((r) => r.ok && r.key).map((r) => r.key as string);

  const failedCount = subTaskResults.filter((r) => !r.ok).length;
  if (failedCount > 0) {
    console.warn(`⚠️ ${failedCount} sub-task(s) failed to create under ${parent.key}`);
  }

  console.log(`✅ Jira sub-tasks created: [${subTaskKeys.join(", ")}] under ${parent.key}`);

  return {
    ok: true,
    parentIssueKey: parent.key,
    ...(parent.url ? { parentIssueUrl: parent.url } : {}),
    subTaskKeys,
  };
}

