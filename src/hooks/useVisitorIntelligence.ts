/**
 * useVisitorIntelligence
 * ---------------------
 * Central hook for visitor intelligence features.
 * Tracks visit count, milestone return visits (1st, 2nd, 3rd, 4th, 5+),
 * last visited page, time-of-day greetings, idle state, and scroll progress.
 */

import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

const LS_VISIT_COUNT = "pp_visit_count";
const SS_SESSION_KEY = "pp_session_active";
const LS_LAST_PAGE   = "pp_last_page";
const LS_LAST_LABEL  = "pp_last_label";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export interface VisitorHeadline {
  badge: string;
  headline: string;
  subtext: string;
  ctaText: string;
  ctaLink: string;
}

export interface VisitorIntelligence {
  visitCount: number;          // total number of visits
  isRepeatVisitor: boolean;    // true if visitCount >= 2
  lastPagePath: string | null; // e.g. "/solutions"
  lastPageLabel: string | null;// e.g. "Solutions"
  timeOfDay: TimeOfDay;        // morning/afternoon/evening/night
  greeting: string;            // "Good Morning" etc.
  headlineData: VisitorHeadline; // Milestone-aware copy for banner
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
export function labelForPath(path: string): string {
  const clean = path.split("?")[0].split("#")[0];
  const map: Record<string, string> = {
    "/":                "Home",
    "/about":           "About Us",
    "/icp":             "Ideal Customer Profile (ICP)",
    "/solutions":       "Solutions Architecture",
    "/services":        "Strategic Advisory",
    "/contact":         "Advisory Contact Desk",
    "/audit-submission":"14-Day Free AI Audit",
    "/who-we-serve":    "Who We Serve",
    "/industries":      "Industries",
    "/resources":       "Resources",
    "/insights":        "Insights & Playbooks",
    "/case-studies":    "Case Studies & ROI",
    "/how-it-works":    "4-Phase Methodology",
    "/faq":             "FAQ",
  };
  if (map[clean]) return map[clean];
  const parts = clean.split("/").filter(Boolean);
  if (parts.length >= 2) {
    const parent = map["/" + parts[0]] ?? parts[0];
    const child = parts[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return `${parent} › ${child}`;
  }
  return clean || "Home";
}

/** Dynamic, milestone-aware copy based on 1st, 2nd, 3rd, 4th, 5+ visits */
export function getMilestoneHeadline(visitCount: number, greeting: string): VisitorHeadline {
  if (visitCount <= 1) {
    return {
      badge: "✨ FIRST VISIT",
      headline: `${greeting}! Welcome to ProfitPatterns`,
      subtext: "Discover how custom AI profit architectures eliminate operational leaks.",
      ctaText: "Get Free 14-Day Audit",
      ctaLink: "/audit-submission",
    };
  }

  if (visitCount === 2) {
    return {
      badge: "👋 2ND VISIT",
      headline: `Welcome back! (2nd visit)`,
      subtext: "Exploring our profit systems? Identify your highest-leverage AI automation targets.",
      ctaText: "Explore Solutions",
      ctaLink: "/solutions",
    };
  }

  if (visitCount === 3) {
    return {
      badge: "🔥 3RD VISIT",
      headline: `Welcome back for your 3rd visit!`,
      subtext: "You're exploring deeply! Ready to run your zero-risk 14-day operational diagnostic?",
      ctaText: "Claim 14-Day Diagnostic",
      ctaLink: "/audit-submission",
    };
  }

  if (visitCount === 4) {
    return {
      badge: "⚡ 4TH VISIT",
      headline: `4th Visit • Serious About Margin Expansion?`,
      subtext: "Our senior profit architects can evaluate your operational bottlenecks on a 15-min call.",
      ctaText: "Book 15-Min Call",
      ctaLink: "/contact",
    };
  }

  // 5+ visits
  return {
    badge: `👑 VIP RETURN VISITOR • VISIT #${visitCount}`,
    headline: `Welcome back (Visit #${visitCount})!`,
    subtext: "Priority advisory queue is active. Connect directly with our lead strategist on WhatsApp or calendar.",
    ctaText: "Priority Strategy Call",
    ctaLink: "/contact",
  };
}

export function useVisitorIntelligence(): VisitorIntelligence {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // ── Visit count (session-aware with localStorage persistence) ──
  const [visitCount] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const raw = localStorage.getItem(LS_VISIT_COUNT);
    const existing = raw ? parseInt(raw, 10) : 0;

    // Check if new session or continued session
    const isNewSession = !sessionStorage.getItem(SS_SESSION_KEY);
    if (isNewSession) {
      sessionStorage.setItem(SS_SESSION_KEY, "1");
      const nextCount = existing + 1;
      localStorage.setItem(LS_VISIT_COUNT, String(nextCount));
      return nextCount;
    }
    return Math.max(1, existing);
  });

  // ── Last page (stores previous page before navigation) ─────
  const [lastPagePath] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LS_LAST_PAGE);
  });
  const [lastPageLabel] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(LS_LAST_LABEL);
  });

  useEffect(() => {
    localStorage.setItem(LS_LAST_PAGE, pathname);
    localStorage.setItem(LS_LAST_LABEL, labelForPath(pathname));
  }, [pathname]);

  // ── Time of day ───────────────────────────────────────────────
  const [timeOfDay] = useState<TimeOfDay>(getTimeOfDay);
  const greeting = getGreeting(timeOfDay);
  const headlineData = getMilestoneHeadline(visitCount, greeting);

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
    resetIdle();

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
    headlineData,
    isIdle,
    hasScrolled,
    formTouched,
    setFormTouched,
  };
}
