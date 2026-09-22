import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";
import { track } from "@/lib/analytics";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    meta: pageMeta({
      title: "AI, Automation & Business Strategy Solutions | ProfitPatterns",
      description:
        "ProfitPatterns offers AI strategy consulting, business automation, data analytics, process optimization, digital transformation and profit growth strategy — built around your business problem.",
    }),
    links: canonical("/solutions"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Solutions", path: "/solutions" },
      ]),
    ],
  }),
  component: SolutionsIndex,
});

function SolutionsIndex() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Solutions Built Around Business Problems."
        description="Every business has different priorities. Instead of forcing every organization into the same technology stack, ProfitPatterns focuses on identifying the solution that fits the business need."
      >
        <Button asChild size="lg">
          <Link to="/contact" onClick={() => track("cta_click", { location: "solutions_hero", cta: "talk_to_expert" })}>
            Talk to an Expert
          </Link>
        </Button>
      </PageHero>

      <Section>
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="What We Do"
            title="Six ways we help businesses create measurable value."
            description="Each solution starts from a business problem and is designed to deliver practical, measurable improvement."
          />
        </ScrollReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <ScrollReveal key={service.slug} delay={idx * 80} direction="up">
              <Link
                to="/solutions/$slug"
                params={{ slug: service.slug }}
                onClick={() => track("service_view", { service: service.slug, from: "solutions_index" })}
                className="group flex h-full flex-col justify-between rounded border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{service.code}</span>
                  <h3 className="mt-2.5 font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{service.tagline}</p>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">{service.summary}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-semibold text-primary">
                  Explore Solution
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section>
        <ScrollReveal direction="up">
          <FinalCTA location="solutions_index_final_cta" />
        </ScrollReveal>
      </Section>
    </>
  );
}
