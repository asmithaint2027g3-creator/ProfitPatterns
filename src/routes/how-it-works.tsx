import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FrameworkSection } from "@/components/sections/FrameworkSection";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { processSteps } from "@/content/framework";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: pageMeta({
      title: "How We Work | ProfitPatterns — From Problem to Solution",
      description:
        "A clear five-step process: Discovery, Opportunity Mapping, Solution Design, Implementation and Measurement. See how a ProfitPatterns engagement works, step by step.",
    }),
    links: canonical("/how-it-works"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "How It Works", path: "/how-it-works" },
      ]),
    ],
  }),
  component: HowItWorks,
});

function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="How We Work"
        title="A Clear Path From Problem to Solution."
        description="Five steps, agreed before anything begins. We learn about your business, identify opportunities, design the right approach, implement the solution and measure the impact."
      />

      <Section>
        <ol className="space-y-5">
          {processSteps.map((step, idx) => (
            <ScrollReveal key={step.number} delay={idx * 80} direction="up">
              <li className="rounded border border-border bg-card p-7 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md md:flex md:gap-8">
                <div className="md:w-52 md:shrink-0">
                  <span className="font-display text-4xl font-bold text-primary">{step.number}</span>
                  <h2 className="mt-2 font-display text-xl font-bold tracking-tight text-foreground">{step.title}</h2>
                </div>
                <div className="mt-4 md:mt-0 md:border-l md:border-border md:pl-8">
                  <p className="text-base font-semibold text-foreground">{step.description}</p>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                </div>
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </Section>

      <Section className="border-y border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <FrameworkSection />
        </ScrollReveal>
      </Section>

      <Section>
        <ScrollReveal direction="up">
          <FinalCTA location="how_it_works_final_cta" />
        </ScrollReveal>
      </Section>
    </>
  );
}
