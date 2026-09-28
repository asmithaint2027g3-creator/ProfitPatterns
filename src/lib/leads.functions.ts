import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import {
  auditLeadSchema,
  chatLeadSchema,
  consultationLeadSchema,
  quickLeadSchema,
  type LeadSubmitResult,
} from "./leads";
import { createJiraLeadTask } from "./jira";
import { sendLeadEmails } from "./email";

// ─── Rate Limiting ────────────────────────────────────────────────────────────

const RATE_LIMIT_MAX = 100;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const submissions = new Map<string, number[]>();

function clientKey(): string {
  try {
    const request = getRequest();
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("cf-connecting-ip") || "unknown";
    const ua = request.headers.get("user-agent")?.slice(0, 80) ?? "";
    return `${ip}|${ua}`;
  } catch {
    return "unknown";
  }
}

function withinRateLimit(): boolean {
  const key = clientKey();
  const now = Date.now();
  const timestamps = (submissions.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) return false;
  timestamps.push(now);
  submissions.set(key, timestamps);
  return true;
}

function clean(value: string | undefined | null): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue.slice(0, 2000) : null;
}

const GENERIC_ERROR = "We couldn't send your message just now. Please try again, or reach us on WhatsApp.";

// ─── Google Sheets (via Apps Script) ─────────────────────────────────────────

const APPS_SCRIPT_URL =
  process.env["VITE_ANALYTICS_URL"] ||
  process.env["APPS_SCRIPT_URL"] ||
  "https://script.google.com/macros/s/AKfycbyOIQwm57GAUL1Jo_d_yP3ELGHTYXulzkqWV9KHOx7DXLloBLs430EL3dbmhZP89FQ/exec";

async function forwardLeadToGoogleSheets(leadPayload: Record<string, unknown>): Promise<void> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(leadPayload),
    });
    if (!response.ok) console.error("Google Sheets submission failed:", response.status);
    else console.log("✅ Lead saved to Google Sheets");
  } catch (error) {
    console.error("Google Sheets error:", error);
  }
}

// ─── Airtable (Lead Storage) ──────────────────────────────────────────────────

interface AirtableLeadPayload {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  jobTitle?: string | undefined;
  industry?: string | undefined;
  leadType: string;
  requirement?: string | undefined;
  message?: string | undefined;
  pageUrl?: string | undefined;
}

async function saveToAirtable(lead: AirtableLeadPayload): Promise<void> {
  const token =
    process.env["AIRTABLE_PERSONAL_ACCESS_TOKEN"] ||
    process.env["VITE_AIRTABLE_PERSONAL_ACCESS_TOKEN"];
  const baseId =
    process.env["AIRTABLE_BASE_ID"] ||
    process.env["VITE_AIRTABLE_BASE_ID"];
  const tableName =
    process.env["AIRTABLE_TABLE_NAME"] ||
    process.env["VITE_AIRTABLE_TABLE_NAME"] ||
    "Leads";

  if (!token || !baseId || baseId.startsWith("pat")) return;

  try {
    const fields: Record<string, string> = { Name: lead.name, Email: lead.email, Status: "New" };
    if (lead.phone) fields["Phone"] = lead.phone;
    if (lead.company) fields["Company"] = lead.company;
    if (lead.jobTitle) fields["Job Title"] = lead.jobTitle;
    if (lead.industry) fields["Industry"] = lead.industry;
    if (lead.leadType) fields["Lead Type"] = lead.leadType;
    if (lead.requirement) fields["Requirement"] = lead.requirement;
    if (lead.message) fields["Message"] = lead.message;
    if (lead.pageUrl) fields["Source Page"] = lead.pageUrl;

    const res = await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ fields, typecast: true }),
    });

    if (!res.ok) console.error("Airtable save failed:", res.status, await res.text());
    else console.log("✅ Lead saved to Airtable");
  } catch (e) {
    console.error("Airtable error:", e);
  }
}

// ─── Background Automation Runner ─────────────────────────────────────────────
//
// Runs for every lead submission — all 4 destinations in parallel:
//   1. ✅ Google Sheets  (telemetry / analytics)
//   2. ✅ Airtable       (lead database / CRM)
//   3. ✅ Jira           (Task + Sub-tasks created automatically)
//   4. ✅ Email          (Team alert + Client confirmation via Resend)
//
// Called with `void` so it NEVER blocks the form success response.

interface AutomationPayload {
  leadType: "Quick Form" | "Consultation" | "Process Audit" | "Chatbot";
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  industry?: string | null;
  companySize?: string | null;
  website?: string | null;
  requirement?: string | null;
  challenge?: string | null;
  desiredOutcome?: string | null;
  currentTools?: string | null;
  existingAIUsage?: string | null;
  projectScope?: string | null;
  budgetRange?: string | null;
  preferredContactTime?: string | null;
  message?: string | null;
  auditDocType?: string | null;
  weeklyHoursSpent?: string | null;
  primaryGoal?: string | null;
  processSummary?: string | null;
  filesCount?: number;
  filesList?: string;
  ndaRequested?: boolean;
  driveLink?: string | null;
  pageUrl?: string;
  // Google Sheets specific
  sheetsPayload: Record<string, unknown>;
}

async function runLeadAutomations(p: AutomationPayload): Promise<void> {
  // Run all destinations concurrently with Promise.allSettled so serverless functions don't terminate prematurely
  const promises: Promise<unknown>[] = [
    // 1. Google Sheets
    forwardLeadToGoogleSheets(p.sheetsPayload).catch((err) =>
      console.error("Google Sheets error:", err),
    ),
    // 2. Airtable
    saveToAirtable({
      name: p.name,
      email: p.email,
      phone: p.phone || undefined,
      company: p.company || undefined,
      jobTitle: p.jobTitle || undefined,
      industry: p.industry || undefined,
      leadType: p.leadType,
      requirement: p.requirement || p.primaryGoal || undefined,
      message: [
        p.challenge || p.message || p.processSummary,
        p.budgetRange ? `💰 Budget: ${p.budgetRange}` : null,
        p.projectScope ? `📐 Project Scope: ${p.projectScope}` : null,
        p.weeklyHoursSpent ? `⏱️ Weekly Hours Spent: ${p.weeklyHoursSpent}` : null,
        p.currentTools ? `🛠️ Tools Used: ${p.currentTools}` : null,
        p.existingAIUsage ? `🤖 Current AI Usage: ${p.existingAIUsage}` : null,
        p.desiredOutcome ? `🎯 Desired Outcome: ${p.desiredOutcome}` : null,
        p.auditDocType ? `📄 Audit Doc Type: ${p.auditDocType}` : null,
        p.driveLink ? `📁 Google Drive Link: ${p.driveLink}` : null,
        p.filesList ? `📎 Files: ${p.filesList}` : null,
        p.companySize ? `👥 Company Size: ${p.companySize}` : null,
        p.preferredContactTime ? `⏰ Preferred Contact Time: ${p.preferredContactTime}` : null,
        p.ndaRequested ? `🔒 NDA Requested: Yes` : null,
      ].filter(Boolean).join("\n\n") || undefined,
      pageUrl: p.pageUrl,
    }).catch((err) => console.error("Airtable error:", err)),
    // 3. Jira Task + Subtasks → then Email
    (async () => {
      try {
        const jiraResult = await createJiraLeadTask({
          leadType: p.leadType,
          name: p.name,
          email: p.email,
          phone: p.phone,
          company: p.company,
          jobTitle: p.jobTitle,
          industry: p.industry,
          companySize: p.companySize,
          website: p.website,
          requirement: p.requirement,
          challenge: p.challenge,
          desiredOutcome: p.desiredOutcome,
          currentTools: p.currentTools,
          existingAIUsage: p.existingAIUsage,
          projectScope: p.projectScope,
          budgetRange: p.budgetRange,
          preferredContactTime: p.preferredContactTime,
          message: p.message,
          auditDocType: p.auditDocType,
          weeklyHoursSpent: p.weeklyHoursSpent,
          primaryGoal: p.primaryGoal,
          processSummary: p.processSummary,
          filesCount: p.filesCount,
          filesList: p.filesList,
          ndaRequested: p.ndaRequested,
          driveLink: p.driveLink,
          pageUrl: p.pageUrl,
          leadStatus: "New",
        });

        if (jiraResult.ok) {
          console.log(`✅ Jira: ${jiraResult.parentIssueKey} | Sub-tasks: [${jiraResult.subTaskKeys?.join(", ")}]`);
        }

        await sendLeadEmails({
          ...p,
          jiraTaskKey: jiraResult.ok ? jiraResult.parentIssueKey : undefined,
          jiraTaskUrl: jiraResult.ok ? jiraResult.parentIssueUrl : undefined,
        });
      } catch (e) {
        console.error("Jira/Email automation error:", e);
        await sendLeadEmails({ ...p });
      }
    })(),
  ];

  await Promise.allSettled(promises);
}

// ─── Form Handlers ────────────────────────────────────────────────────────────

// ── ⚡ Quick Form ──────────────────────────────────────────────────────────────
export const submitQuickLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => quickLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };
    if (!withinRateLimit()) return { ok: false, error: "Too many submissions. Please try again in a few minutes." };

    const pageUrl = `https://profit-patterns-xi.vercel.app${clean(data.page) ?? "/contact"}`;

    await runLeadAutomations({
      leadType: "Quick Form",
      name: data.name,
      email: data.email.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      requirement: clean(data.requirement),
      message: clean(data.message),
      pageUrl,
      sheetsPayload: {
        type: "lead",
        event_type: "lead",
        event_name: "lead_submit",
        lead_type: "QUICK_FORM",
        name: data.name,
        email: data.email.toLowerCase(),
        phone: clean(data.phone) || "",
        company: clean(data.company) || "",
        requirement: clean(data.requirement) || "",
        message: clean(data.message) || "",
        lead_source: clean(data.source) ?? "quick_form",
        form_name: "Quick Contact Form",
        lead_status: "New",
        follow_up_status: "Pending",
        consent_status: "Granted",
        conversion_name: "Quick Lead Submission",
        conversion_value: 1,
        page_url: pageUrl,
        page_path: clean(data.page) ?? "/contact",
        source_environment: "production",
      },
    });

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { ok: true, id: leadId };
  });

// ── 🤝 Consultation Form ───────────────────────────────────────────────────────
export const submitConsultationLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => consultationLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };
    if (!withinRateLimit()) return { ok: false, error: "Too many submissions. Please try again in a few minutes." };

    const pageUrl = `https://profit-patterns-xi.vercel.app${clean(data.page) ?? "/contact"}`;

    await runLeadAutomations({
      leadType: "Consultation",
      name: data.fullName,
      email: data.workEmail.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      jobTitle: clean(data.jobTitle),
      industry: clean(data.industry),
      companySize: clean(data.companySize),
      website: clean(data.website),
      requirement: clean(data.primaryChallenge),
      challenge: clean(data.currentChallenge),
      desiredOutcome: clean(data.desiredOutcome),
      currentTools: clean(data.currentTools),
      existingAIUsage: clean(data.existingAIUsage),
      projectScope: clean(data.projectScope),
      budgetRange: clean(data.budgetRange),
      preferredContactTime: clean(data.preferredContactTime),
      pageUrl,
      sheetsPayload: {
        type: "lead",
        event_type: "lead",
        event_name: "lead_submit",
        lead_type: "LONG_FORM",
        name: data.fullName,
        email: data.workEmail.toLowerCase(),
        phone: clean(data.phone) || "",
        company: clean(data.company) || "",
        job_title: clean(data.jobTitle) || "",
        industry: clean(data.industry) || "",
        company_size: clean(data.companySize) || "",
        website: clean(data.website) || "",
        requirement: clean(data.primaryChallenge) || "",
        challenge: clean(data.currentChallenge) || "",
        desired_outcome: clean(data.desiredOutcome) || "",
        current_tools: clean(data.currentTools) || "",
        existing_ai_usage: clean(data.existingAIUsage) || "",
        project_scope: clean(data.projectScope) || "",
        budget_range: clean(data.budgetRange) || "",
        preferred_contact_time: clean(data.preferredContactTime) || "",
        lead_source: clean(data.source) ?? "long_form",
        form_name: "Consultation Request Form",
        lead_status: "New",
        follow_up_status: "Pending",
        consent_status: "Granted",
        conversion_name: "Consultation Request",
        conversion_value: 1,
        page_url: pageUrl,
        page_path: clean(data.page) ?? "/contact",
        source_environment: "production",
      },
    });

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { ok: true, id: leadId };
  });

// ── 🤖 Chatbot Lead ────────────────────────────────────────────────────────────
export const submitChatLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => chatLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };
    if (!withinRateLimit()) return { ok: false, error: "Too many submissions. Please try again in a few minutes." };

    const pageUrl = `https://profit-patterns-xi.vercel.app${clean(data.page) ?? "/"}`;

    await runLeadAutomations({
      leadType: "Chatbot",
      name: data.name,
      email: data.email.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      requirement: clean(data.intent),
      challenge: clean(data.businessProblem),
      pageUrl,
      sheetsPayload: {
        type: "lead",
        event_type: "lead",
        event_name: "lead_submit",
        lead_type: "CHATBOT",
        name: data.name,
        email: data.email.toLowerCase(),
        phone: clean(data.phone) || "",
        company: clean(data.company) || "",
        requirement: clean(data.intent) || "",
        challenge: clean(data.businessProblem) || "",
        lead_source: "assistant_chatbot",
        form_name: "Interactive AI Assistant",
        lead_status: "New",
        follow_up_status: "Pending",
        consent_status: "Granted",
        conversion_name: "Assistant Lead Submission",
        conversion_value: 1,
        page_url: pageUrl,
        page_path: clean(data.page) ?? "/",
        source_environment: "production",
      },
    });

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { ok: true, id: leadId };
  });

// ── 🔍 Process Audit Form ──────────────────────────────────────────────────────
export const submitAuditLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => auditLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };
    if (!withinRateLimit()) return { ok: false, error: "Too many submissions. Please try again in a few minutes." };

    const filesList = data.files
      .map((f) => `${f.name} (${Math.round(f.size / 1024)} KB${f.category ? ` - ${f.category}` : ""})`)
      .join("; ");

    const pageUrl = `https://profit-patterns-xi.vercel.app${clean(data.page) ?? "/audit-submission"}`;

    await runLeadAutomations({
      leadType: "Process Audit",
      name: data.fullName,
      email: data.workEmail.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      jobTitle: clean(data.jobTitle),
      industry: clean(data.industry),
      requirement: clean(data.primaryGoal),
      challenge: clean(data.processSummary),
      primaryGoal: clean(data.primaryGoal),
      processSummary: clean(data.processSummary),
      auditDocType: clean(data.docType),
      weeklyHoursSpent: clean(data.weeklyHoursSpent),
      filesCount: data.files.length,
      filesList,
      ndaRequested: data.ndaRequested,
      pageUrl,
      sheetsPayload: {
        type: "lead",
        event_type: "lead",
        event_name: "lead_submit",
        lead_type: "PROCESS_AUDIT_SUBMISSION",
        name: data.fullName,
        email: data.workEmail.toLowerCase(),
        phone: clean(data.phone) || "",
        company: clean(data.company) || "",
        job_title: clean(data.jobTitle) || "",
        industry: clean(data.industry) || "",
        requirement: clean(data.primaryGoal) || "",
        challenge: clean(data.processSummary) || "",
        audit_doc_type: clean(data.docType) || "",
        weekly_hours_spent: clean(data.weeklyHoursSpent) || "",
        files_count: data.files.length,
        files_list: filesList,
        nda_requested: data.ndaRequested ? "Yes" : "No",
        lead_source: clean(data.source) ?? "audit_submission_form",
        form_name: "Process AI Audit Document Submission",
        lead_status: "New",
        follow_up_status: "Pending",
        consent_status: "Granted",
        conversion_name: "Process Audit Submission",
        conversion_value: 1,
        page_url: pageUrl,
        page_path: clean(data.page) ?? "/audit-submission",
        source_environment: "production",
      },
    });

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { ok: true, id: leadId };
  });
