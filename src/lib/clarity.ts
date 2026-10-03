/**
 * src/lib/clarity.ts
 *
 * Safe Microsoft Clarity integration for ProfitPatterns.
 *
 * Rules:
 * 1. Production ONLY: Only activates on https://profit-patterns-xi.vercel.app/
 * 2. Disabled on localhost, 127.0.0.1, and Vercel preview deployments.
 * 3. Client-side dynamic injection: Prevents SSR hydration mismatch and head mutations.
 * 4. Privacy: Zero PII (no names, emails, phones, or sensitive form values).
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: unknown[]) => void;
    __ppClarityLoaded?: boolean;
  }
}

const PRODUCTION_HOSTNAME = "profit-patterns-xi.vercel.app";

/**
 * Checks if the current environment is strictly the designated production website.
 */
export function isClarityProduction(): boolean {
  if (typeof window === "undefined") return false;
  const hostname = window.location.hostname;
  return hostname === PRODUCTION_HOSTNAME;
}

/**
 * Gets the configured Clarity Project ID from environment variables without hardcoded secrets.
 */
export function getClarityProjectId(): string | undefined {
  const id =
    import.meta.env.VITE_CLARITY_PROJECT_ID ||
    import.meta.env.VITE_CLARITY_ID;

  if (typeof id === "string" && id.trim().length > 0) {
    return id.trim();
  }
  return undefined;
}

/**
 * Dynamically initializes Microsoft Clarity on the client in production only.
 */
export function initClarity(): void {
  if (typeof window === "undefined") return;
  if (window.__ppClarityLoaded) return;

  if (!isClarityProduction()) {
    if (import.meta.env.DEV) {
      console.info("[Clarity] Disabled in development / non-production environment (%s)", window.location.hostname);
    }
    return;
  }

  const projectId = getClarityProjectId();
  if (!projectId) {
    console.warn("[Clarity] No VITE_CLARITY_PROJECT_ID configured. Tracking skipped.");
    return;
  }

  try {
    // Standard non-blocking Clarity snippet injected at runtime
    (function (c: Window, l: Document, a: string, r: string, i: string) {
      c[a] =
        c[a] ||
        function () {
          // eslint-disable-next-line prefer-rest-params
          (c[a]!.q = c[a]!.q || []).push(arguments);
        };
      const t = l.createElement(r) as HTMLScriptElement;
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      const y = l.getElementsByTagName(r)[0];
      if (y && y.parentNode) {
        y.parentNode.insertBefore(t, y);
      } else {
        l.head.appendChild(t);
      }
    })(window, document, "clarity", "script", projectId);

    window.__ppClarityLoaded = true;
  } catch (err) {
    console.warn("[Clarity] Initialization failed safely:", err);
  }
}

/**
 * Safe helper to trigger a custom Clarity Smart Event.
 * Does not throw and does nothing if Clarity is not running.
 */
export function sendClarityEvent(eventName: string): void {
  if (typeof window === "undefined" || !isClarityProduction()) return;
  if (typeof window.clarity === "function") {
    try {
      window.clarity("event", eventName);
    } catch {
      // Fail silently without affecting application
    }
  }
}

/**
 * Safe helper to set custom non-PII tags in Clarity.
 */
export function setClarityTag(key: string, value: string): void {
  if (typeof window === "undefined" || !isClarityProduction()) return;
  if (typeof window.clarity === "function") {
    try {
      window.clarity("set", key, value);
    } catch {
      // Fail silently
    }
  }
}
