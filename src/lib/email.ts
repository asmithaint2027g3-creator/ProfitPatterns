/**
 * =============================================================================
 * PROFITPATTERNS — EMAIL AUTOMATION MODULE (via Resend)
 * =============================================================================
 * Sends two emails for every lead:
 *  1. Team Alert  → asmitha.int2027g3@gmail.com (full lead details)
 *  2. Client Confirmation → lead's email (thank you + next steps)
 *
 * Uses Resend REST API (no npm package needed).
 * Set RESEND_API_KEY in .env to activate.
 * =============================================================================
 */

const RESEND_API_KEY = process.env["RESEND_API_KEY"] || "";
const FROM_EMAIL = "ProfitPatterns <onboarding@resend.dev>";
const TEAM_EMAIL = process.env["TEAM_ALERT_EMAIL"] || "asmitha.int2027g3@gmail.com";
const SITE_URL = "https://profit-patterns-xi.vercel.app";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EmailLeadPayload {
  leadType: "Quick Form" | "Consultation" | "Process Audit" | "Chatbot";
  name: string;
  email: string;
  phone?: string | null | undefined;
  company?: string | null | undefined;
  jobTitle?: string | null | undefined;
  industry?: string | null | undefined;
  companySize?: string | null | undefined;
  website?: string | null | undefined;
  requirement?: string | null | undefined;
  challenge?: string | null | undefined;
  desiredOutcome?: string | null | undefined;
  currentTools?: string | null | undefined;
  existingAIUsage?: string | null | undefined;
  projectScope?: string | null | undefined;
  budgetRange?: string | null | undefined;
  preferredContactTime?: string | null | undefined;
  message?: string | null | undefined;
  auditDocType?: string | null | undefined;
  weeklyHoursSpent?: string | null | undefined;
  primaryGoal?: string | null | undefined;
  processSummary?: string | null | undefined;
  filesCount?: number | undefined;
  filesList?: string | null | undefined;
  ndaRequested?: boolean | undefined;
  driveLink?: string | null | undefined;
  pageUrl?: string | undefined;
  jiraTaskKey?: string | null | undefined;
  jiraTaskUrl?: string | null | undefined;
}

// ─── Resend API helper ────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("⚠️ RESEND_API_KEY not set — skipping email.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("❌ Resend error:", res.status, err.slice(0, 200));
      return false;
    }
    console.log("✅ Email sent to:", to);
    return true;
  } catch (e) {
    console.error("❌ Email network error:", e);
    return false;
  }
}

// ─── Shared HTML helpers ──────────────────────────────────────────────────────

function field(label: string, value: string | number | boolean | undefined | null): string {
  if (!value && value !== 0 && value !== false) return "";
  return `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:#94a3b8;white-space:nowrap;width:180px;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;font-size:13px;color:#e2e8f0;vertical-align:top">${String(value)}</td>
    </tr>`;
}

function section(title: string, rows: string): string {
  if (!rows.trim()) return "";
  return `
    <div style="margin-bottom:24px">
      <div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#7c3aed;margin-bottom:8px">${title}</div>
      <table style="width:100%;border-collapse:collapse;background:#0f172a;border-radius:8px;overflow:hidden">
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function badge(text: string, color: string): string {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:0.5px;background:${color};color:#fff">${text}</span>`;
}

function leadBadge(leadType: string): string {
  const map: Record<string, string> = {
    "Quick Form": "#2563eb",
    "Consultation": "#7c3aed",
    "Process Audit": "#059669",
    "Chatbot": "#d97706",
  };
  return badge(leadType, map[leadType] || "#6b7280");
}

const baseStyle = `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#020817;color:#e2e8f0;margin:0;padding:0`;
const containerStyle = `max-width:640px;margin:0 auto;padding:32px 16px`;
const cardStyle = `background:#0f172a;border:1px solid #1e293b;border-radius:16px;padding:32px;margin-bottom:16px`;
const headerStyle = `background:linear-gradient(135deg,#7c3aed,#2563eb);border-radius:12px;padding:28px;margin-bottom:24px;text-align:center`;

// ─── TEAM ALERT EMAIL ─────────────────────────────────────────────────────────

function buildTeamAlertHtml(p: EmailLeadPayload): string {
  const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });
  const jiraLink = p.jiraTaskKey
    ? `<a href="${p.jiraTaskUrl}" style="color:#7c3aed;text-decoration:none;font-weight:600">${p.jiraTaskKey} — View in Jira →</a>`
    : "—";

  const contactRows =
    field("Full Name", p.name) +
    field("Email", p.email) +
    field("Phone", p.phone) +
    field("Company", p.company) +
    field("Job Title", p.jobTitle) +
    field("Industry", p.industry) +
    field("Company Size", p.companySize) +
    field("Website", p.website) +
    field("Preferred Contact Time", p.preferredContactTime);

  const requirementRows =
    field("Primary Requirement", p.requirement || p.primaryGoal) +
    field("Challenge / Problem", p.challenge || p.processSummary || p.message) +
    field("Desired Outcome", p.desiredOutcome) +
    field("Current Tools", p.currentTools) +
    field("Existing AI Usage", p.existingAIUsage) +
    field("Project Scope", p.projectScope) +
    field("Budget Range", p.budgetRange);

  const auditRows =
    field("Audit Document Type", p.auditDocType) +
    field("Weekly Hours on Process", p.weeklyHoursSpent) +
    field("Primary Audit Goal", p.primaryGoal) +
    field("Files Count", p.filesCount) +
    field("Files List", p.filesList) +
    field("NDA Requested", p.ndaRequested ? "✅ Yes — send NDA first" : undefined) +
    field("Google Drive Link", p.driveLink);

  const metaRows =
    field("Source Page", p.pageUrl) +
    field("Received At", now) +
    field("Jira Task", p.jiraTaskKey ? `${p.jiraTaskKey}` : undefined);

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>New ${p.leadType} Lead</title></head>
<body style="${baseStyle}">
<div style="${containerStyle}">
  <div style="${headerStyle}">
    <div style="font-size:28px;margin-bottom:8px">${p.leadType === "Process Audit" ? "🔍" : p.leadType === "Consultation" ? "🤝" : p.leadType === "Chatbot" ? "🤖" : "⚡"}</div>
    <div style="font-size:22px;font-weight:700;color:#fff;margin-bottom:6px">New Lead Received</div>
    <div style="margin-bottom:12px">${leadBadge(p.leadType)}</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.8)">${p.name} — ${now}</div>
  </div>

  <div style="${cardStyle}">
    ${p.jiraTaskKey ? `
    <div style="background:#1e1b4b;border:1px solid #7c3aed;border-radius:10px;padding:14px 18px;margin-bottom:24px;display:flex;align-items:center;gap:12px">
      <span style="font-size:20px">🎯</span>
      <div>
        <div style="font-size:11px;color:#a78bfa;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px">Jira Task Created</div>
        <div style="font-size:14px">${jiraLink}</div>
      </div>
    </div>` : ""}

    ${section("📋 Contact Information", contactRows)}
    ${section("📝 Requirement & Business Context", requirementRows)}
    ${p.leadType === "Process Audit" ? section("📁 Audit & Documents", auditRows) : ""}
    ${section("🔗 Submission Meta", metaRows)}

    <div style="margin-top:24px;border-top:1px solid #1e293b;padding-top:20px">
      <div style="font-size:12px;color:#64748b;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600">Next Steps</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a href="mailto:${p.email}" style="background:#7c3aed;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600">Reply to Lead →</a>
        <a href="https://wa.me/${(p.phone || "").replace(/\D/g, "")}" style="background:#16a34a;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600">WhatsApp →</a>
        ${p.jiraTaskUrl ? `<a href="${p.jiraTaskUrl}" style="background:#1e40af;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:600">Open Jira →</a>` : ""}
      </div>
    </div>
  </div>
</div>
</body></html>`;
}

// ─── CLIENT CONFIRMATION EMAIL ────────────────────────────────────────────────

function buildClientConfirmationHtml(p: EmailLeadPayload): string {
  const nextSteps =
    p.leadType === "Process Audit"
      ? ["We are reviewing your uploaded documents carefully.", "Our team will prepare a detailed AI Audit Assessment report.", "You will receive an initial findings call within 2–3 business days.", "If you requested an NDA, we will send it to you first."]
      : p.leadType === "Consultation"
        ? ["Our strategist is reviewing your consultation request.", "We will qualify your challenge and match the right expert.", "Expect a strategy call booking link within 24 hours.", "Please check your email and WhatsApp for updates."]
        : p.leadType === "Chatbot"
          ? ["Your enquiry from our AI assistant has been logged.", "Our team is reviewing your business challenge.", "We will reach out within 24 hours with next steps.", "Feel free to reply to this email anytime."]
          : ["Your enquiry has been received by our team.", "We typically respond within 2 business hours.", "Our consultant will confirm your requirement and suggest the best path.", "Feel free to WhatsApp us for a faster response."];

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>We've received your submission</title></head>
<body style="${baseStyle}">
<div style="${containerStyle}">
  <div style="${headerStyle}">
    <div style="font-size:40px;margin-bottom:10px">✅</div>
    <div style="font-size:22px;font-weight:700;color:#fff;margin-bottom:6px">Submission Confirmed</div>
    <div style="font-size:14px;color:rgba(255,255,255,0.8)">ProfitPatterns has received your ${p.leadType} request</div>
  </div>

  <div style="${cardStyle}">
    <div style="font-size:16px;margin-bottom:20px;color:#e2e8f0">
      Hi <strong>${p.name}</strong>,<br><br>
      Thank you for reaching out to <strong>ProfitPatterns</strong>. We have received your enquiry and our team is already reviewing it.
    </div>

    <div style="background:#0a0f1e;border-radius:10px;padding:20px;margin-bottom:24px">
      <div style="font-size:11px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px">What happens next</div>
      ${nextSteps.map((step, i) => `
        <div style="display:flex;gap:14px;margin-bottom:12px;align-items:flex-start">
          <div style="min-width:26px;height:26px;border-radius:50%;background:#7c3aed;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0">${i + 1}</div>
          <div style="font-size:14px;color:#cbd5e1;padding-top:4px">${step}</div>
        </div>`).join("")}
    </div>

    <div style="background:#0a0f1e;border-radius:10px;padding:18px;margin-bottom:24px">
      <div style="font-size:11px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:12px">Your submission summary</div>
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${field("Name", p.name)}
          ${field("Company", p.company)}
          ${field("Primary Need", p.requirement || p.primaryGoal || p.message)}
          ${p.leadType === "Process Audit" ? field("Files Uploaded", `${p.filesCount} document(s)`) : ""}
        </tbody>
      </table>
    </div>

    <div style="text-align:center;margin-bottom:8px">
      <a href="https://wa.me/919876543210?text=Hi%20ProfitPatterns%2C%20I%20just%20submitted%20a%20${encodeURIComponent(p.leadType)}%20form%20and%20would%20like%20to%20discuss." 
         style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#2563eb);color:#fff;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:700;margin-bottom:12px">
        💬 Chat on WhatsApp
      </a>
    </div>
    <div style="text-align:center;font-size:12px;color:#64748b">
      Or reply directly to this email — we read every message.
    </div>
  </div>

  <div style="text-align:center;font-size:12px;color:#475569;padding:8px">
    <a href="${SITE_URL}" style="color:#7c3aed;text-decoration:none">ProfitPatterns</a> — AI Strategy & Automation for Growing Businesses<br>
    <a href="${SITE_URL}/privacy" style="color:#475569;text-decoration:none">Privacy Policy</a>
  </div>
</div>
</body></html>`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Sends both emails for a lead submission:
 * 1. Team alert  → TEAM_EMAIL (full lead details + Jira link)
 * 2. Client confirmation → lead's email (thank you + next steps)
 */
export async function sendLeadEmails(payload: EmailLeadPayload): Promise<void> {
  const leadEmoji = { "Quick Form": "⚡", "Consultation": "🤝", "Process Audit": "🔍", "Chatbot": "🤖" }[payload.leadType] || "📩";

  const teamSubject = `${leadEmoji} New ${payload.leadType} Lead — ${payload.name}${payload.company ? ` (${payload.company})` : ""}`;
  const clientSubject = `✅ We've received your submission — ProfitPatterns`;

  // Send both emails concurrently
  const [teamOk, clientOk] = await Promise.all([
    sendEmail(TEAM_EMAIL, teamSubject, buildTeamAlertHtml(payload)),
    sendEmail(payload.email, clientSubject, buildClientConfirmationHtml(payload)),
  ]);

  if (teamOk) console.log("✅ Team alert email sent:", teamSubject);
  if (clientOk) console.log("✅ Client confirmation sent to:", payload.email);
}
