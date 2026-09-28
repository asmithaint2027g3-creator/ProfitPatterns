import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Pause,
  Play,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideData {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  metric: string;
  metricLabel: string;
  points: string[];
  ctaLabel: string;
  ctaLink: string;
  icon: typeof BrainCircuit;
  accentColor: string;
}

const SLIDES: SlideData[] = [
  {
    id: "diagnostic",
    badge: "Stage 01 • Discovery",
    title: "AI Opportunity Diagnostic",
    subtitle: "Identify high-leverage workflows where automation drives immediate EBITDA margin expansion.",
    metric: "14-Day",
    metricLabel: "Diagnostic Delivery",
    points: [
      "Process mapping & friction assessment",
      "Cost-benefit & feasibility scoring",
      "Executive implementation blueprint",
    ],
    ctaLabel: "Schedule AI Diagnostic",
    ctaLink: "/contact",
    icon: Sparkles,
    accentColor: "from-amber-500/20 to-orange-500/5",
  },
  {
    id: "automation",
    badge: "Stage 02 • Optimization",
    title: "Process & Workflow Re-engineering",
    subtitle: "Eliminate repetitive manual overhead and connect fragmented systems into unified operations.",
    metric: "40%",
    metricLabel: "Cycle Time Reduction",
    points: [
      "End-to-end operational handoff elimination",
      "Document intake & audit parsing",
      "Human-in-the-loop validation checkpoints",
    ],
    ctaLabel: "Explore Process Audit",
    ctaLink: "/audit-submission",
    icon: Cpu,
    accentColor: "from-blue-500/20 to-indigo-500/5",
  },
  {
    id: "intelligence",
    badge: "Stage 03 • Implementation",
    title: "Enterprise Intelligence Pipelines",
    subtitle: "Deploy production-grade LLM architectures, retrieval systems, and decision agents tailored to your data.",
    metric: "99.4%",
    metricLabel: "Operational Accuracy",
    points: [
      "Secure retrieval-augmented reasoning",
      "Strict data privacy & governance safeguards",
      "Real-time enterprise intelligence feeds",
    ],
    ctaLabel: "See Solutions",
    ctaLink: "/solutions",
    icon: BrainCircuit,
    accentColor: "from-emerald-500/20 to-teal-500/5",
  },
  {
    id: "advantage",
    badge: "Stage 04 • Scale",
    title: "Capital & Margin Expansion",
    subtitle: "Turn technology from a defensive cost center into a defensible valuation multiple and growth moat.",
    metric: "3.2x",
    metricLabel: "Average Value Multiple",
    points: [
      "Direct P&L attribution and auditability",
      "Scalable infrastructure without head-count bloat",
      "Defensible strategic competitive moat",
    ],
    ctaLabel: "Review Case Studies",
    ctaLink: "/how-it-works",
    icon: TrendingUp,
    accentColor: "from-primary/25 to-primary/5",
  },
];

export function IntroSlider() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-play slider
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const slide = SLIDES[currentIdx];
  const IconComponent = slide.icon;

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  return (
    <div
      className="relative rounded-2xl border border-border bg-[#FCFBF8] shadow-sm overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Top Slider Navigation Tabs */}
      <div className="flex border-b border-border/70 bg-[#F5F2EB]/80 backdrop-blur-xs overflow-x-auto no-scrollbar">
        {SLIDES.map((s, idx) => {
          const isActive = idx === currentIdx;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={cn(
                "group relative flex-1 min-w-[130px] px-3.5 py-3 text-left transition-all duration-200 cursor-pointer border-r border-border/40 last:border-r-0",
                isActive
                  ? "bg-card text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    isActive ? "bg-primary" : "bg-muted-foreground/30 group-hover:bg-primary/50"
                  )}
                />
                <span className="font-display text-[11px] font-bold uppercase tracking-wider truncate">
                  {s.badge.split("•")[0].trim()}
                </span>
              </div>
              <p className="mt-1 text-[13px] font-medium tracking-tight truncate">
                {s.title}
              </p>

              {/* Progress bar line for active item */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Slide Body */}
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Left Text & Actions */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 font-display text-[11px] font-bold uppercase tracking-wider text-primary">
              <IconComponent className="size-3.5" />
              <span>{slide.badge}</span>
            </div>

            <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {slide.title}
            </h3>

            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {slide.subtitle}
            </p>

            {/* Bullet Points */}
            <ul className="mt-5 space-y-2">
              {slide.points.map((pt, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-foreground/90 font-medium">
                  <CheckCircle2 className="size-4 shrink-0 text-primary" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            {/* Action Buttons */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="md" variant="primary">
                <Link to={slide.ctaLink as "/"}>
                  {slide.ctaLabel}
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button asChild size="md" variant="outline">
                <Link to="/solutions">Browse Practice Areas</Link>
              </Button>
            </div>
          </div>

          {/* Right Visual Metric Panel */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-border/80 bg-gradient-to-br from-card via-[#F9F7F2] to-[#EFEBE4] p-6 sm:p-8 shadow-xs overflow-hidden">
              <div
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br blur-2xl",
                  slide.accentColor
                )}
              />

              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Expected Impact
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                  <ShieldCheck className="size-3" /> Measured ROI
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="my-6">
                <p className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-foreground">
                  {slide.metric}
                </p>
                <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wider text-primary">
                  {slide.metricLabel}
                </p>
              </div>

              <div className="border-t border-border/60 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>Verified across production deployments</span>
                <span className="font-mono text-primary font-bold">0{currentIdx + 1}/04</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Slider Controls Strip */}
      <div className="flex items-center justify-between border-t border-border/60 bg-[#F8F6F0]/70 px-6 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 text-[11px] font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
            aria-label={isPlaying ? "Pause slider" : "Play slider"}
          >
            {isPlaying ? (
              <>
                <Pause className="size-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="size-3" />
                <span>Auto-play</span>
              </>
            )}
          </button>
        </div>

        {/* Arrow Navigation */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="flex size-7 items-center justify-center rounded border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="px-1.5 font-mono text-[11px] font-semibold text-foreground">
            {currentIdx + 1} / {SLIDES.length}
          </span>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="flex size-7 items-center justify-center rounded border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
