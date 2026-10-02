/**
 * VisitorIntelligenceLayer
 * ─────────────────────────────────────────────────────────────────
 * Renders ALL 8 visitor intelligence UI features:
 *
 *  1. Repeat Visitor Welcome Banner   (top of page, dismissable)
 *  2. Chatbot repeat visitor flag     (exposed via context for Assistant)
 *  3. Last Visited Page Alert         (inside welcome banner)
 *  4. Exit Intent Popup               (mouseout → top of viewport)
 *  5. Time-Based Greeting             (inside welcome banner)
 *  6. Proactive Chatbot Trigger       (30s idle → chatbot nudge bubble)
 *  7. Form Abandonment Popup          (scroll away after touching a form)
 *  8. Sticky CTA Button               (appears after 300px scroll)
 */

import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  MessageSquareText,
  Moon,
  Sparkles,
  Sun,
  Sunset,
  X,
} from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import { useVisitorIntelligence } from "@/hooks/useVisitorIntelligence";
import { cn } from "@/lib/utils";
import { getPageChatContext } from "@/components/chat/chatContexts";

// ── Shared context so the chatbot can read repeat-visitor state ──
interface VisitorCtx {
  isRepeatVisitor: boolean;
  visitCount: number;
  greeting: string;
  openChatbot: () => void;
  registerChatbotOpener: (fn: () => void) => void;
  setFormTouched: (v: boolean) => void;
}

const VisitorContext = createContext<VisitorCtx>({
  isRepeatVisitor: false,
  visitCount: 1,
  greeting: "Good Morning",
  openChatbot: () => {},
  registerChatbotOpener: () => {},
  setFormTouched: () => {},
});

export function useVisitorContext() {
  return useContext(VisitorContext);
}

// ─────────────────────────────────────────────────────────────────
// TIME ICON
// ─────────────────────────────────────────────────────────────────
function TimeIcon({ tod }: { tod: string }) {
  if (tod === "morning")   return <Sun   className="size-4 text-amber-500" />;
  if (tod === "afternoon") return <Sun   className="size-4 text-orange-400" />;
  if (tod === "evening")   return <Sunset className="size-4 text-rose-400" />;
  return <Moon className="size-4 text-indigo-400" />;
}

// ─────────────────────────────────────────────────────────────────
// 1 + 3 + 5 — REPEAT VISITOR WELCOME BANNER (Engaging Milestone-Aware)
// ─────────────────────────────────────────────────────────────────
function WelcomeBanner({
  visitCount,
  isRepeatVisitor,
  greeting,
  headlineData,
  lastPageLabel,
  lastPagePath,
  timeOfDay,
  onOpenChatbot,
  onDismiss,
}: {
  visitCount: number;
  isRepeatVisitor: boolean;
  greeting: string;
  headlineData: {
    badge: string;
    headline: string;
    subtext: string;
    ctaText: string;
    ctaLink: string;
  };
  lastPageLabel: string | null;
  lastPagePath: string | null;
  timeOfDay: string;
  onOpenChatbot?: () => void;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Instant smooth reveal
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-out",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
      )}
      role="banner"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-[#141414] via-[#222222] to-[#141414] border-b border-[#C4B296]/30 px-3.5 py-2.5 text-white shadow-xl shadow-black/30">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Left side: Time + Milestone Badge + Engaging Headline */}
          <div className="flex items-center gap-2.5 min-w-0 flex-wrap sm:flex-nowrap">
            {/* Time icon & Greeting */}
            <div className="flex items-center gap-1.5 shrink-0">
              <TimeIcon tod={timeOfDay} />
              <span className="text-xs font-semibold text-white/90">{greeting}!</span>
            </div>

            {/* Dynamic Milestone Badge (1st, 2nd, 3rd, 4th, 5+ visit) */}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#C4B296]/20 border border-[#C4B296]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#F0E6D2] tracking-wider uppercase shrink-0 shadow-xs">
              <Sparkles className="size-2.5 text-[#C4B296]" />
              {headlineData.badge}
            </span>

            {/* Dynamic Headline Message */}
            <span className="text-xs font-medium text-[#FAFAF8] truncate">
              {headlineData.headline}
            </span>

            {/* Subtext on larger screens */}
            <span className="hidden lg:inline text-xs text-[#A8A29E] truncate">
              — {headlineData.subtext}
            </span>

            {/* Last visited page alert if repeat visitor */}
            {isRepeatVisitor && lastPageLabel && lastPagePath && (
              <div className="hidden md:flex items-center gap-1 text-[11px] text-[#C4B296] bg-black/40 px-2 py-0.5 rounded border border-white/10 shrink-0">
                <BookOpen className="size-3 text-[#C4B296]" />
                <span className="text-[#A8A29E]">Last saw:</span>
                <Link
                  to={lastPagePath as "/"}
                  className="font-semibold text-[#E8D9C0] hover:text-white underline underline-offset-2 transition-colors"
                >
                  {lastPageLabel}
                </Link>
              </div>
            )}
          </div>

          {/* Right side: Interactive CTAs + Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Chatbot Quick Trigger */}
            <button
              onClick={onOpenChatbot}
              className="inline-flex items-center gap-1 rounded border border-[#C4B296]/40 bg-[#C4B296]/15 px-2.5 py-1 text-xs font-semibold text-[#E8D9C0] hover:bg-[#C4B296] hover:text-[#1A1A1A] transition-all cursor-pointer shadow-xs"
            >
              <MessageSquareText className="size-3" />
              <span>Ask AI</span>
            </button>

            {/* Milestone-Specific Primary Action */}
            <Link
              to={headlineData.ctaLink as "/"}
              className="hidden sm:inline-flex items-center gap-1.5 rounded bg-[#FAFAF8] px-3 py-1 text-xs font-bold text-[#1A1A1A] hover:bg-[#E5E0D8] transition-all shadow-xs"
            >
              <span>{headlineData.ctaText}</span>
              <ArrowRight className="size-3 text-[#1A1A1A]" />
            </Link>

            {/* Dismiss Button */}
            <button
              onClick={onDismiss}
              aria-label="Dismiss welcome banner"
              className="rounded p-1 text-[#A8A29E] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Mobile secondary row for last visited page */}
        {isRepeatVisitor && lastPageLabel && lastPagePath && (
          <div className="md:hidden mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] text-[#C4B296]">
            <div className="flex items-center gap-1.5 truncate">
              <BookOpen className="size-3 shrink-0" />
              <span>Continue from:</span>
              <Link
                to={lastPagePath as "/"}
                className="font-semibold text-[#E8D9C0] underline underline-offset-2"
              >
                {lastPageLabel}
              </Link>
            </div>
            <Link
              to={headlineData.ctaLink as "/"}
              className="font-bold text-white shrink-0 ml-2 text-[10px] bg-white/10 px-2 py-0.5 rounded"
            >
              {headlineData.ctaText} →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 4 — EXIT INTENT POPUP
// ─────────────────────────────────────────────────────────────────
function ExitIntentPopup({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dismiss */}
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-5">
          <Sparkles className="size-6 text-primary" />
        </div>

        {/* Content */}
        <h2 className="font-display text-2xl font-bold text-foreground leading-tight">
          Wait — before you go!
        </h2>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Discover exactly where AI can save your business money.
          Our <strong className="text-foreground">free 14-day AI Diagnostic</strong> delivers
          a measurable ROI scorecard — at zero cost to you.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            to="/audit-submission"
            onClick={onDismiss}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2D2D2D] transition-colors"
          >
            <Sparkles className="size-4" />
            Get My Free Audit
            <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/contact"
            onClick={onDismiss}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-5 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Calendar className="size-4" />
            Schedule a Call Instead
          </Link>
          <button
            onClick={onDismiss}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-1"
          >
            No thanks, I'll figure it out myself
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 6 — PROACTIVE CHATBOT TRIGGER BUBBLE (30s idle)
// ─────────────────────────────────────────────────────────────────
function IdleChatbotNudge({
  title,
  text,
  badge,
  onOpen,
  onDismiss,
}: {
  title: string;
  text: string;
  badge?: string;
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-36 right-4 z-50 max-w-[240px] animate-rise md:bottom-24 md:right-20">
      <div className="relative rounded-2xl rounded-br-none border border-[#E5E0D8] bg-white p-4 shadow-xl">
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border border-[#E5E0D8] bg-white text-muted-foreground hover:text-foreground cursor-pointer shadow-xs"
        >
          <X className="size-3" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B7355] truncate">
            {badge || title}
          </span>
        </div>

        <p className="text-xs text-[#1A1A1A] font-medium leading-snug">
          {text}
        </p>

        <button
          onClick={onOpen}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#1A1A1A] px-3 py-2 text-xs font-semibold text-white hover:bg-[#2D2D2D] transition-colors cursor-pointer"
        >
          <MessageSquareText className="size-3.5 text-[#C4B296]" />
          Chat with ProfitAI
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 7 — FORM ABANDONMENT POPUP
// ─────────────────────────────────────────────────────────────────
function FormAbandonmentPopup({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onDismiss}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onDismiss}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-secondary cursor-pointer"
        >
          <X className="size-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 border border-amber-200 mb-4">
          <AlertCircle className="size-5 text-amber-500" />
        </div>

        <h3 className="font-display text-xl font-bold text-foreground">
          Don't lose your progress!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          You were filling out a form. Would you like to continue, or
          speak to us directly on WhatsApp instead?
        </p>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={onDismiss}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Continue Filling Form
          </button>
          <Link
            to="/contact"
            onClick={onDismiss}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <Clock className="size-4" />
            Contact Us Another Way
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// 8 — STICKY CTA BUTTON (appears after 300px scroll)
// ─────────────────────────────────────────────────────────────────
function StickyCTA({ visible }: { visible: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Hide on contact / audit pages (they already have forms)
  const hideOn = ["/contact", "/audit-submission"];
  if (hideOn.includes(pathname)) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 md:bottom-6",
        visible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0 pointer-events-none",
      )}
    >
      <Link
        to="/audit-submission"
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-[#1A1A1A] px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-black/20 hover:bg-[#2D2D2D] transition-all hover:scale-105 hover:-translate-y-0.5"
      >
        <Sparkles className="size-4 text-[#C4B296]" />
        Get Your Free AI Audit
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MASTER LAYER COMPONENT (renders everything, manages state)
// ─────────────────────────────────────────────────────────────────
export function VisitorIntelligenceLayer({
  onOpenChatbot,
  onRegisterChatbotOpener,
}: {
  onOpenChatbot?: () => void;
  onRegisterChatbotOpener?: (fn: () => void) => void;
}) {
  const {
    visitCount,
    isRepeatVisitor,
    lastPagePath,
    lastPageLabel,
    timeOfDay,
    greeting,
    headlineData,
    isIdle,
    hasScrolled,
    formTouched,
    setFormTouched,
  } = useVisitorIntelligence();

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageCtx = getPageChatContext(pathname);

  // Banner state
  const [bannerDismissed, setBannerDismissed]       = useState(false);
  const [showExitPopup, setShowExitPopup]           = useState(false);
  const [showIdleNudge, setShowIdleNudge]           = useState(false);
  const [showAbandon, setShowAbandon]               = useState(false);
  const [idleNudgeDismissed, setIdleNudgeDismissed] = useState(false);
  const [abandonDismissed, setAbandonDismissed]     = useState(false);

  const chatbotOpenerRef = useRef<(() => void) | null>(null);

  const openChatbot = useCallback(() => {
    onOpenChatbot?.();
    chatbotOpenerRef.current?.();
  }, [onOpenChatbot]);

  // ── 4. Exit intent (triggers on mouse leaving top towards tab bar / close button) ─
  useEffect(() => {
    if (typeof window === "undefined") return;

    const triggerExit = () => {
      // In production, only show once per session; in dev, allow repeated testing unless currently open
      if (!import.meta.env.DEV && sessionStorage.getItem("pp_exit_shown")) return;
      sessionStorage.setItem("pp_exit_shown", "1");
      setShowExitPopup(true);
    };

    // 1. Mouse leaves through the top of the viewport (classic exit intent)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 25 || !e.relatedTarget) {
        triggerExit();
      }
    };

    // 2. Mouse moves very close to top bar (< 15px)
    const onMouseMove = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        triggerExit();
      }
    };

    // Dev / testing helpers exposed on window
    (window as any).__showExitPopup = () => setShowExitPopup(true);
    (window as any).__resetExitPopup = () => {
      sessionStorage.removeItem("pp_exit_shown");
      setShowExitPopup(false);
    };

    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseout", onMouseLeave);
    document.addEventListener("mousemove", onMouseMove);

    return () => {
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseout", onMouseLeave);
      document.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // ── 6. Idle nudge ───────────────────────────────────────────────
  useEffect(() => {
    if (isIdle && !idleNudgeDismissed) {
      setShowIdleNudge(true);
    } else {
      setShowIdleNudge(false);
    }
  }, [isIdle, idleNudgeDismissed]);

  // ── 7. Form abandonment: trigger when user scrolls UP after form touch ──
  const lastScrollY = useRef(0);
  useEffect(() => {
    if (!formTouched || abandonDismissed) return;
    const onScroll = () => {
      const current = window.scrollY;
      const scrollingUp = current < lastScrollY.current - 80;
      if (scrollingUp && formTouched) {
        setShowAbandon(true);
      }
      lastScrollY.current = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [formTouched, abandonDismissed]);

  // ── Reset abandonment state on route change ─────────────────────
  useEffect(() => {
    setFormTouched(false);
    setShowAbandon(false);
    setAbandonDismissed(false);
  }, [pathname, setFormTouched]);

  const isFormPage = ["/contact", "/audit-submission"].includes(pathname);

  return (
    <VisitorContext.Provider
      value={{
        isRepeatVisitor,
        visitCount,
        greeting,
        openChatbot,
        registerChatbotOpener: (fn) => { chatbotOpenerRef.current = fn; },
        setFormTouched,
      }}
    >
      {/* 1 + 3 + 5 — Welcome Banner */}
      {!bannerDismissed && (
        <WelcomeBanner
          visitCount={visitCount}
          isRepeatVisitor={isRepeatVisitor}
          greeting={greeting}
          headlineData={headlineData}
          lastPageLabel={lastPageLabel}
          lastPagePath={lastPagePath}
          timeOfDay={timeOfDay}
          onOpenChatbot={openChatbot}
          onDismiss={() => setBannerDismissed(true)}
        />
      )}

      {/* Spacer so content isn't hidden behind banner */}
      {!bannerDismissed && (
        <div
          className="h-[46px] transition-all duration-500"
          aria-hidden="true"
          id="welcome-banner-spacer"
        />
      )}

      {/* 4 — Exit intent popup */}
      {showExitPopup && (
        <ExitIntentPopup onDismiss={() => setShowExitPopup(false)} />
      )}

      {/* 6 — Idle chatbot nudge */}
      {showIdleNudge && !showExitPopup && (
        <IdleChatbotNudge
          title={pageCtx.nudgeTitle}
          text={pageCtx.nudgeText}
          badge={pageCtx.badge}
          onOpen={() => {
            openChatbot();
            setShowIdleNudge(false);
            setIdleNudgeDismissed(true);
          }}
          onDismiss={() => {
            setShowIdleNudge(false);
            setIdleNudgeDismissed(true);
          }}
        />
      )}

      {/* 7 — Form abandonment popup */}
      {showAbandon && isFormPage && (
        <FormAbandonmentPopup
          onDismiss={() => {
            setShowAbandon(false);
            setAbandonDismissed(true);
          }}
        />
      )}

      {/* 8 — Sticky CTA */}
      <StickyCTA visible={hasScrolled && !bannerDismissed === false || hasScrolled} />
    </VisitorContext.Provider>
  );
}
