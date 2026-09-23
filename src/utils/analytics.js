// Vercel Serverless Proxy endpoint with fallback to direct Apps Script URL
const PROXY_URL = "/api/analytics/collect";
const FALLBACK_ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL;


// --------------------------------------------------
// 1. GENERATE UNIQUE IDS
// --------------------------------------------------

function generateId() {
     if (typeof crypto !== "undefined" && crypto.randomUUID) {
          return crypto.randomUUID();
     }

     return (
          Date.now().toString(36) +
          Math.random().toString(36).substring(2)
     );
}


// Visitor ID remains the same across browser sessions
function getVisitorId() {
     try {
          let visitorId = localStorage.getItem("pp_visitor_id");

          if (!visitorId) {
               visitorId = generateId();
               localStorage.setItem("pp_visitor_id", visitorId);
          }

          return visitorId;
     } catch (error) {
          return generateId();
     }
}


// Session ID is stored per browser tab
function getSessionId() {
     try {
          let sessionId = sessionStorage.getItem("pp_session_id");

          if (!sessionId) {
               sessionId = generateId();

               sessionStorage.setItem(
                    "pp_session_id",
                    sessionId
               );
          }

          return sessionId;
     } catch (error) {
          return generateId();
     }
}


// --------------------------------------------------
// 2. GET DEVICE INFORMATION
// --------------------------------------------------

function getDeviceType() {
     const ua = navigator.userAgent;

     if (/tablet|ipad/i.test(ua)) {
          return "Tablet";
     }

     if (/mobile|android|iphone|ipod/i.test(ua)) {
          return "Mobile";
     }

     return "Desktop";
}


// Get browser name
function getBrowser() {
     const ua = navigator.userAgent;

     if (ua.includes("Edg/")) return "Edge";
     if (ua.includes("OPR/")) return "Opera";
     if (ua.includes("Firefox/")) return "Firefox";
     if (ua.includes("Chrome/")) return "Chrome";
     if (ua.includes("Safari/")) return "Safari";

     return "Unknown";
}


// --------------------------------------------------
// 3. GET TRAFFIC SOURCE
// --------------------------------------------------

function getTrafficSource() {
     const params = new URLSearchParams(
          window.location.search
     );

     const utmSource = params.get("utm_source");

     if (utmSource) {
          return utmSource;
     }

     if (!document.referrer) {
          return "Direct";
     }

     try {
          return new URL(document.referrer).hostname;
     } catch (error) {
          return "Unknown";
     }
}


// --------------------------------------------------
// 4. SEND EVENT TO GOOGLE APPS SCRIPT
// --------------------------------------------------

export async function trackEvent(
     eventName,
     details = {}
) {
     if (typeof window === "undefined") {
          return;
     }

     const params = new URLSearchParams(
          window.location.search
     );

     const payload = {
          // Event information
          event_name: eventName,

          // Visitor and session information
          session_id: getSessionId(),
          visitor_id: getVisitorId(),

          // Page information
          page_path: window.location.pathname,
          page_title: document.title,

          // Traffic source
          traffic_source: getTrafficSource(),

          // UTM campaign details
          utm_source: params.get("utm_source") || "",
          utm_medium: params.get("utm_medium") || "",
          utm_campaign: params.get("utm_campaign") || "",

          // Device information
          device_type: getDeviceType(),
          browser: getBrowser(),

          // Event-specific information
          cta_name: details.cta_name || "",
          icp_segment: details.icp_segment || "",

          // Engagement information
          scroll_depth: details.scroll_depth || 0,
          time_on_page: details.time_on_page || 0,

          // Additional event details
          event_details: details
     };

     try {
          // 1. Try Vercel Serverless proxy first
          const res = await fetch(PROXY_URL, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json"
               },
               body: JSON.stringify(payload),
               keepalive: true
          });

          // If proxy returned 404 or not found, fall back to direct Apps Script URL
          if (!res.ok && res.status === 404 && FALLBACK_ANALYTICS_URL) {
               await fetch(FALLBACK_ANALYTICS_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                         "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(payload),
                    keepalive: true
               });
          }
     } catch (error) {
          // If proxy failed with network error, try direct fallback
          if (FALLBACK_ANALYTICS_URL) {
               try {
                    await fetch(FALLBACK_ANALYTICS_URL, {
                         method: "POST",
                         mode: "no-cors",
                         headers: {
                              "Content-Type": "text/plain;charset=utf-8"
                         },
                         body: JSON.stringify(payload),
                         keepalive: true
                    });
               } catch (directErr) {
                    console.error("Direct analytics fallback failed:", directErr);
               }
          } else {
               console.error("Analytics tracking failed:", error);
          }
     }
}


// --------------------------------------------------
// 5. TRACK PAGE VIEWS
// --------------------------------------------------

export function trackPageView() {
     trackEvent("page_view");
}


// --------------------------------------------------
// 6. AUTOMATIC CLICK TRACKING
// --------------------------------------------------

export function enableClickTracking() {
     if (window.__ppClickTrackingEnabled) return;

     window.__ppClickTrackingEnabled = true;

     document.addEventListener("click", (event) => {
          const target = event.target;

          // Ensure the target supports closest()
          if (!(target instanceof Element)) return;

          const element = target.closest(
               "a, button, [role='button']"
          );

          if (!element) return;

          const name =
               element.getAttribute("data-analytics") ||
               element.getAttribute("aria-label") ||
               element.textContent?.trim() ||
               element.getAttribute("href") ||
               "Unnamed Element";

          const isLink = element.tagName === "A";

          const eventName = isLink
               ? "navigation_click"
               : "cta_click";

          trackEvent(eventName, {
               cta_name: name,

               element_type: element.tagName.toLowerCase(),

               destination:
                    element.getAttribute("href") || "",

               click_text: name
          });
     });
}


// --------------------------------------------------
// 7. AUTOMATIC SCROLL TRACKING
// --------------------------------------------------

export function enableScrollTracking() {
     if (window.__ppScrollTrackingEnabled) return;

     window.__ppScrollTrackingEnabled = true;

     let maxScrollDepth = 0;
     let lastTrackedDepth = 0;

     window.addEventListener("scroll", () => {
          const scrollableHeight =
               document.documentElement.scrollHeight -
               window.innerHeight;

          if (scrollableHeight <= 0) return;

          const depth = Math.min(
               100,
               Math.round(
                    (window.scrollY / scrollableHeight) * 100
               )
          );

          maxScrollDepth = Math.max(
               maxScrollDepth,
               depth
          );

          // Track only at 25% increments
          const milestone =
               Math.floor(maxScrollDepth / 25) * 25;

          if (
               milestone >= 25 &&
               milestone > lastTrackedDepth
          ) {
               lastTrackedDepth = milestone;

               trackEvent("scroll_depth", {
                    scroll_depth: milestone
               });
          }
     }, { passive: true });
}


// --------------------------------------------------
// 8. AUTOMATIC FORM TRACKING
// --------------------------------------------------

export function enableFormTracking() {
     if (window.__ppFormTrackingEnabled) return;

     window.__ppFormTrackingEnabled = true;

     const startedForms = new WeakSet();

     // Track when a visitor starts interacting with a form
     document.addEventListener("focusin", (event) => {
          const form = event.target.closest("form");

          if (!form || startedForms.has(form)) return;

          startedForms.add(form);

          trackEvent("form_start", {
               cta_name:
                    form.getAttribute("data-analytics") ||
                    form.getAttribute("name") ||
                    form.id ||
                    "Unnamed Form"
          });
     });

     // Track form submission attempts
     document.addEventListener("submit", (event) => {
          const form = event.target;

          trackEvent("form_submit", {
               cta_name:
                    form.getAttribute("data-analytics") ||
                    form.getAttribute("name") ||
                    form.id ||
                    "Unnamed Form"
          });
     });
}


// --------------------------------------------------
// 9. TRACK TIME SPENT ON PAGE
// --------------------------------------------------

export function enablePageTimeTracking() {
     if (window.__ppPageTimeTrackingEnabled) return;

     window.__ppPageTimeTrackingEnabled = true;

     const startTime = Date.now();

     let sent = false;

     function sendPageTime() {
          if (sent) return;

          sent = true;

          const timeSpent = Math.round(
               (Date.now() - startTime) / 1000
          );

          trackEvent("session_end", {
               time_on_page: timeSpent
          });
     }

     window.addEventListener(
          "pagehide",
          sendPageTime
     );
}


// --------------------------------------------------
// 10. INITIALIZE ANALYTICS
// --------------------------------------------------

export function initAnalytics() {
     if (typeof window === "undefined") return;

     if (window.__ppAnalyticsInitialized) return;

     window.__ppAnalyticsInitialized = true;

     // Track when a browsing session starts
     trackEvent("session_start");

     // Track the initial page view
     trackPageView();

     // Enable automatic tracking
     enableClickTracking();
     enableScrollTracking();
     enableFormTracking();
     enablePageTimeTracking();
}