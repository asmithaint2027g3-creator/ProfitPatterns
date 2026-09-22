/**
 * Provider-agnostic analytics layer.
 *
 * Nothing here is coupled to a single vendor: adapters receive a normalized
 * event and forward it. Register adapters at startup; unregistered providers
 * simply no-op, so the app never depends on a script that may be blocked.
 */

export type AnalyticsEventName =
  | "page_view"
  | "service_view"
  | "case_study_view"
  | "cta_click"
  | "whatsapp_click"
  | "quick_form_open"
  | "quick_form_submit"
  | "quick_form_success"
  | "long_form_open"
  | "long_form_submit"
  | "long_form_success"
  | "chat_open"
  | "chat_message"
  | "chat_lead_started"
  | "chat_lead_completed";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export interface AnalyticsAdapter {
  name: string;
  track: (event: AnalyticsEventName, payload: AnalyticsPayload) => void;
}

const adapters: AnalyticsAdapter[] = [];

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

/* ---------------- Adapters (activated only when the provider is present) --------------- */

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

export function initAnalytics() {
  registerAdapter(googleTagManagerAdapter);
  registerAdapter(googleAnalyticsAdapter);
  registerAdapter(metaPixelAdapter);
}
