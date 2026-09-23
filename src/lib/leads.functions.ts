import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import {
  chatLeadSchema,
  consultationLeadSchema,
  quickLeadSchema,
  type LeadSubmitResult,
} from "./leads";

/** Max submissions allowed from one client within the window. */
const RATE_LIMIT_MAX = 5;
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

/** In-memory rate limiting */
function withinRateLimit(): boolean {
  const key = clientKey();
  const now = Date.now();
  const timestamps = (submissions.get(key) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    return false;
  }
  timestamps.push(now);
  submissions.set(key, timestamps);
  return true;
}

function clean(value: string | undefined | null): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue.slice(0, 2000) : null;
}

const GENERIC_ERROR =
  "We couldn't send your message just now. Please try again, or reach us on WhatsApp.";

// Google Apps Script endpoint URL
const APPS_SCRIPT_URL =
  process.env.VITE_ANALYTICS_URL ||
  process.env.APPS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzjmmb2ZtocATMl4AeItsDOT7YfEXiL_AUDvA6uIHXSEFWuMNXn_kBFAQnYqTtgH3Wa/exec";

async function forwardLeadToGoogleSheets(leadPayload: Record<string, unknown>): Promise<LeadSubmitResult> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(leadPayload),
    });

    if (!response.ok) {
      console.error("Google Sheets lead submission failed with status:", response.status);
      return { ok: false, error: GENERIC_ERROR };
    }

    const leadId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { ok: true, id: leadId };
  } catch (error) {
    console.error("Failed to forward lead to Google Sheets:", error);
    return { ok: false, error: GENERIC_ERROR };
  }
}

export const submitQuickLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => quickLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    if (!withinRateLimit()) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    return await forwardLeadToGoogleSheets({
      type: "lead",
      lead_type: "QUICK_FORM",
      event_name: "form_submit",
      name: data.name,
      email: data.email.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      requirement: clean(data.requirement),
      message: clean(data.message),
      source: clean(data.source) ?? "quick_form",
      page: clean(data.page) ?? "/contact",
    });
  });

export const submitConsultationLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => consultationLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    if (!withinRateLimit()) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    return await forwardLeadToGoogleSheets({
      type: "lead",
      lead_type: "LONG_FORM",
      event_name: "form_submit",
      name: data.fullName,
      email: data.workEmail.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      job_title: clean(data.jobTitle),
      industry: clean(data.industry),
      company_size: clean(data.companySize),
      website: clean(data.website),
      requirement: clean(data.primaryChallenge),
      challenge: clean(data.currentChallenge),
      desired_outcome: clean(data.desiredOutcome),
      current_tools: clean(data.currentTools),
      existing_ai_usage: clean(data.existingAIUsage),
      project_scope: clean(data.projectScope),
      budget_range: clean(data.budgetRange),
      preferred_contact_time: clean(data.preferredContactTime),
      source: clean(data.source) ?? "long_form",
      page: clean(data.page) ?? "/contact",
    });
  });

export const submitChatLead = createServerFn({ method: "POST" })
  .validator((data: unknown) => chatLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    if (!withinRateLimit()) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    return await forwardLeadToGoogleSheets({
      type: "lead",
      lead_type: "CHATBOT",
      event_name: "form_submit",
      name: data.name,
      email: data.email.toLowerCase(),
      phone: clean(data.phone),
      company: clean(data.company),
      requirement: clean(data.intent),
      challenge: clean(data.businessProblem),
      source: "assistant",
      page: clean(data.page) ?? "/",
    });
  });
