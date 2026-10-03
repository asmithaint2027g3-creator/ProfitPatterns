/**
 * useVisitorIntelligence
 * ---------------------
 * Central hook for all visitor intelligence features.
 * Uses localStorage / sessionStorage only — no backend, no cookies needed.
 *
 * Features tracked:
 *  1. Visit count (repeat visitor detection)
 *  2. Last visited page
 *  3. Time-of-day greeting
 *  4. Idle detection (30s)
 *  5. Scroll depth
 *  6. Form interaction / abandonment
 *  7. Exit intent (mouseout on desktop)
 *  8. Visit count badge (number shown on launcher)
 *  9. Current page context (for chatbot intelligence)
 */

import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const LS_VISIT_COUNT   = "pp_visit_count";
const LS_LAST_PAGE     = "pp_last_page";    // previous session's last page
const LS_LAST_LABEL    = "pp_last_label";   // previous session's last label
const LS_VISIT_DATES   = "pp_visit_dates";  // JSON array of ISO date strings
const SS_SESSION_GUARD = "pp_session_started"; // sessionStorage: marks this session has initialised

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface VisitorIntelligence {
  visitCount: number;          // total number of visits
  isRepeatVisitor: boolean;    // true if visitCount >= 2
  lastPagePath: string | null; // e.g. "/solutions"
  lastPageLabel: string | null;// e.g. "Solutions"
  currentPageLabel: string;    // human label for the CURRENT page
  timeOfDay: TimeOfDay;        // morning/afternoon/evening/night
  greeting: string;            // "Good Morning" etc.
  isIdle: boolean;             // true after 30s no interaction
  hasScrolled: boolean;        // true after 300px scroll
  formTouched: boolean;        // true if any input was interacted with
  setFormTouched: (v: boolean) => void;
  visitDates: string[];        // ISO date strings of all visit timestamps
}

function getTimeOfDay(): TimeOfDay {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

function getGreeting(tod: TimeOfDay): string {
  switch (tod) {
    case "morning":   return "Good Morning";
    case "afternoon": return "Good Afternoon";
    case "evening":   return "Good Evening";
    case "night":     return "Working Late?";
  }
}

/** Human-readable label for common routes */
export function labelForPath(path: string): string {
  const map: Record<string, string> = {
    "/":                "Home",
    "/about":           "About Us",
    "/solutions":       "Solutions",
    "/contact":         "Contact",
    "/audit-submission":"AI Process Audit",
    "/who-we-serve":    "Who We Serve",
    "/industries":      "Industries",
    "/resources":       "Resources",
    "/insights":        "Insights",
    "/case-studies":    "Case Studies",
    "/how-it-works":    "How It Works",
    "/faq":             "FAQ",
    "/services":        "Services",
    "/icp":             "Ideal Client Profile (ICP)",
    "/privacy":         "Privacy Policy",
    "/terms":           "Terms of Service",
  };
  if (map[path]) return map[path];
  // slug pages: "/solutions/ai-strategy" → "Solutions › AI Strategy"
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return `${map["/" + parts[0]] ?? parts[0]} › ${parts[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}`;
  }
  return path;
}

export function useVisitorIntelligence(): VisitorIntelligence {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // ── Stable initial state for SSR & Hydration (prevents React Error #418) ──
  const [visitCount, setVisitCount] = useState<number>(1);
  const [visitDates, setVisitDates] = useState<string[]>([]);
  const [lastPagePath, setLastPagePath] = useState<string | null>(null);
  const [lastPageLabel, setLastPageLabel] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [isClientReady, setIsClientReady] = useState<boolean>(false);

  // ── Synchronize client storage after hydration completes ──────
  useEffect(() => {
    try {
      const rawCount = localStorage.getItem(LS_VISIT_COUNT);
      const count = rawCount ? parseInt(rawCount, 10) + 1 : 1;
      localStorage.setItem(LS_VISIT_COUNT, String(count));
      setVisitCount(count);

      const rawDates = localStorage.getItem(LS_VISIT_DATES);
      const dates: string[] = rawDates ? JSON.parse(rawDates) : [];
      const now = new Date().toISOString();
      dates.push(now);
      const trimmed = dates.slice(-50);
      localStorage.setItem(LS_VISIT_DATES, JSON.stringify(trimmed));
      setVisitDates(trimmed);

      const isNewSession = !sessionStorage.getItem(SS_SESSION_GUARD);
      if (isNewSession) {
        try {
          sessionStorage.setItem(SS_SESSION_GUARD, "1");
        } catch {}
      }
      setLastPagePath(localStorage.getItem(LS_LAST_PAGE));
      setLastPageLabel(localStorage.getItem(LS_LAST_LABEL));

      setTimeOfDay(getTimeOfDay());
      setIsClientReady(true);
    } catch {
      setIsClientReady(true);
    }
  }, []);

  // Update stored page whenever the user navigates within the session
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_LAST_PAGE, pathname);
      localStorage.setItem(LS_LAST_LABEL, labelForPath(pathname));
    } catch {}
  }, [pathname]);

  // ── Current page label (consumed by chatbot for context) ───────
  const currentPageLabel = labelForPath(pathname);

  const greeting = getGreeting(timeOfDay);
  const isRepeatVisitor = isClientReady && visitCount >= 2;

  // ── Idle detection (30 seconds) ───────────────────────────────
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetIdle = () => {
      setIsIdle(false);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => setIsIdle(true), 30_000);
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle(); // start timer immediately

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetIdle));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // ── Scroll depth ──────────────────────────────────────────────
  const [hasScrolled, setHasScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 300) setHasScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Form abandonment ──────────────────────────────────────────
  const [formTouched, setFormTouched] = useState(false);

  return {
    visitCount,
    isRepeatVisitor: visitCount >= 2,
    lastPagePath,
    lastPageLabel,
    currentPageLabel,
    timeOfDay,
    greeting,
    isIdle,
    hasScrolled,
    formTouched,
    setFormTouched,
    visitDates,
  };
}
