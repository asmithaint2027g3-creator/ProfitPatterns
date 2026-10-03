import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/layout/Section";
import { BusinessFlowVisual } from "@/components/sections/BusinessFlowVisual";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HeroVisualCarousel } from "@/components/sections/HeroVisualCarousel";
import { IntroSlider } from "@/components/sections/IntroSlider";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/config/site";
import { faqs } from "@/content/faqs";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";
import { canonical, faqSchema, organizationSchema, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const homeFaqs = faqs.slice(0, 5);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "ProfitPatterns | AI Profit Strategy Consulting",
      description:
        "ProfitPatterns helps businesses identify practical opportunities across AI, automation, data and process optimization to improve efficiency, decision-making and business value.",
    }),
    links: canonical("/"),
    scripts: [organizationSchema(), faqSchema(homeFaqs)],
  }),
  component: Home,
});

const STEPS = [
  {
    num: "01",
    label: "Understand",
    sub: "Unit Economics & Bottlenecks",
    desc: "We analyze workflows, cost centers, and manual friction points across operations.",
  },
  {
    num: "02",
    label: "Identify",
    sub: "High-Leverage AI Targets",
    desc: "We isolate high-ROI opportunities where automation directly protects or expands gross margins.",
  },
  {
    num: "03",
    label: "Act",
    sub: "Production & Measurement",
    desc: "We engineer production-grade pipelines, train internal teams, and verify P&L improvements.",
  },
];

const COMPARISON = [
  {
    dimension: "Core Objective",
    traditional: "Billable developer hours & tech stack implementation",
    profitPatterns: "Direct EBITDA margin expansion & measurable ROI",
  },
  {
    dimension: "Diagnostic Speed",
    traditional: "3 to 6 months of theoretical slide decks",
    profitPatterns: "14-day production feasibility audit & scorecard",
  },
  {
    dimension: "Solution Approach",
    traditional: "Generic SaaS tools & off-the-shelf bots",
    profitPatterns: "Custom deterministic pipelines tailored to your unit economics",
  },
  {
    dimension: "Attribution",
    traditional: "Vague productivity metrics and vanity stats",
    profitPatterns: "Auditable financial impact logged directly in your CRM",
  },
];

function Home() {
  const [heroMode, setHeroMode] = useState<"flow" | "carousel">("flow");
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);

  const activeService = services[selectedServiceIdx] ?? services[0]!;

  return (
    <div className="flex flex-col">
      {/* 1. Concise Editorial Hero */}
      <section className="relative border-b border-border bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Focused Executive Copy */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary animate-rise">
                <Sparkles className="size-3.5" />
                <span>AI Profit Strategy Advisory</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-rise">
                Turn AI Into a <span className="text-primary italic font-normal">Profit Advantage.</span>
              </h1>

              <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground animate-rise">
                We eliminate AI speculation. ProfitPatterns analyzes your workflows, identifies high-margin automation targets, and engineers production systems that generate measurable business returns.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3 animate-rise">
                <Button asChild size="lg" variant="primary">
                  <Link
                    to="/contact"
                    onClick={() => {
                      track("cta_click", { location: "hero", cta: "talk_to_expert" });
                      track("book_consultation", { location: "hero" });
                    }}
                  >
                    Schedule Diagnostic
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    to="/audit-submission"
                    onClick={() => {
                      track("cta_click", { location: "hero", cta: "audit_submission" });
                      track("start_audit", { location: "hero" });
                    }}
                  >
                    Submit Process Document
                  </Link>
                </Button>
                <WhatsAppCTA location="hero" size="lg" variant="outline" />
              </div>

              <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground animate-rise">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-3.5 text-primary" /> 14-Day Delivery
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-3.5 text-primary" /> Mutual NDA Guaranteed
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-3.5 text-primary" /> Verified P&L ROI
                </span>
              </div>
            </div>

            {/* Right Column: Visual Switcher */}
            <div className="lg:col-span-5">
              <div className="mb-2 flex items-center justify-end gap-2">
                <div className="inline-flex rounded border border-border bg-secondary/80 p-0.5 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setHeroMode("flow")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded transition-all cursor-pointer",
                      heroMode === "flow" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Layers className="size-3" /> Value Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode("carousel")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 rounded transition-all cursor-pointer",
                      heroMode === "carousel" ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Compass className="size-3" /> Capabilities
                  </button>
                </div>
              </div>

              {heroMode === "flow" ? <BusinessFlowVisual /> : <HeroVisualCarousel />}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Introduction Slider (Requirement #3) */}
      <Section className="border-b border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Executive Overview
              </p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">
                How ProfitPatterns Drives Transformation
              </h2>
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Explore 4 phases of margin expansion
            </p>
          </div>
          <IntroSlider />
        </ScrollReveal>
      </Section>

      {/* 3. Our Approach: Stepper Timeline (Visual alternative to 3 repetitive cards) */}
      <Section className="border-b border-border bg-background">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="OUR METHODOLOGY"
            title="Start With the Business. Then Engineer the AI."
            description="Technology decisions only succeed when anchored to unit economics. We follow a disciplined three-stage progression from operational discovery to production impact."
          />

          <div className="mt-8 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-7 left-12 right-12 h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

            <div className="grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <div
                  key={step.num}
                  className="relative flex flex-col rounded-xl border border-border/70 bg-card p-6 shadow-xs transition-all hover:border-primary/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-full border-2 border-primary bg-[#F9F7F2] font-display text-base font-bold text-primary shadow-xs">
                      {step.num}
                    </span>
                    <div>
                      <p className="font-display text-xs font-semibold uppercase tracking-wider text-primary">
                        {step.sub}
                      </p>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {step.label}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* 4. Solutions: Interactive Tabbed Matrix (Visual alternative to 6 identical cards) */}
      <Section id="solutions" className="border-b border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="STRATEGIC PRACTICES"
            title="Solutions Built Around Real Business Problems."
            description="Select a practice area to examine its strategic application, typical deliverables, and operational ROI."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/solutions">Explore All Solutions →</Link>
              </Button>
            }
          />

          {/* Interactive Split Navigator */}
          <div className="mt-8 grid gap-6 lg:grid-cols-12 rounded-xl border border-border bg-card shadow-xs overflow-hidden">
            {/* Left Nav Tabs */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-border bg-[#F8F6F0]/60 p-4 space-y-1.5">
              <p className="px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Select Practice Area
              </p>
              {services.map((svc, idx) => {
                const isSelected = idx === selectedServiceIdx;
                return (
                  <button
                    key={svc.slug}
                    type="button"
                    onClick={() => setSelectedServiceIdx(idx)}
                    className={cn(
                      "w-full flex items-center justify-between rounded-lg px-3.5 py-3 text-left transition-all cursor-pointer",
                      isSelected
                        ? "bg-card text-foreground font-semibold shadow-xs border border-primary/40 translate-x-1"
                        : "text-muted-foreground hover:bg-card/70 hover:text-foreground"
                    )}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="font-display text-[10px] font-bold uppercase text-primary tracking-wider">
                        {svc.code}
                      </span>
                      <p className="text-sm font-semibold truncate text-foreground">
                        {svc.title}
                      </p>
                    </div>
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-transform",
                        isSelected ? "text-primary translate-x-0.5" : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                );
              })}
            </div>

            {/* Right Dynamic Preview — Rich Executive Briefing */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-card">
              <div className="space-y-5">
                {/* Header Badge & Title */}
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                    <span className="font-mono">{activeService.code}</span>
                    <span>•</span>
                    <span>Strategic Practice Overview</span>
                  </div>

                  <h3 className="mt-2.5 font-display text-2xl sm:text-3xl font-bold text-foreground">
                    {activeService.title}
                  </h3>

                  <p className="mt-1.5 text-sm sm:text-base text-muted-foreground leading-relaxed font-medium">
                    {activeService.tagline}
                  </p>
                </div>

                {/* Primary Objective Banner */}
                <div className="rounded-lg border border-border/80 bg-[#F9F7F2] p-4">
                  <p className="font-display text-[11px] font-bold uppercase tracking-wider text-primary">
                    Strategic Objective
                  </p>
                  <p className="mt-1 text-sm text-foreground font-semibold leading-relaxed">
                    {activeService.objective}
                  </p>
                </div>

                {/* The Challenge We Address */}
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground block mb-1">
                    Operational Challenge Addressed:
                  </span>
                  <p>{activeService.problem}</p>
                </div>

                {/* Key Deliverables Grid */}
                <div>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
                    Key Practice Deliverables:
                  </span>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {activeService.deliverables.slice(0, 4).map((d, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-md border border-border/70 bg-[#FBF9F5] p-2.5 text-xs text-foreground/90 font-medium"
                      >
                        <CheckCircle2 className="size-4 shrink-0 text-primary mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Opportunity / Outcome */}
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 flex items-start gap-2.5">
                  <Sparkles className="size-4 shrink-0 text-primary mt-0.5" />
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    <strong className="text-foreground font-bold">Business Opportunity: </strong>
                    {activeService.opportunity}
                  </p>
                </div>
              </div>

              {/* Action Bottom Bar */}
              <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground font-medium">
                  Custom scoping & fixed-fee options available
                </span>
                <Button asChild size="sm" variant="primary">
                  <Link
                    to="/solutions/$slug"
                    params={{ slug: activeService.slug }}
                    onClick={() => track("service_view", { service: activeService.slug, from: "home_matrix" })}
                  >
                    View Practice Roadmap →
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* 5. Why ProfitPatterns: Comparative Advantage Table (Visual alternative to 6 repetitive cards) */}
      <Section className="border-b border-border bg-background">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="THE PROFITPATTERNS ADVANTAGE"
            title="Strategic Consulting vs. Technology Speculation"
            description="Why executive leadership and private equity sponsors choose ProfitPatterns over traditional IT agencies."
          />

          {/* Mobile: stacked cards */}
          <div className="mt-8 space-y-3 md:hidden">
            {COMPARISON.map((row, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-4 shadow-xs">
                <p className="font-display text-xs font-bold uppercase tracking-wider text-primary mb-3">{row.dimension}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-muted/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Traditional</p>
                    <div className="flex items-start gap-1.5">
                      <X className="size-3.5 shrink-0 text-muted-foreground/60 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed">{row.traditional}</span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1.5">ProfitPatterns</p>
                    <div className="flex items-start gap-1.5">
                      <Check className="size-3.5 shrink-0 text-primary mt-0.5" />
                      <span className="text-xs text-foreground font-medium leading-relaxed">{row.profitPatterns}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: comparison table */}
          <div className="mt-8 hidden md:block overflow-x-auto rounded-xl border border-border bg-card shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-[#F5F2EB] text-xs uppercase tracking-wider text-foreground font-display">
                <tr>
                  <th scope="col" className="p-4 sm:p-5 font-bold">Strategic Criteria</th>
                  <th scope="col" className="p-4 sm:p-5 font-bold text-muted-foreground">Traditional Advisory</th>
                  <th scope="col" className="p-4 sm:p-5 font-bold text-primary bg-primary/5">ProfitPatterns Model</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {COMPARISON.map((row, i) => (
                  <tr key={i} className="hover:bg-muted/20 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-foreground font-display">
                      {row.dimension}
                    </td>
                    <td className="p-4 sm:p-5 text-muted-foreground flex items-center gap-2">
                      <X className="size-4 shrink-0 text-muted-foreground/60" />
                      <span>{row.traditional}</span>
                    </td>
                    <td className="p-4 sm:p-5 text-foreground font-medium bg-primary/[0.02]">
                      <div className="flex items-center gap-2">
                        <Check className="size-4 shrink-0 text-primary font-bold" />
                        <span>{row.profitPatterns}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </Section>

      {/* 6. Executive Strategic Qualification Banner (Replaces bulky 800-line card grid) */}
      <Section className="border-b border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <div className="rounded-xl border border-border bg-gradient-to-r from-[#1A1A1A] via-[#242424] to-[#1A1A1A] p-6 sm:p-8 text-[#FAFAF8] flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C4B296]/30 bg-[#C4B296]/10 px-3 py-0.5 text-xs font-semibold text-[#C4B296]">
                <span>Executive Governance & ICP</span>
              </div>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Engineered for Key Decision-Makers
              </h3>
              <p className="mt-2 max-w-xl text-sm text-[#A8A29E] leading-relaxed">
                Specialized diagnostic tracks for Private Equity Operating Partners, Founder-Led Businesses, Operations Leaders, and Technical Executives.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <Button asChild size="md" className="bg-[#C4B296] text-[#1A1A1A] hover:bg-[#EAE5DC] font-semibold w-full sm:w-auto">
                <Link to="/who-we-serve">
                  View Strategic Profiles <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* 7. FAQs */}
      <Section className="border-b border-border bg-background">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="FAQ"
            title="Common Questions, Answered."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/faq">All Questions →</Link>
              </Button>
            }
          />
          <div className="mt-8">
            <FaqAccordion items={homeFaqs} />
          </div>
        </ScrollReveal>
      </Section>

      {/* 8. Final CTA */}
      <Section className="bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <FinalCTA
            location="home_final_cta"
            eyebrow="YOUR NEXT PROFIT OPPORTUNITY MAY ALREADY BE IN YOUR WORKFLOW."
            title="Let's Find It."
            description="Tell us what is slowing your business down, where you see manual friction or where you believe AI could make a difference. We start with the business problem and deliver measured outcomes."
          />
        </ScrollReveal>
      </Section>
    </div>
  );
}
