import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  LineChart,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface ICPSegment {
  id: string;
  number: string;
  title: string;
  targetRole: string;
  icon: typeof Building2;
  positioning: string;
  reality: string;
  whatsAtStake: string[];
  howProfitPatternsHelps: string[];
  typicalOutcomes: string[];
  cta: string;
}

export const icpSegments: ICPSegment[] = [
  {
    id: "cxos",
    number: "01",
    title: "CXOs & Enterprise Leaders",
    targetRole: "CEOs, COOs & CFOs",
    icon: Building2,
    positioning: "For CEOs, COOs & CFOs Leading Through AI Disruption",
    reality:
      "“You’re under pressure to ‘do something’ with AI — while ensuring it actually improves margins, growth, and strategic positioning.”",
    whatsAtStake: [
      "Margin erosion despite operational improvements",
      "AI investments without clear ROI",
      "Competitors shifting from products to platforms",
      "Board scrutiny on long-term defensibility",
    ],
    howProfitPatternsHelps: [
      "Translate AI potential into board-level profit strategy",
      "Identify where profit pools are leaking or migrating",
      "Design self-funded transformation roadmaps",
      "Build multi-pattern advantage across cost, growth, and moats",
    ],
    typicalOutcomes: [
      "15–25% EBITDA uplift",
      "6–18 month payback on AI investments",
      "Clear platform or ecosystem end-game",
    ],
    cta: "Schedule Strategic Diagnostic",
  },
  {
    id: "boards",
    number: "02",
    title: "Boards & Directors",
    targetRole: "Non-Executive & Independent Directors",
    icon: Shield,
    positioning: "For Boards Demanding Clarity, Not AI Theater",
    reality: "“Management talks AI. Vendors sell hype. Shareholders expect results.”",
    whatsAtStake: [
      "Capital misallocation",
      "Long-term competitive erosion",
      "Poor linkage between AI spend and valuation",
      "Blind spots in ecosystem threats",
    ],
    howProfitPatternsHelps: [
      "Independent, business-first AI strategy perspective",
      "Board-ready frameworks and value migration analysis",
      "Clear oversight of management AI initiatives",
      "Long-term moat and platform positioning",
    ],
    typicalOutcomes: [
      "Confident AI governance",
      "Sharper capital allocation decisions",
      "Stronger strategic oversight",
    ],
    cta: "Board-Level Diagnostic or Advisory Retainer",
  },
  {
    id: "pe-investors",
    number: "03",
    title: "Private Equity & Investors",
    targetRole: "Operating Partners & Deal Leads",
    icon: LineChart,
    positioning: "For Investors Focused on Value Creation, Not Experiments",
    reality:
      "“You need AI to create measurable enterprise value — not another portfolio-wide experiment.”",
    whatsAtStake: [
      "Missed EBITDA upside",
      "Fragmented AI pilots across the portfolio",
      "Lack of repeatable value-creation playbooks",
      "Limited visibility into AI-driven competitive disruption",
    ],
    howProfitPatternsHelps: [
      "Identify where AI creates real valuation uplift",
      "Design repeatable multi-pattern strategies",
      "Enable self-funded transformations",
      "Share pattern intelligence across the portfolio",
    ],
    typicalOutcomes: [
      "Portfolio-wide value creation visibility",
      "Repeatable AI value-creation playbooks",
      "Faster identification of EBITDA opportunities",
    ],
    cta: "Explore Portfolio Value Creation",
  },
  {
    id: "family-enterprises",
    number: "04",
    title: "Family-Owned Enterprises",
    targetRole: "Owners & Next-Gen Leaders",
    icon: Users,
    positioning: "For Owners Protecting Legacy While Building the Next Growth Engine",
    reality:
      "“You’ve built something valuable. Now you need to modernize without sacrificing control, culture, or long-term resilience.”",
    whatsAtStake: [
      "Growth slowing across generations",
      "Digital disruption to established revenue streams",
      "Technology investments without strategic clarity",
      "Loss of competitive advantage over time",
    ],
    howProfitPatternsHelps: [
      "Identify where AI can strengthen the existing business",
      "Build practical transformation roadmaps",
      "Protect core profit pools while creating new ones",
      "Develop long-term competitive and succession advantages",
    ],
    typicalOutcomes: [
      "Stronger and more resilient profit engines",
      "Clearer next-generation growth opportunities",
      "Self-funded modernization roadmap",
    ],
    cta: "Explore Your Next Growth Pattern",
  },
];

export function IdealCustomerProfileSection() {
  const [activeSegmentId, setActiveSegmentId] = useState<string>("cxos");
  const [viewMode, setViewMode] = useState<"focused" | "compare">("focused");

  const activeSegment =
    icpSegments.find((s) => s.id === activeSegmentId) || icpSegments[0];

  return (
    <section
      id="icp"
      aria-label="Ideal Customer Profile (ICP) Strategic Qualification Framework"
      className="relative overflow-hidden bg-background py-16 sm:py-24 border-y border-border"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ================================================================= */}
        {/* Section Header & Positioning                                      */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 border-b border-border pb-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Target className="size-3.5" aria-hidden="true" />
              Strategic Qualification Framework
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Who ProfitPatterns Is Built For.
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted-foreground">
              ProfitPatterns is engineered for decision-makers dealing with{" "}
              <span className="text-foreground font-semibold">
                AI disruption, profitability pressure, capital allocation, competitive threats,
                and long-term strategic positioning
              </span>
              . We deliver disciplined strategy and margin advantage across four distinct leadership environments.
            </p>
          </div>

          {/* View Toggle */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-xs font-display text-muted-foreground uppercase tracking-wider">
              Display:
            </span>
            <div className="inline-flex rounded border border-border bg-secondary p-1">
              <button
                type="button"
                onClick={() => setViewMode("focused")}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer font-display",
                  viewMode === "focused"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Detailed Segment View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("compare")}
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded transition-all cursor-pointer font-display",
                  viewMode === "compare"
                    ? "bg-card text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                All 4 Segments
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4 Segment Navigation Tabs                                         */}
        {/* ================================================================= */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {icpSegments.map((segment) => {
            const isSelected = activeSegmentId === segment.id;
            const Icon = segment.icon;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => {
                  setActiveSegmentId(segment.id);
                  if (viewMode === "compare") setViewMode("focused");
                  track("icp_segment_click", { segment: segment.id });
                }}
                className={cn(
                  "group flex flex-col justify-between rounded-lg border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer",
                  isSelected && viewMode === "focused"
                    ? "border-primary bg-card shadow-md ring-1 ring-primary/30 -translate-y-0.5"
                    : "border-border bg-card/60 hover:border-primary/40 hover:bg-card",
                )}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-display font-semibold uppercase tracking-wider text-primary">
                    <span>SEGMENT {segment.number}</span>
                    <Icon className="size-4 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="mt-2 font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {segment.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                    {segment.targetRole}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <span>Inspect Segment</span>
                  <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* FOCUSED SEGMENT DETAIL VIEW                                       */}
        {/* ================================================================= */}
        {viewMode === "focused" && (
          <div className="mt-10 rounded-xl border border-primary/30 bg-card p-6 sm:p-8 lg:p-10 shadow-md animate-rise">
            {/* Segment Title & Positioning */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded bg-secondary px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  Segment {activeSegment.number} Profile
                </div>
                <h3 className="mt-3 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                  {activeSegment.title}
                </h3>
                <p className="mt-2 font-display text-base sm:text-lg font-medium text-primary">
                  {activeSegment.positioning}
                </p>
              </div>

              {/* Segment-specific CTA button in top right */}
              <div className="shrink-0">
                <Button asChild size="md" variant="primary">
                  <Link
                    to="/contact"
                    onClick={() =>
                      track("cta_click", {
                        location: "icp_focused_card",
                        segment: activeSegment.id,
                        cta: activeSegment.cta,
                      })
                    }
                  >
                    {activeSegment.cta}
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Their Reality Quote Box */}
            <div className="mt-6 rounded-lg border border-border bg-[#F9F8F5] p-5 sm:p-6">
              <p className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-primary">
                Their Reality
              </p>
              <p className="mt-2 font-display text-lg sm:text-xl font-semibold italic text-foreground leading-relaxed">
                {activeSegment.reality}
              </p>
            </div>

            {/* 3-Column Diagnostic Matrix */}
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {/* Column 1: What's at Stake */}
              <div className="rounded-lg border border-border/80 bg-[#FAF9F5] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="size-4 text-amber-700" />
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground">
                      What’s at Stake
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Critical friction and vulnerabilities
                  </p>
                  <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/90">
                    {activeSegment.whatsAtStake.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2: How ProfitPatterns Helps */}
              <div className="rounded-lg border border-primary/40 bg-secondary/30 p-6 flex flex-col justify-between ring-1 ring-primary/20">
                <div>
                  <div className="flex items-center gap-2">
                    <Compass className="size-4 text-primary" />
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-primary">
                      How ProfitPatterns Helps
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Direct strategic interventions
                  </p>
                  <ul className="mt-5 space-y-3 text-xs sm:text-sm text-foreground/90">
                    {activeSegment.howProfitPatternsHelps.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                        <span className="leading-relaxed font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3: Typical Outcomes */}
              <div className="rounded-lg border border-emerald-900/20 bg-emerald-950/[0.02] p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-emerald-700" />
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-emerald-800">
                      Typical Outcomes
                    </h4>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Measurable enterprise impact
                  </p>
                  <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-foreground/90">
                    {activeSegment.typicalOutcomes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                        <span className="leading-relaxed font-semibold">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-emerald-900/10 pt-4 text-xs font-semibold text-emerald-800">
                  Targeted business outcomes
                </div>
              </div>
            </div>

            {/* Bottom Segment CTA bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <p className="text-xs text-muted-foreground max-w-xl">
                Every engagement begins with an executive diagnostic focused on your specific balance sheet and operational reality.
              </p>
              <div className="flex items-center gap-3">
                <Button asChild size="sm" variant="primary">
                  <Link
                    to="/contact"
                    onClick={() =>
                      track("cta_click", {
                        location: "icp_bottom_card",
                        segment: activeSegment.id,
                        cta: activeSegment.cta,
                      })
                    }
                  >
                    {activeSegment.cta}
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
                <WhatsAppCTA location={`icp_${activeSegment.id}`} size="sm" variant="outline" />
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* ALL 4 SEGMENTS COMPARATIVE VIEW                                   */}
        {/* ================================================================= */}
        {viewMode === "compare" && (
          <div className="mt-10 space-y-8 animate-rise">
            {icpSegments.map((segment) => {
              const Icon = segment.icon;
              return (
                <div
                  key={segment.id}
                  className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-display font-bold uppercase tracking-wider text-primary">
                        <Icon className="size-4" />
                        <span>Segment {segment.number}</span>
                      </div>
                      <h3 className="mt-2 font-display text-2xl font-bold text-foreground">
                        {segment.title}
                      </h3>
                      <p className="mt-1 font-display text-sm font-medium text-primary">
                        {segment.positioning}
                      </p>
                    </div>

                    <Button asChild size="sm" variant="primary">
                      <Link
                        to="/contact"
                        onClick={() =>
                          track("cta_click", {
                            location: "icp_compare_card",
                            segment: segment.id,
                            cta: segment.cta,
                          })
                        }
                      >
                        {segment.cta}
                        <ArrowRight className="size-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Their Reality */}
                  <div className="mt-5 rounded border border-border bg-[#F9F8F5] p-4">
                    <p className="text-[11px] font-display font-semibold uppercase tracking-[0.18em] text-primary">
                      Their Reality
                    </p>
                    <p className="mt-1.5 font-display text-base font-semibold italic text-foreground">
                      {segment.reality}
                    </p>
                  </div>

                  {/* 3-Column Diagnostic Matrix */}
                  <div className="mt-6 grid gap-5 md:grid-cols-3">
                    {/* What's at stake */}
                    <div className="rounded border border-border/80 bg-[#FAF9F5] p-5">
                      <p className="font-display text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                        <AlertTriangle className="size-3.5 text-amber-700" />
                        What’s at Stake
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-foreground/90">
                        {segment.whatsAtStake.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="size-1 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How ProfitPatterns helps */}
                    <div className="rounded border border-primary/30 bg-secondary/20 p-5">
                      <p className="font-display text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Compass className="size-3.5" />
                        How ProfitPatterns Helps
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-foreground/90">
                        {segment.howProfitPatternsHelps.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <CheckCircle2 className="size-3.5 text-primary mt-0.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Typical outcomes */}
                    <div className="rounded border border-emerald-900/20 bg-emerald-950/[0.02] p-5">
                      <p className="font-display text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <TrendingUp className="size-3.5 text-emerald-700" />
                        Typical Outcomes
                      </p>
                      <ul className="mt-3 space-y-2 text-xs text-foreground/90 font-medium">
                        {segment.typicalOutcomes.map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <span className="size-1 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================================================================= */}
        {/* Overall Section Executive Closing CTA Block                       */}
        {/* ================================================================= */}
        <div className="mt-16 sm:mt-24 rounded-2xl border border-primary/40 bg-[#1A1A1A] p-8 sm:p-12 lg:p-14 text-white shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-display text-xs font-bold uppercase tracking-[0.25em] text-[#C4B296]">
              Executive Strategic Alignment
            </span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              Recognize Your Leadership Environment?
            </h3>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-stone-300">
              ProfitPatterns is built for decision-makers dealing with{" "}
              <span className="text-white font-semibold">
                AI disruption, profitability pressure, capital allocation, competitive threats,
                and long-term strategic positioning
              </span>
              .
            </p>

            <div className="mt-6 border-y border-stone-700/60 py-4">
              <p className="font-display text-base sm:text-lg italic text-[#E5D8C4] max-w-2xl mx-auto">
                “ProfitPatterns is not about doing more. It is about identifying the patterns that
                constrain growth, then building a clearer and more profitable system around them.”
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#C4B296] text-[#1A1A1A] hover:bg-[#D4C5AC] font-bold"
              >
                <Link
                  to="/contact"
                  onClick={() =>
                    track("cta_click", {
                      location: "icp_footer",
                      cta: "explore_growth_pattern",
                    })
                  }
                >
                  Explore Your Growth Pattern
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <WhatsAppCTA
                location="icp_footer"
                size="lg"
                variant="outline"
                className="border-stone-600 text-white hover:bg-stone-800"
              />
            </div>

            <p className="mt-5 text-xs text-stone-400">
              Independent, board-level advisory. No junior sales reps, vendor commissions, or technology speculation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
