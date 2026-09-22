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
const RATE_LIMIT_WINDOW_MINUTES = 15;

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

type AdminClient = typeof import("@/integrations/supabase/client.server")["supabaseAdmin"];

async function getAdmin(): Promise<AdminClient> {
  const mod = await import("@/integrations/supabase/client.server");
  return mod.supabaseAdmin;
}

/** Returns true when the caller is within the allowed rate. */
async function withinRateLimit(admin: AdminClient): Promise<boolean> {
  const key = clientKey();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();

  const { count, error } = await admin
    .from("lead_submission_log")
    .select("id", { count: "exact", head: true })
    .eq("client_key", key)
    .gte("created_at", since);

  if (error) return true; // never block a genuine lead on a logging failure
  if ((count ?? 0) >= RATE_LIMIT_MAX) return false;

  await admin.from("lead_submission_log").insert({ client_key: key });
  return true;
}

function clean(value: string | undefined | null): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue.slice(0, 2000) : null;
}

const GENERIC_ERROR =
  "We couldn't send your message just now. Please try again, or reach us on WhatsApp.";

export const submitQuickLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => quickLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    const admin = await getAdmin();
    if (!(await withinRateLimit(admin))) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    const { data: row, error } = await admin
      .from("leads")
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: clean(data.phone),
        company: clean(data.company),
        requirement: clean(data.requirement),
        message: clean(data.message),
        cta_type: "QUICK_FORM",
        source: clean(data.source) ?? "quick_form",
        page: clean(data.page),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("quick lead insert failed", error?.message);
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true, id: row.id };
  });

export const submitConsultationLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => consultationLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    const admin = await getAdmin();
    if (!(await withinRateLimit(admin))) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    const { data: row, error } = await admin
      .from("leads")
      .insert({
        name: data.fullName,
        email: data.workEmail.toLowerCase(),
        phone: clean(data.phone),
        company: clean(data.company),
        job_title: clean(data.jobTitle),
        industry: clean(data.industry),
        company_size: clean(data.companySize),
        website: clean(data.website),
        challenge: clean(data.primaryChallenge),
        current_challenge: clean(data.currentChallenge),
        desired_outcome: clean(data.desiredOutcome),
        current_tools: clean(data.currentTools),
        existing_ai_usage: clean(data.existingAIUsage),
        project_scope: clean(data.projectScope),
        budget_range: clean(data.budgetRange),
        preferred_contact_time: clean(data.preferredContactTime),
        cta_type: "LONG_FORM",
        source: clean(data.source) ?? "long_form",
        page: clean(data.page),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("consultation lead insert failed", error?.message);
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true, id: row.id };
  });

export const submitChatLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => chatLeadSchema.parse(data))
  .handler(async ({ data }): Promise<LeadSubmitResult> => {
    if (data.companyWebsiteHp) return { ok: false, error: GENERIC_ERROR };

    const admin = await getAdmin();
    if (!(await withinRateLimit(admin))) {
      return { ok: false, error: "Too many submissions. Please try again in a few minutes." };
    }

    const { data: row, error } = await admin
      .from("leads")
      .insert({
        name: data.name,
        email: data.email.toLowerCase(),
        phone: clean(data.phone),
        company: clean(data.company),
        requirement: clean(data.intent),
        current_challenge: clean(data.businessProblem),
        cta_type: "CHATBOT",
        source: "assistant",
        page: clean(data.page),
      })
      .select("id")
      .single();

    if (error || !row) {
      console.error("chat lead insert failed", error?.message);
      return { ok: false, error: GENERIC_ERROR };
    }
    return { ok: true, id: row.id };
  });
