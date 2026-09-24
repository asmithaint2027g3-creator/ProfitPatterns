import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Compass, Layers } from "lucide-react";
import { useState } from "react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Section, SectionHeading } from "@/components/layout/Section";
import { BusinessFlowVisual } from "@/components/sections/BusinessFlowVisual";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FrameworkSection } from "@/components/sections/FrameworkSection";
import { HeroVisualCarousel } from "@/components/sections/HeroVisualCarousel";
import { IdealCustomerProfileSection } from "@/components/sections/IdealCustomerProfileSection";
import { ProblemDiscovery } from "@/components/sections/ProblemDiscovery";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/config/site";
import { faqs } from "@/content/faqs";
import { processSteps } from "@/content/framework";
import { services } from "@/content/services";
import { workingPrinciples } from "@/content/trust";
import { track } from "@/lib/analytics";
import { canonical, faqSchema, organizationSchema, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const homeFaqs = faqs.slice(0, 6);

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

const whatWeDo = [
  {
    step: "01",
    title: "Understand",
    body: "Understand the business model, unit economics, workflows, operational friction, and organizational bottlenecks.",
  },
  {
    step: "02",
    title: "Identify",
    body: "Identify high-leverage opportunities where AI, automation, data architecture, or process re-engineering drive direct profit.",
  },
  {
    step: "03",
    title: "Act",
    body: "Turn identified opportunities into pragmatic roadmaps, production-grade solutions, and measured business improvements.",
  },
];

function Home() {
  const [heroMode, setHeroMode] = useState<"flow" | "carousel">("flow");

  return (
    <>
      {/* Two-Column Editorial Hero with Staggered Entrance Animation */}
      <section className="relative border-b border-border bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 sm:pt-8 sm:pb-14 lg:pt-8 lg:pb-14">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Value Proposition & CTAs (Staggered load sequence) */}
            <div className="lg:col-span-7 pt-1 sm:pt-2">
              {/* 1. Eyebrow badge */}
              <div
                style={{ animationDelay: "0ms" }}
                className="inline-flex items-center gap-2 rounded border border-primary/30 bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary animate-rise"
              >
                AI Profit Strategy Consulting
              </div>

              {/* 2. Headline with slide-up entrance */}
              <h1
                style={{ animationDelay: "120ms" }}
                className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-rise"
              >
                Turn AI Into a <span className="text-primary italic font-normal">Profit Advantage.</span>
              </h1>

              {/* 3. Supporting Paragraph */}
              <p
                style={{ animationDelay: "240ms" }}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground animate-rise"
              >
                {siteConfig.description}
              </p>

              {/* 4. Action Buttons with Micro-interactions */}
              <div
                style={{ animationDelay: "360ms" }}
                className="mt-8 flex flex-wrap items-center gap-3.5 animate-rise"
              >
                <Button asChild size="lg" variant="primary">
                  <Link
                    to="/contact"
                    onClick={() => track("cta_click", { location: "hero", cta: "talk_to_expert" })}
                  >
                    Talk to an Expert
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link
                    to="/solutions"
                    onClick={() => track("cta_click", { location: "hero", cta: "explore_solutions" })}
                  >
                    Explore Our Solutions
                  </Link>
                </Button>
                <WhatsAppCTA location="hero" size="lg" variant="outline" />
              </div>

              {/* 5. Sub-quote */}
              <p
                style={{ animationDelay: "450ms" }}
                className="mt-6 border-l-2 border-primary/40 pl-3.5 text-xs uppercase tracking-wider text-muted-foreground animate-rise"
              >
                Start with the business problem. Find the right technology. Measure the impact.
              </p>
            </div>

            {/* Right Column: Hero Visual with Switcher between Value Flow & Strategic Focus */}
            <div
              style={{ animationDelay: "300ms" }}
              className="lg:col-span-5 animate-mega-menu"
            >
              {/* Mode Toggle Switcher */}
              <div className="mb-3 flex items-center justify-end gap-2">
                <span className="text-xs text-muted-foreground font-display">View:</span>
                <div className="inline-flex rounded border border-border bg-secondary/70 p-0.5">
                  <button
                    type="button"
                    onClick={() => setHeroMode("flow")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer",
                      heroMode === "flow"
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Layers className="size-3" />
                    Value Flow
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode("carousel")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded transition-all cursor-pointer",
                      heroMode === "carousel"
                        ? "bg-card text-primary shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Compass className="size-3" />
                    Capabilities
                  </button>
                </div>
              </div>

              {/* Render Selected Visual */}
              {heroMode === "flow" ? <BusinessFlowVisual /> : <HeroVisualCarousel />}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Discovery with Scroll Reveal */}
      <Section id="problems">
        <ScrollReveal direction="up" threshold={0.02}>
          <ProblemDiscovery />
        </ScrollReveal>
      </Section>

      {/* What We Do / Approach with Staggered Scroll Reveal */}
      <Section className="border-y border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="OUR APPROACH"
            title="Start With the Business. Then Find the Technology."
            description="We believe the best technology decisions begin with a clear understanding of the business. ProfitPatterns examines your objectives, processes, data and challenges to identify where AI, automation and strategic improvement can create practical value."
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {whatWeDo.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 100} direction="up">
              <div className="flex h-full flex-col justify-between rounded border border-border bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-md">
                <div>
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
                <div className="mt-6 border-t border-border pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Stage {item.step} Objective
                  </span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={300} direction="up">
          <div className="mt-10 flex justify-center">
            <Button asChild size="md">
              <Link to="/contact" onClick={() => track("cta_click", { location: "what_we_do", cta: "talk_to_expert" })}>
                Talk to an Expert
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </Section>

      {/* The ProfitPatterns Framework with Progressive Animation */}
      <Section id="framework">
        <ScrollReveal direction="up">
          <FrameworkSection />
        </ScrollReveal>
      </Section>

      {/* Solutions Preview with Staggered Scroll Reveal and Interactive Hover Cards */}
      <Section id="solutions" className="border-y border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="WHAT WE DO"
            title="Solutions Built Around Business Problems."
            description="Every business has different priorities. Instead of forcing every organization into the same technology stack, ProfitPatterns focuses on identifying the solution that fits the business need."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/solutions">Explore All Solutions</Link>
              </Button>
            }
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <ScrollReveal key={service.slug} delay={idx * 80} direction="up">
              <Link
                to="/solutions/$slug"
                params={{ slug: service.slug }}
                onClick={() => track("service_view", { service: service.slug, from: "home" })}
                className="group flex h-full flex-col justify-between rounded border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-md cursor-pointer"
              >
                <div>
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {service.code}
                  </span>
                  <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-200">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{service.tagline}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-semibold text-primary">
                  Explore Solution
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-1.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Why ProfitPatterns */}
      <Section>
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Why ProfitPatterns"
            title="Technology With a Business Reason."
            description="The goal is not to add more technology to your business. The goal is to find where technology can make your business work better."
          />
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workingPrinciples.map((item, idx) => (
            <ScrollReveal key={item.title} delay={idx * 75} direction="up">
              <div className="h-full rounded border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm">
                <h3 className="font-display text-base font-bold tracking-tight text-foreground">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Ideal Customer Profile (ICP) Strategic Qualification Framework */}
      <IdealCustomerProfileSection />

      {/* How It Works */}
      <Section>
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="How It Works"
            title="A Clear Path From Problem to Solution."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/how-it-works">See the detail</Link>
              </Button>
            }
          />
        </ScrollReveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {processSteps.map((step, idx) => (
            <ScrollReveal key={step.number} delay={idx * 80} direction="up">
              <li className="flex h-full flex-col justify-between rounded border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40">
                <div>
                  <span className="font-display text-xl font-bold text-primary">{step.number}</span>
                  <h3 className="mt-3 font-display text-base font-bold tracking-tight text-foreground">{step.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Section>

      {/* Case Studies — Coming Soon with Scroll Reveal */}
      <Section className="border-y border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Case Studies"
            title="See the Thinking Behind the Work."
            description="Explore how business challenges can be translated into practical strategies, technology solutions and measurable outcomes."
          />
          <div className="mt-12 rounded border border-border bg-card p-12 text-center shadow-xs transition-all hover:shadow-sm">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Curated Evidence
            </p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">
              Case Studies Coming Soon
            </p>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              We are assembling a rigorous collection of real-world engagements that demonstrate how strategic analysis, custom intelligence pipelines, and direct business objectives unite to produce defensible margin expansions.
            </p>
            <div className="mt-8 flex justify-center">
              <Button asChild size="md">
                <Link to="/contact" onClick={() => track("cta_click", { location: "case_studies", cta: "discuss_challenge" })}>
                  Discuss Your Business Challenge
                </Link>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </Section>

      {/* FAQ */}
      <Section>
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="FAQ"
            title="Common Questions, Answered."
            action={
              <Button asChild variant="outline" size="sm">
                <Link to="/faq">All questions</Link>
              </Button>
            }
          />
          <div className="mt-10">
            <FaqAccordion items={homeFaqs} />
          </div>
        </ScrollReveal>
      </Section>

      {/* Final CTA Band with Scroll Reveal */}
      <Section>
        <ScrollReveal direction="up">
          <FinalCTA
            location="home_final_cta"
            eyebrow="YOUR NEXT OPPORTUNITY MAY ALREADY BE IN YOUR BUSINESS."
            title="Let's Find It."
            description="Tell us what is slowing your business down, where you see an opportunity or where you believe AI could make a difference. We will start with the business problem and work toward the right path forward."
          />
        </ScrollReveal>
      </Section>
    </>
  );
}
