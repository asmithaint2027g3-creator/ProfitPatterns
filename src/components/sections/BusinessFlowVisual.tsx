import {
  ArrowDown,
  BarChart3,
  CheckCircle2,
  Compass,
  Database,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface FlowStage {
  id: string;
  step: string;
  label: string;
  headline: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stages: FlowStage[] = [
  {
    id: "problem",
    step: "01",
    label: "BUSINESS PROBLEM",
    headline: "Identify Core Friction",
    detail: "Pinpoint operational bottlenecks, manual latency, or margin leakage across existing workflows.",
    icon: Search,
  },
  {
    id: "data",
    step: "02",
    label: "DATA",
    headline: "Unify Proprietary Signals",
    detail: "Audit data hygiene, sanitize historical logs, and establish trusted single sources of truth.",
    icon: Database,
  },
  {
    id: "ai",
    step: "03",
    label: "AI",
    headline: "Deploy Targeted Intelligence",
    detail: "Integrate specialized predictive models, autonomous pipelines, and semantic decision engines.",
    icon: Compass,
  },
  {
    id: "strategy",
    step: "04",
    label: "STRATEGY",
    headline: "Architect Direct P&L Alignment",
    detail: "Enforce rigorous governance, human review guardrails, and unit-economic ROI benchmarks.",
    icon: BarChart3,
  },
  {
    id: "value",
    step: "05",
    label: "BUSINESS VALUE",
    headline: "Realize Defensible Profit",
    detail: "Measure gross margin expansion, cycle time compression, and compounding competitive advantage.",
    icon: CheckCircle2,
  },
];

export function BusinessFlowVisual() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || isPaused) return;

    // Slow, elegant pacing: 2.6 seconds per step
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % stages.length);
    }, 2600);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative rounded-lg border border-border bg-card p-6 lg:p-7 shadow-sm transition-all"
      role="region"
      aria-label="ProfitPatterns Business-Flow Sequence"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3.5 mb-5">
        <div>
          <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            THE VALUE REALIZATION PATH
          </span>
          <h3 className="font-display text-[18px] font-bold text-foreground">
            From Operational Friction to Profit Advantage
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block size-2 rounded-full bg-primary animate-pulse" />
          <span className="font-display font-medium">Stage {activeStep + 1} of 5</span>
        </div>
      </div>

      {/* Vertical Stages Flow */}
      <div className="relative space-y-3">
        {stages.map((stage, idx) => {
          const isActive = activeStep === idx;
          const isPassed = activeStep > idx;
          const Icon = stage.icon;

          return (
            <div key={stage.id} className="relative">
              {/* Connector line from previous stage */}
              {idx > 0 && (
                <div
                  aria-hidden="true"
                  className="absolute -top-3.5 left-6 w-0.5 h-4 transition-colors duration-500 -translate-x-1/2"
                >
                  <div
                    className={cn(
                      "w-full h-full transition-all duration-700",
                      isActive || isPassed ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}

              {/* Stage Card */}
              <button
                type="button"
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "w-full text-left flex items-start gap-4 rounded border p-3.5 transition-all duration-300 cursor-pointer",
                  isActive
                    ? "border-primary bg-[#FAF8F5] shadow-sm translate-x-1 ring-1 ring-primary/20"
                    : "border-border/70 bg-card hover:bg-secondary/60 opacity-80 hover:opacity-100"
                )}
              >
                {/* Step badge / icon */}
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded border transition-colors duration-300",
                    isActive
                      ? "border-primary bg-primary text-white shadow-sm"
                      : isPassed
                      ? "border-primary/50 bg-secondary text-primary"
                      : "border-border bg-secondary text-muted-foreground"
                  )}
                >
                  <Icon className="size-4" />
                </div>

                {/* Stage Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "font-display text-[11px] font-bold uppercase tracking-[0.18em] transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {stage.label}
                    </span>
                    <span className="font-display text-[12px] font-semibold text-muted-foreground">
                      {stage.step}
                    </span>
                  </div>

                  <h4 className="mt-0.5 font-display text-[15px] font-bold text-foreground truncate">
                    {stage.headline}
                  </h4>

                  {isActive && (
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground animate-rise">
                      {stage.detail}
                    </p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom Progress Bar */}
      <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
          {stages.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded transition-all duration-300",
                i === activeStep ? "bg-primary" : i < activeStep ? "bg-primary/50" : "bg-border"
              )}
            />
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic font-display">
          {isPaused ? "Paused (Hovered)" : "Continuous Loop"}
        </p>
      </div>
    </div>
  );
}
