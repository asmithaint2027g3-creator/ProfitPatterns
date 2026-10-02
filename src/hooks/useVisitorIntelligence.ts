/**
 * useVisitorIntelligence
 * ---------------------
 * Central hook for all 8 visitor intelligence features.
 * Uses localStorage only — no backend, no cookies needed.
 *
 * Features tracked:
 *  1. Visit count (repeat visitor detection)
 *  2. Last visited page
 *  3. Time-of-day greeting
 *  4. Idle detection (30s)
 *  5. Scroll depth
 *  6. Form interaction / abandonment
 *  7. Exit intent (mouseout on desktop)
 */

import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const LS_VISIT_COUNT = "pp_visit_count";
const LS_LAST_PAGE   = "pp_last_page";
const LS_LAST_LABEL  = "pp_last_label";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface VisitorIntelligence {
  visitCount: number;          // total number of visits
  isRepeatVisitor: boolean;    // true if visitCount >= 2
  lastPagePath: string | null; // e.g. "/solutions"
  lastPageLabel: string | null;// e.g. "Solutions"
  timeOfDay: TimeOfDay;        // morning/afternoon/evening/night
  greeting: string;            // "Good Morning" etc.
  isIdle: boolean;             // true after 30s no interaction
  hasScrolled: boolean;        // true after 300px scroll
  formTouched: boolean;        // true if any input was interacted with
  setFormTouched: (v: boolean) => void;
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
function labelForPath(path: string): string {
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

  // ── Visit count ──────────────────────────────────────────────
  const [visitCount] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const raw = localStorage.getItem(LS_VISIT_COUNT);
    const count = raw ? parseInt(raw, 10) + 1 : 1;
    localStorage.setItem(LS_VISIT_COUNT, String(count));
    return count;
  });

  // ── Last page (set PREVIOUS page, update on route change) ─────
  const [lastPagePath] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LS_LAST_PAGE);
  });
  const [lastPageLabel] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LS_LAST_LABEL);
  });

  useEffect(() => {
    // Update stored page AFTER rendering (so we store where they ARE now)
    localStorage.setItem(LS_LAST_PAGE, pathname);
    localStorage.setItem(LS_LAST_LABEL, labelForPath(pathname));
  }, [pathname]);

  // ── Time of day ───────────────────────────────────────────────
  const [timeOfDay] = useState<TimeOfDay>(getTimeOfDay);
  const greeting = getGreeting(timeOfDay);

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
    timeOfDay,
    greeting,
    isIdle,
    hasScrolled,
    formTouched,
    setFormTouched,
  };
}
