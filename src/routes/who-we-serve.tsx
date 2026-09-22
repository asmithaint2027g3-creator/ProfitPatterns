import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Compass,
  Layers,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { whoWeServeSegments } from "@/content/whoWeServe";
import { track } from "@/lib/analytics";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/who-we-serve")({
  head: () => ({
    meta: pageMeta({
      title: "Who We Serve | ProfitPatterns — Strategic Advisory for Leaders, Boards & Investors",
      description:
        "AI disruption, profitability pressure, and strategic uncertainty demand more than technology decisions. Discover how ProfitPatterns advises CXOs, Boards, Private Equity, and Family Enterprises.",
    }),
    links: canonical("/who-we-serve"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Who We Serve", path: "/who-we-serve" },
      ]),
    ],
  }),
  component: WhoWeServePage,
});

const segmentIcons: Record<string, typeof Briefcase> = {
  "cxos-enterprise-leaders": Briefcase,
  "boards-directors": ShieldCheck,
  "private-equity-investors": TrendingUp,
  "family-owned-enterprises": Compass,
};

function WhoWeServePage() {
  const [activeTab, setActiveTab] = useState(whoWeServeSegments[0].anchor);

  const scrollToAnchor = (anchor: string) => {
    setActiveTab(anchor);
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <PageHero
        eyebrow="STRATEGIC ADVISORY BY CUSTOMER PROFILE"
        title="Who We Serve."
        description="AI disruption, profitability pressure, and strategic uncertainty demand more than technology decisions. ProfitPatterns helps decision-makers translate AI into measurable business value and long-term competitive advantage."
      />

      {/* Sticky Quick-Nav Segment Switcher */}
      <div className="sticky top-16 sm:top-20 z-30 border-b border-border bg-[#FAFAF8]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-2 shrink-0 font-display">
              Navigate:
            </span>
            {whoWeServeSegments.map((segment) => {
              const Icon = segmentIcons[segment.anchor] || Briefcase;
              const isActive = activeTab === segment.anchor;
              return (
                <button
                  key={segment.anchor}
                  type="button"
                  onClick={() => scrollToAnchor(segment.anchor)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded text-xs sm:text-sm font-display font-semibold transition-all duration-150 shrink-0 cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-primary text-white shadow-xs"
                      : "bg-secondary/70 text-foreground hover:bg-secondary hover:text-primary",
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  {segment.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Four ICP Sections */}
      <div className="bg-background">
        {whoWeServeSegments.map((segment, index) => {
          const Icon = segmentIcons[segment.anchor] || Briefcase;
          const isEven = index % 2 === 1;

          return (
            <section
              key={segment.anchor}
              id={segment.anchor}
              className={cn(
                "scroll-mt-28 sm:scroll-mt-32 py-16 sm:py-24 border-b border-border",
                isEven ? "bg-[#FBF9F5]" : "bg-background",
              )}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal direction="up">
                  {/* Segment Header */}
                  <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded border border-primary/40 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      <Icon className="size-3.5" aria-hidden="true" />
                      Segment {index + 1}
                    </div>

                    <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      {segment.title}
                    </h2>

                    {/* One-line positioning statement */}
                    <p className="mt-2.5 font-display text-lg sm:text-xl font-semibold text-primary">
                      {segment.positioning}
                    </p>
                  </div>

                  {/* Their Reality Quote Box */}
                  <div className="mt-8 rounded-xl border border-primary/25 bg-card p-6 sm:p-8 shadow-xs">
                    <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Their Reality
                    </p>
                    <blockquote className="mt-2.5 font-display text-xl sm:text-2xl font-semibold italic text-foreground leading-snug">
                      {segment.reality}
                    </blockquote>
                  </div>

                  {/* Two-Column Grid: What's at Stake vs. How ProfitPatterns Helps */}
                  <div className="mt-10 grid gap-8 lg:grid-cols-2">
                    {/* What's at Stake — 4 business challenges */}
                    <div className="flex flex-col justify-between rounded-xl border border-amber-900/20 bg-amber-950/[0.02] p-6 sm:p-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="size-4 text-amber-700" />
                          <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-amber-800">
                            What’s at Stake
                          </h3>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                          Core business challenges and vulnerabilities confronting leadership in this segment.
                        </p>

                        <ul className="mt-6 space-y-3.5">
                          {segment.whatsAtStake.map((challenge) => (
                            <li key={challenge} className="flex items-start gap-3">
                              <span className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                              <span className="text-sm leading-relaxed text-foreground/90 font-medium">
                                {challenge}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-8 border-t border-amber-900/10 pt-4 text-[11px] text-amber-800 font-semibold uppercase tracking-wider">
                        High-Stakes Structural Risk
                      </div>
                    </div>

                    {/* How ProfitPatterns Helps — 4 specific solutions */}
                    <div className="flex flex-col justify-between rounded-xl border border-primary/30 bg-card p-6 sm:p-8 shadow-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="size-4 text-primary" />
                          <h3 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            How ProfitPatterns Helps
                          </h3>
                        </div>
                        <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                          Tailored strategy interventions engineered specifically for this operational reality.
                        </p>

                        <ul className="mt-6 space-y-3.5">
                          {segment.howWeHelp.map((solution) => (
                            <li key={solution} className="flex items-start gap-3">
                              <CheckCircle2 className="size-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-sm leading-relaxed text-foreground/90 font-medium">
                                {solution}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-8 border-t border-border/80 pt-4 text-[11px] text-primary font-semibold uppercase tracking-wider">
                        Strategic Solution Mandate
                      </div>
                    </div>
                  </div>

                  {/* Typical Outcomes — 3 outcomes & Segment-specific CTA */}
                  <div className="mt-8 rounded-xl border border-border bg-[#1A1A1A] p-6 sm:p-8 text-white">
                    <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
                      <div className="lg:col-span-8">
                        <span className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-[#C4B296]">
                          Typical Outcomes
                        </span>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          {segment.typicalOutcomes.map((outcome) => (
                            <div
                              key={outcome}
                              className="rounded border border-[#333333] bg-[#242424] p-4"
                            >
                              <p className="font-display text-base font-bold text-white leading-snug">
                                {outcome}
                              </p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-[11px] text-[#8C827A] italic">
                          Target benchmarks derived from custom strategy architectures. Not an automatic guarantee or independent verification.
                        </p>
                      </div>

                      <div className="lg:col-span-4 flex flex-col sm:items-end justify-center pt-4 lg:pt-0 border-t border-[#333333] lg:border-t-0 lg:border-l lg:pl-6">
                        <Button
                          asChild
                          size="lg"
                          className="bg-[#C4B296] text-[#1A1A1A] hover:bg-[#D4C5AC] font-bold w-full sm:w-auto"
                        >
                          <Link
                            to="/contact"
                            onClick={() =>
                              track("cta_click", {
                                location: "who_we_serve_section",
                                segment: segment.id,
                                cta: segment.ctaText,
                              })
                            }
                          >
                            {segment.ctaText}
                            <ArrowRight className="size-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </section>
          );
        })}
      </div>

      {/* Global Final CTA Band */}
      <Section>
        <ScrollReveal direction="up">
          <FinalCTA
            location="who_we_serve_final"
            eyebrow="TRANSLATING AI DISRUPTION INTO ENTERPRISE ADVANTAGE"
            title="Determine Where Your Strategy Begins."
            description="Whether you are leading enterprise transformation, directing board governance, scaling portfolio EBITDA, or modernizing family assets, ProfitPatterns anchors every engagement in defensible business logic."
          />
        </ScrollReveal>
      </Section>
    </>
  );
}
