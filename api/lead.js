// api/lead.js
// Dedicated Vercel Serverless Function for Lead Submissions & Jira Automation

import { createJiraLeadTask } from "./_jira.js";
import { saveLeadToAirtable } from "./_airtable.js";

const DEFAULT_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxUuc-vYhkvIByUF1bDTTmkZjacfDGix749tEKGYn5PALUDLWO5TTI-2GjoKc85f6Hg/exec";

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed. Only POST is accepted." });
  }

  try {
    let payload = req.body;
    if (typeof payload === "string") {
      try {
        payload = JSON.parse(payload);
      } catch {
        return res.status(400).json({ ok: false, error: "Invalid JSON body." });
      }
    }

    if (!payload) {
      return res.status(400).json({ ok: false, error: "Missing lead payload." });
    }

    // Extract core fields
    const name = payload.name || payload.fullName || "Inbound Lead";
    const email = (payload.email || payload.workEmail || "").toLowerCase();
    const phone = payload.phone || "";
    const company = payload.company || "";
    const leadType = payload.leadType || (payload.docType ? "Process Audit" : payload.workEmail ? "Consultation" : "Quick Form");

    if (!email && !phone && !name) {
      return res.status(400).json({ ok: false, error: "Please provide at least a name, email, or phone number." });
    }

    // Run Jira Task & Subtask Creation
    let jiraResult = { ok: false };
    try {
      jiraResult = await createJiraLeadTask({
        ...payload,
        name,
        email,
        phone,
        company,
        leadType,
      });
    } catch (jiraErr) {
      console.error("Jira Task Creation Error:", jiraErr);
    }

    // Forward to Google Sheets
    const appsScriptUrl =
      process.env.VITE_ANALYTICS_URL ||
      process.env.APPS_SCRIPT_URL ||
      DEFAULT_APPS_SCRIPT_URL;

    try {
      const sheetsPayload = {
        type: "lead",
        event_type: "lead",
        event_name: "lead_submit",
        lead_type: leadType.toUpperCase().replace(/\s+/g, "_"),
        name,
        email,
        phone,
        company,
        requirement: payload.requirement || payload.primaryChallenge || payload.primaryGoal || "",
        challenge: payload.challenge || payload.currentChallenge || payload.message || payload.processSummary || "",
        lead_source: payload.source || payload.lead_source || "website_inbound",
        form_name: payload.form_name || `${leadType} Form`,
        lead_status: "New",
        follow_up_status: "Pending",
        consent_status: "Granted",
        conversion_name: `${leadType} Submission`,
        conversion_value: 1,
        page_url: payload.pageUrl || payload.page_url || "https://profit-patterns-jade.vercel.app/contact",
        jira_key: jiraResult.parentIssueKey || "",
        jira_url: jiraResult.parentIssueUrl || "",
        source_environment: process.env.NODE_ENV === "development" ? "development" : "production",
      };

      await fetch(appsScriptUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(sheetsPayload),
      });
    } catch (sheetsErr) {
      console.warn("Sheets logging notice:", sheetsErr);
    }

    // Forward to Airtable (if configured)
    try {
      await saveLeadToAirtable({
        name,
        email,
        phone,
        company,
        jobTitle: payload.jobTitle || payload.job_title || "",
        industry: payload.industry || "",
        leadType,
        requirement: payload.requirement || payload.primaryChallenge || payload.primaryGoal || "",
        challenge: payload.challenge || payload.currentChallenge || payload.message || payload.processSummary || "",
        pageUrl: payload.pageUrl || payload.page_url || "",
      });
    } catch (atErr) {
      console.warn("Airtable logging notice:", atErr);
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    return res.status(200).json({
      ok: true,
      id: leadId,
      jira: jiraResult,
      message: "Lead processed and logged successfully.",
    });
  } catch (error) {
    console.error("api/lead error:", error);
    return res.status(500).json({ ok: false, error: error.message });
  }
}
