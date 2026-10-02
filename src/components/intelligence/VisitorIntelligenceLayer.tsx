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
// 1 + 3 + 5 — REPEAT VISITOR WELCOME BANNER
// ─────────────────────────────────────────────────────────────────
function WelcomeBanner({
  visitCount,
  isRepeatVisitor,
  greeting,
  lastPageLabel,
  lastPagePath,
  timeOfDay,
  onDismiss,
}: {
  visitCount: number;
  isRepeatVisitor: boolean;
  greeting: string;
  lastPageLabel: string | null;
  lastPagePath: string | null;
  timeOfDay: string;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay so page renders first
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const message = isRepeatVisitor
    ? `Welcome back! Great to have you with us again.`
    : `Welcome to ProfitPatterns!`;

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-transform duration-500",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
      role="banner"
      aria-live="polite"
    >
      <div className="bg-gradient-to-r from-[#1A1A1A] via-[#292929] to-[#1A1A1A] px-4 py-3 text-white shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          {/* Left side */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <TimeIcon tod={timeOfDay} />
              <span className="text-sm font-semibold text-white">{greeting}!</span>
            </div>

            <span className="hidden sm:inline text-[#A8A29E] text-xs">•</span>

            <span className="text-xs text-[#D4C9B8] truncate">
              {message}
            </span>

            {/* Last visited page alert */}
            {isRepeatVisitor && lastPageLabel && lastPagePath && (
              <>
                <span className="hidden md:inline text-[#A8A29E] text-xs">•</span>
                <div className="hidden md:flex items-center gap-1.5 text-xs text-[#C4B296]">
                  <BookOpen className="size-3 shrink-0" />
                  <span>Last time you visited:</span>
                  <Link
                    to={lastPagePath as "/"}
                    className="font-semibold text-[#E8D9C0] hover:text-white transition-colors underline underline-offset-2"
                  >
                    {lastPageLabel}
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right side — CTA + Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {isRepeatVisitor && (
              <Link
                to="/contact"
                className="hidden sm:inline-flex items-center gap-1.5 rounded border border-[#C4B296]/40 bg-[#C4B296]/10 px-3 py-1 text-xs font-semibold text-[#E8D9C0] hover:bg-[#C4B296]/20 transition-colors"
              >
                <Sparkles className="size-3" />
                Schedule a Call
              </Link>
            )}
            <button
              onClick={onDismiss}
              aria-label="Dismiss welcome banner"
              className="rounded p-1 text-[#A8A29E] hover:text-white transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Mobile: last visited page */}
        {isRepeatVisitor && lastPageLabel && lastPagePath && (
          <div className="md:hidden mt-1 flex items-center gap-1.5 text-xs text-[#C4B296]">
            <BookOpen className="size-3 shrink-0" />
            <span>Continue from:</span>
            <Link
              to={lastPagePath as "/"}
              className="font-semibold text-[#E8D9C0] hover:text-white transition-colors"
            >
              {lastPageLabel}
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
  onOpen,
  onDismiss,
}: {
  onOpen: () => void;
  onDismiss: () => void;
}) {
  return (
    <div className="fixed bottom-36 right-4 z-50 max-w-[220px] animate-rise md:bottom-24 md:right-20">
      <div className="relative rounded-2xl rounded-br-none border border-border bg-card p-4 shadow-xl">
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <X className="size-3" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Still with us?
          </span>
        </div>

        <p className="text-xs text-foreground/90 leading-relaxed">
          Can I help you find what you're looking for?
        </p>

        <button
          onClick={onOpen}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <MessageSquareText className="size-3.5" />
          Chat with us
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
    isIdle,
    hasScrolled,
    formTouched,
    setFormTouched,
  } = useVisitorIntelligence();

  const pathname = useRouterState({ select: (s) => s.location.pathname });

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
          lastPageLabel={lastPageLabel}
          lastPagePath={lastPagePath}
          timeOfDay={timeOfDay}
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
