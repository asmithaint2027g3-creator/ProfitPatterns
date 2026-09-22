import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { industries } from "@/content/industries";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    meta: pageMeta({
      title: "AI & Business Solutions by Industry | ProfitPatterns",
      description:
        "ProfitPatterns works across startups, SMBs, professional services, retail, financial services and operations-driven businesses to identify practical AI, automation and strategy opportunities.",
    }),
    links: canonical("/industries"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Industries", path: "/industries" },
      ]),
    ],
  }),
  component: IndustriesIndex,
});

function IndustriesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Business Challenges That Cross Every Sector."
        description="While every business is different, many challenges are shared. ProfitPatterns helps organizations across a range of industries identify practical opportunities for improvement."
      >
        <Button asChild size="lg">
          <Link to="/contact">Tell Us About Your Business</Link>
        </Button>
      </PageHero>

      <Section>
        <ScrollReveal direction="up">
          <SectionHeading
            eyebrow="Who We Work With"
            title="Built for Businesses That Want to Work Smarter."
            description="Whether you are building a new business, scaling an existing operation or looking for better ways to use technology, the starting point is the same: identify the opportunity."
          />
        </ScrollReveal>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, idx) => (
            <ScrollReveal key={industry.slug} delay={idx * 80} direction="up">
              <Link
                to="/industries/$slug"
                params={{ slug: industry.slug }}
                className="group flex h-full flex-col justify-between rounded border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">{industry.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{industry.headline}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-semibold text-primary">
                  Explore Industry
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section>
        <ScrollReveal direction="up">
          <FinalCTA location="industries_index_final_cta" />
        </ScrollReveal>
      </Section>
    </>
  );
}
