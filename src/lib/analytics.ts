/**
 * Provider-agnostic analytics layer.
 *
 * Nothing here is coupled to a single vendor: adapters receive a normalized
 * event and forward it. Register adapters at startup; unregistered providers
 * simply no-op, so the app never depends on a script that may be blocked.
 */

import { trackEvent } from "../utils/analytics";

export type AnalyticsEventName =
  | "page_view"
  | "service_view"
  | "case_study_view"
  | "cta_click"
  | "whatsapp_click"
  | "navigation_click"
  | "quick_form_open"
  | "quick_form_submit"
  | "quick_form_success"
  | "long_form_open"
  | "long_form_submit"
  | "long_form_success"
  | "chat_open"
  | "chat_message"
  | "chat_lead_started"
  | "chat_lead_completed"
  | "session_start"
  | "session_end"
  | "scroll_depth"
  | "form_start"
  | "form_submit"
  | "nav_click"
  | "mega_menu_cta_click"
  | "diagnostic_answer"
  | "diagnostic_completed"
  | "icp_pillar_click"
  | "pain_signal_toggle"
  | string;

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export interface AnalyticsAdapter {
  name: string;
  track: (event: AnalyticsEventName, payload: AnalyticsPayload) => void;
}

export const sheetsAdapter: AnalyticsAdapter = {
  name: "google-sheets",
  track: (event, payload) => {
    // Forward all application tracking events to Google Sheets
    trackEvent(event, payload as Record<string, unknown>);
  },
};

type AnyWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

export const googleTagManagerAdapter: AnalyticsAdapter = {
  name: "gtm",
  track: (event, payload) => {
    const w = window as AnyWindow;
    if (!w.dataLayer) return;
    w.dataLayer.push({ event, ...payload });
  },
};

export const googleAnalyticsAdapter: AnalyticsAdapter = {
  name: "ga4",
  track: (event, payload) => {
    const w = window as AnyWindow;
    if (typeof w.gtag !== "function") return;
    w.gtag("event", event, payload);
  },
};

export const metaPixelAdapter: AnalyticsAdapter = {
  name: "meta-pixel",
  track: (event, payload) => {
    const w = window as AnyWindow;
    if (typeof w.fbq !== "function") return;
    w.fbq("trackCustom", event, payload);
  },
};

import { isClarityProduction } from "./clarity";

// High-Signal Clarity Smart Events mapping
const CLARITY_SMART_EVENTS: Record<string, string> = {
  // 1. Audit Journey
  start_audit: "START_AUDIT",
  audit_form_open: "AUDIT_FORM_OPEN",
  audit_form_submit: "AUDIT_SUBMITTED",
  audit_form_success: "AUDIT_SUCCESS",

  // 2. Lead Forms
  form_start: "FORM_STARTED",
  quick_form_open: "FORM_STARTED",
  long_form_open: "FORM_STARTED",
  quick_form_submit: "FORM_SUBMITTED",
  long_form_submit: "FORM_SUBMITTED",
  form_submit: "FORM_SUBMITTED",
  quick_form_success: "FORM_SUCCESS",
  long_form_success: "FORM_SUCCESS",
  form_success: "FORM_SUCCESS",

  // 3. High-Intent Actions
  contact_us: "CONTACT_US",
  book_consultation: "BOOK_CONSULTATION",
  whatsapp_click: "WHATSAPP_CLICK",

  // 4. Chatbot Engagement
  chat_open: "CHATBOT_OPEN",
  chat_message: "CHATBOT_MESSAGE",
  chat_lead_started: "CHATBOT_LEAD_START",
  chat_lead_completed: "CHATBOT_LEAD_SUBMIT",
};

export const microsoftClarityAdapter: AnalyticsAdapter = {
  name: "clarity",
  track: (event, payload) => {
    if (!isClarityProduction()) return;
    const w = window as AnyWindow & {
      clarity?: (action: string, ...args: unknown[]) => void;
    };
    if (typeof w.clarity !== "function") return;
    try {
      // Map to normalized Clarity Smart Event or uppercase event
      const smartName = CLARITY_SMART_EVENTS[event] || event.toUpperCase();
      w.clarity("event", smartName);

      // Set safe metadata tags ONLY (Never send PII like name, email, phone)
      if (payload?.page && typeof payload.page === "string") {
        w.clarity("set", "page", payload.page);
      }
      if (payload?.source && typeof payload.source === "string") {
        w.clarity("set", "source", payload.source);
      }
      if (payload?.form_name && typeof payload.form_name === "string") {
        w.clarity("set", "form_name", payload.form_name);
      }
      if (payload?.cta && typeof payload.cta === "string") {
        w.clarity("set", "cta", payload.cta);
      }
    } catch {
      /* Clarity event must never break the UI */
    }
  },
};

const adapters: AnalyticsAdapter[] = [
  sheetsAdapter,
  microsoftClarityAdapter,
  googleTagManagerAdapter,
  googleAnalyticsAdapter,
  metaPixelAdapter,
];

export function registerAdapter(adapter: AnalyticsAdapter) {
  if (!adapters.some((a) => a.name === adapter.name)) adapters.push(adapter);
}

export function track(event: AnalyticsEventName, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") return;
  const enriched: AnalyticsPayload = {
    ...payload,
    page: payload["page"] ?? window.location.pathname,
  };
  for (const adapter of adapters) {
    try {
      adapter.track(event, enriched);
    } catch {
      /* analytics must never break the UI */
    }
  }
}

export function initAnalytics() {
  registerAdapter(googleTagManagerAdapter);
  registerAdapter(googleAnalyticsAdapter);
  registerAdapter(metaPixelAdapter);
  registerAdapter(microsoftClarityAdapter);
}
