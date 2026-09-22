import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface SlideData {
  id: string;
  category: string;
  title: string;
  description: string;
  metric: string;
  metricLabel: string;
  renderSvg: () => React.ReactNode;
}

const slides: SlideData[] = [
  {
    id: "strategy",
    category: "01 / STRATEGY",
    title: "AI Profit Architecture",
    description:
      "Connecting generative models and predictive intelligence directly to gross margin expansion and unit economics.",
    metric: "Direct P&L",
    metricLabel: "Value Realization",
    renderSvg: () => (
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Subtle grid background */}
        <defs>
          <pattern id="grid-strategy" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#grid-strategy)" opacity="0.7" />

        {/* Concentric strategy circles */}
        <circle cx="200" cy="120" r="90" stroke="#8B7355" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
        <circle cx="200" cy="120" r="65" stroke="#1A1A1A" strokeWidth="1" opacity="0.3" />
        <circle cx="200" cy="120" r="40" stroke="#8B7355" strokeWidth="1.5" opacity="0.6" />
        <circle cx="200" cy="120" r="8" fill="#8B7355" />

        {/* Strategic coordinate axes */}
        <line x1="60" y1="120" x2="340" y2="120" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="30" x2="200" y2="210" stroke="#8B7355" strokeWidth="1" opacity="0.4" />

        {/* Vector Nodes */}
        <line x1="200" y1="120" x2="280" y2="65" stroke="#1A1A1A" strokeWidth="1.5" />
        <circle cx="280" cy="65" r="5" fill="#1A1A1A" />
        <text x="290" y="68" fill="#1A1A1A" fontSize="10" fontFamily="Times New Roman" fontStyle="italic">ROI Delta</text>

        <line x1="200" y1="120" x2="110" y2="80" stroke="#8B7355" strokeWidth="1.5" />
        <circle cx="110" cy="80" r="5" fill="#8B7355" />
        <text x="68" y="82" fill="#8B7355" fontSize="10" fontFamily="Times New Roman">P&L Nexus</text>

        <line x1="200" y1="120" x2="260" y2="175" stroke="#8B7355" strokeWidth="1.5" />
        <circle cx="260" cy="175" r="4" fill="#8B7355" />
        <text x="270" y="180" fill="#66615B" fontSize="10" fontFamily="Times New Roman">Yield Curve</text>

        {/* Precision corner marks */}
        <path d="M 15 25 L 15 15 L 25 15" stroke="#8B7355" strokeWidth="1.2" />
        <path d="M 385 25 L 385 15 L 375 15" stroke="#8B7355" strokeWidth="1.2" />
        <path d="M 15 215 L 15 225 L 25 225" stroke="#8B7355" strokeWidth="1.2" />
        <path d="M 385 215 L 385 225 L 375 225" stroke="#8B7355" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    id: "automation",
    category: "02 / AUTOMATION",
    title: "Intelligent Process Engineering",
    description:
      "Eliminating friction, handoff latency, and repetitive human labor through structured, autonomous operational pipelines.",
    metric: "10x Throughput",
    metricLabel: "Cycle Compression",
    renderSvg: () => (
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid-auto" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#grid-auto)" opacity="0.7" />

        {/* Process Pipelines */}
        <path
          d="M 40 120 C 110 120, 130 60, 200 60 C 270 60, 290 120, 360 120"
          stroke="#8B7355"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 40 120 C 110 120, 130 180, 200 180 C 270 180, 290 120, 360 120"
          stroke="#1A1A1A"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          fill="none"
          opacity="0.6"
        />
        <line x1="40" y1="120" x2="360" y2="120" stroke="#E5E0D8" strokeWidth="1" />

        {/* Nodes along flow */}
        <rect x="180" y="45" width="40" height="30" rx="3" fill="#FFFFFF" stroke="#8B7355" strokeWidth="1.5" />
        <text x="188" y="64" fill="#8B7355" fontSize="10" fontFamily="Times New Roman" fontWeight="bold">TASK α</text>

        <rect x="180" y="165" width="40" height="30" rx="3" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.5" />
        <text x="188" y="184" fill="#1A1A1A" fontSize="10" fontFamily="Times New Roman" fontWeight="bold">TASK β</text>

        <circle cx="360" cy="120" r="7" fill="#8B7355" />
        <text x="310" y="145" fill="#1A1A1A" fontSize="10" fontFamily="Times New Roman" fontStyle="italic">Execution Terminal</text>

        <circle cx="40" cy="120" r="5" fill="#1A1A1A" />
        <text x="35" y="145" fill="#66615B" fontSize="10" fontFamily="Times New Roman">Input Pipeline</text>
      </svg>
    ),
  },
  {
    id: "analytics",
    category: "03 / DATA FOUNDATIONS",
    title: "Decision Signals & Analytics",
    description:
      "Turning chaotic data repositories into unified predictive models and actionable signals for executive decision-making.",
    metric: "High-Confidence",
    metricLabel: "Executive Signals",
    renderSvg: () => (
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid-data" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#grid-data)" opacity="0.7" />

        {/* Radar polygon */}
        <polygon
          points="200,45 280,95 250,185 150,185 120,95"
          stroke="#E5E0D8"
          strokeWidth="1"
          fill="none"
        />
        <polygon
          points="200,75 255,110 235,165 165,165 145,110"
          stroke="#8B7355"
          strokeWidth="1"
          strokeDasharray="2 2"
          fill="none"
          opacity="0.5"
        />
        <polygon
          points="200,60 270,105 240,175 155,160 135,100"
          stroke="#8B7355"
          strokeWidth="1.5"
          fill="rgba(139, 115, 85, 0.08)"
        />

        {/* Center axis lines */}
        <line x1="200" y1="125" x2="200" y2="45" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="125" x2="280" y2="95" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="125" x2="250" y2="185" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="125" x2="150" y2="185" stroke="#8B7355" strokeWidth="1" opacity="0.4" />
        <line x1="200" y1="125" x2="120" y2="95" stroke="#8B7355" strokeWidth="1" opacity="0.4" />

        <circle cx="200" cy="60" r="3.5" fill="#8B7355" />
        <circle cx="270" cy="105" r="3.5" fill="#8B7355" />
        <circle cx="240" cy="175" r="3.5" fill="#8B7355" />
        <circle cx="155" cy="160" r="3.5" fill="#8B7355" />
        <circle cx="135" cy="100" r="3.5" fill="#8B7355" />

        <text x="180" y="38" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Accuracy</text>
        <text x="285" y="98" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Velocity</text>
        <text x="255" y="198" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Reliability</text>
        <text x="110" y="198" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Governance</text>
        <text x="75" y="98" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Coverage</text>
      </svg>
    ),
  },
  {
    id: "transformation",
    category: "04 / TRANSFORMATION",
    title: "Pragmatic Digital Transformation",
    description:
      "Modernizing legacy architectures through incremental, high-adoption milestones rather than high-risk multi-year overhauls.",
    metric: "Unit Economics",
    metricLabel: "Pragmatic Scale",
    renderSvg: () => (
      <svg
        viewBox="0 0 400 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid-trans" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E5E0D8" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="400" height="240" fill="url(#grid-trans)" opacity="0.7" />

        {/* Isometric modular scaffolding */}
        {/* Tier 1 - Foundation */}
        <path d="M 120 180 L 200 140 L 280 180 L 200 220 Z" fill="#F5F2EB" stroke="#8B7355" strokeWidth="1.2" />
        <path d="M 120 180 L 120 195 L 200 235 L 200 220 Z" fill="#EAE5DC" stroke="#8B7355" strokeWidth="1" />
        <path d="M 280 180 L 280 195 L 200 235 L 200 220 Z" fill="#D4CEBF" stroke="#8B7355" strokeWidth="1" />

        {/* Tier 2 - Core Operations */}
        <path d="M 140 135 L 200 105 L 260 135 L 200 165 Z" fill="#FFFFFF" stroke="#1A1A1A" strokeWidth="1.2" />
        <path d="M 140 135 L 140 148 L 200 178 L 200 165 Z" fill="#F0ECE4" stroke="#1A1A1A" strokeWidth="1" />
        <path d="M 260 135 L 260 148 L 200 178 L 200 165 Z" fill="#E5E0D8" stroke="#1A1A1A" strokeWidth="1" />

        {/* Tier 3 - AI Intelligence Apex */}
        <path d="M 165 90 L 200 72 L 235 90 L 200 108 Z" fill="#8B7355" stroke="#8B7355" strokeWidth="1.2" />
        <path d="M 165 90 L 165 100 L 200 118 L 200 108 Z" fill="#786246" stroke="#8B7355" strokeWidth="1" />
        <path d="M 235 90 L 235 100 L 200 118 L 200 108 Z" fill="#685339" stroke="#8B7355" strokeWidth="1" />

        {/* Apex beam */}
        <line x1="200" y1="72" x2="200" y2="35" stroke="#8B7355" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="200" cy="35" r="4" fill="#8B7355" />

        <text x="215" y="40" fill="#8B7355" fontSize="10" fontFamily="Times New Roman" fontStyle="italic">AI Advantage Layer</text>
        <text x="275" y="140" fill="#1A1A1A" fontSize="9" fontFamily="Times New Roman">Operational Core</text>
        <text x="295" y="190" fill="#66615B" fontSize="9" fontFamily="Times New Roman">Data Foundation</text>
      </svg>
    ),
  },
];

export function HeroVisualCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = slides[current];

  return (
    <div
      className="relative flex flex-col rounded border border-border bg-card p-6 shadow-sm transition-all lg:p-7"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="ProfitPatterns Strategic Focus Areas"
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 pb-4">
        <div className="flex items-center gap-2">
          <span className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {slide.category}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="flex size-7 items-center justify-center rounded border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={isPaused ? "Play carousel" : "Pause carousel"}
          >
            {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
            className="flex size-7 items-center justify-center rounded border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
            className="flex size-7 items-center justify-center rounded border border-border bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Abstract SVG Canvas with smooth transition */}
      <div
        key={slide.id}
        className="animate-rise transition-all duration-500 ease-out"
      >
        <div className="relative my-4 aspect-[16/10] w-full overflow-hidden rounded border border-border/60 bg-[#FAFAF8] p-2 flex items-center justify-center">
          {slide.renderSvg()}

          {/* Floating Strategic Badge */}
          <div className="absolute bottom-3 right-3 rounded border border-border bg-card/95 px-3 py-1.5 shadow-sm backdrop-blur-sm transition-transform hover:scale-105">
            <p className="font-display text-xs font-bold tracking-tight text-foreground">
              {slide.metric}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {slide.metricLabel}
            </p>
          </div>
        </div>

        {/* Slide Text Content */}
        <div className="min-h-[90px] pt-1">
          <h3 className="font-display text-xl font-bold tracking-tight text-foreground">
            {slide.title}
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            {slide.description}
          </p>
        </div>
      </div>

      {/* Slide Pagination Dots */}
      <div className="mt-5 flex items-center justify-between border-t border-border/80 pt-4">
        <div className="flex gap-1.5">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrent(idx)}
              className={cn(
                "h-1.5 rounded transition-all duration-300 cursor-pointer",
                idx === current
                  ? "w-7 bg-primary"
                  : "w-2 bg-border hover:bg-muted-foreground/40",
              )}
              aria-label={`Go to slide ${idx + 1}: ${s.title}`}
              aria-current={idx === current ? "true" : undefined}
            />
          ))}
        </div>
        <span className="font-display text-[11px] text-muted-foreground font-medium">
          {current + 1} of {slides.length}
        </span>
      </div>
    </div>
  );
}
