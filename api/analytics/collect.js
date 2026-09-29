// api/analytics/collect.js
// Vercel Serverless Function Proxy for Google Sheets Analytics & Jira Automation

import { createJiraLeadTask } from "../_jira.js";
import { routeEventToAirtable } from "../_airtable.js";

const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyOIQwm57GAUL1Jo_d_yP3ELGHTYXulzkqWV9KHOx7DXLloBLs430EL3dbmhZP89FQ/exec";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed. Only POST is accepted." });
  }

  try {
    const appsScriptUrl =
      process.env.VITE_ANALYTICS_URL ||
      process.env.APPS_SCRIPT_URL ||
      DEFAULT_APPS_SCRIPT_URL;

    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON body." });
      }
    }

    if (!payload || (!payload.event_name && !payload.event_type)) {
      return res.status(400).json({ ok: false, error: "Missing event_name or event_type in payload." });
    }

    // Enrich payload with headers if missing
    if (!payload.browser && req.headers["user-agent"]) {
      payload.user_agent = req.headers["user-agent"];
    }
    if ((!payload.referrer_url || payload.referrer_url === "(direct_entry)") && req.headers["referer"]) {
      payload.referrer_url = req.headers["referer"];
    }
    if (!payload.source_environment) {
      payload.source_environment = process.env.NODE_ENV === "development" ? "development" : "production";
    }

    // Debounce Jira task creation so duplicates within 60 seconds are ignored
    const cleanEmail = (payload.email || payload.workEmail || "").trim().toLowerCase();
    const isExplicitLead =
      payload.event_name === "lead_submit" ||
      (payload.event_type === "lead" && payload.event_name !== "form_submit" && payload.event_name !== "form_start");

    const hasContactDetails = Boolean(cleanEmail || payload.phone || payload.name);

    if (isExplicitLead && hasContactDetails) {
      const now = Date.now();
      const lastJiraTime = global.__recentJiraTasks?.get(cleanEmail);
      if (!global.__recentJiraTasks) global.__recentJiraTasks = new Map();

      if (!lastJiraTime || now - lastJiraTime > 60_000) {
        if (cleanEmail) global.__recentJiraTasks.set(cleanEmail, now);
        try {
          await createJiraLeadTask({
            name: payload.name || payload.fullName,
            email: cleanEmail,
            phone: payload.phone,
            company: payload.company,
            jobTitle: payload.jobTitle || payload.job_title,
            industry: payload.industry,
            companySize: payload.companySize || payload.company_size,
            requirement: payload.requirement || payload.primaryChallenge || payload.primaryGoal,
            challenge: payload.challenge || payload.currentChallenge || payload.message || payload.processSummary,
            desiredOutcome: payload.desiredOutcome || payload.desired_outcome,
            docType: payload.docType || payload.audit_doc_type,
            filesCount: payload.filesCount || payload.files_count,
            fileName: payload.fileName,
            referenceId: payload.referenceId,
            pageUrl: payload.page_url || payload.pageUrl,
            leadType:
              payload.lead_type === "PROCESS_AUDIT_SUBMISSION" || payload.docType
                ? "Process Audit"
                : payload.lead_type === "LONG_FORM" || payload.jobTitle
                ? "Consultation"
                : payload.lead_type === "CHATBOT"
                ? "Chatbot"
                : "Quick Form",
          });
        } catch (jiraErr) {
          console.warn("Jira creation in analytics proxy notice:", jiraErr);
        }
      } else {
        console.log(`[Jira] Debouncing duplicate Jira task creation for: ${cleanEmail}`);
      }
    }

    // Route ALL events to the correct Airtable table via smart router
    routeEventToAirtable(payload).catch((atErr) => {
      console.warn("Airtable routing notice:", atErr);
    });

    // Forward the event from Vercel to Google Apps Script
    const response = await fetch(appsScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    return res.status(200).json({
      ok: true,
      message: "Event recorded successfully",
      upstream: responseText,
    });
  } catch (error) {
    console.error("Proxy error forwarding to Apps Script:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
