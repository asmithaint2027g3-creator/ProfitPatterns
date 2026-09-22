import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { workingPrinciples } from "@/content/trust";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About ProfitPatterns | AI & Business Strategy",
      description:
        "ProfitPatterns exists to help businesses make better use of AI, automation, data and technology by connecting them to real business objectives.",
    }),
    links: canonical("/about"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  }),
  component: About,
});

const blocks = [
  {
    heading: "Why ProfitPatterns Exists",
    body: [
      "Businesses are surrounded by technology choices. AI tools are evolving quickly. Automation is becoming more accessible. Data is being generated at an unprecedented pace.",
      "But having access to technology does not automatically create value. The difficult question is: where should a business actually use it?",
      "ProfitPatterns focuses on answering that question. We look at the business first, identify opportunities and develop practical strategies for using technology where it can make a meaningful difference.",
    ],
  },
  {
    heading: "What We Believe",
    body: [
      "We believe technology should simplify complexity rather than add to it.",
      "We believe AI should support clear business objectives.",
      "We believe data should help people make better decisions.",
      "We believe automation should free teams from unnecessary repetitive work.",
      "And we believe successful transformation should be measured by business impact, not by the number of technologies implemented.",
    ],
  },
  {
    heading: "Our Philosophy",
    body: [
      "Think Business First — understand the problem before recommending a solution.",
      "Make It Practical — strategies are only valuable when they can be acted on.",
      "Measure What Matters — track outcomes against a clear baseline from the start.",
    ],
  },
  {
    heading: "Our Approach",
    body: [
      "Every business challenge is different. Our approach begins by understanding the business context before recommending a technology solution.",
      "We examine: business objectives, current processes, operational challenges, data, existing systems and opportunities for improvement.",
      "Then we identify where technology can create practical value.",
    ],
  },
  {
    heading: "Our AI Philosophy",
    body: [
      "AI is a capability, not a strategy. It earns its place when a specific decision becomes faster, cheaper or better because of it.",
      "We are equally willing to recommend against AI. A rule, a redesigned process or stopping an activity altogether is often the higher-return answer, and we will say so.",
      "Guardrails come with every recommendation: data handling, human review points and acceptable failure modes are defined before anything moves forward.",
    ],
  },
  {
    heading: "How We Create Value",
    body: [
      "By making the business problem legible before spending money on solving it.",
      "By removing work that should not exist, rather than automating it.",
      "By building the measurement that lets leadership see whether a change actually worked.",
    ],
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Technology Should Create Business Value."
        description="ProfitPatterns exists to help businesses make better use of AI, automation, data and technology by connecting them to real business objectives."
      >
        <Button asChild size="lg">
          <Link to="/contact">Discuss Your Business</Link>
        </Button>
        <WhatsAppCTA location="about_hero" size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          {blocks.map((block, idx) => (
            <ScrollReveal key={block.heading} delay={idx * 75} direction="up">
              <article className="h-full rounded border border-border bg-card p-7 shadow-xs transition-all duration-300 hover:border-primary/30 hover:shadow-sm">
                <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
                  {block.heading}
                </h2>
                <div className="mt-4 space-y-3">
                  {block.body.map((paragraph) => (
                    <p key={paragraph} className="text-[15px] leading-relaxed text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-[#FBF9F5]">
        <ScrollReveal direction="up">
          <SectionHeading eyebrow="Why ProfitPatterns" title="Five Reasons to Choose a Business-First Approach" />
        </ScrollReveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workingPrinciples.map((principle, idx) => (
            <ScrollReveal key={principle.title} delay={idx * 80} direction="up">
              <div className="h-full rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md">
                <h3 className="font-display text-base font-bold tracking-tight text-foreground">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section>
        <ScrollReveal direction="up">
          <FinalCTA location="about_final_cta" />
        </ScrollReveal>
      </Section>
    </>
  );
}
