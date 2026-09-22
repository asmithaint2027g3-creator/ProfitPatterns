import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { resources } from "@/content/resources";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: pageMeta({
      title: "Business & AI Strategy Resources | ProfitPatterns",
      description:
        "Practical frameworks and checklists to help you assess AI opportunities, identify automation candidates, review business processes and evaluate readiness for technology investment.",
    }),
    links: canonical("/resources"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
      ]),
    ],
  }),
  component: ResourcesIndex,
});

function ResourcesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Practical Tools to Evaluate Your Opportunities."
        description="Before deciding on a technology investment, it helps to think clearly about the business problem and your readiness to solve it. These frameworks and checklists give you a structured starting point."
      >
        <Button asChild size="lg">
          <Link to="/contact">Talk to an Expert</Link>
        </Button>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="Available Resources"
          title="Structured Frameworks for Better Decisions."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Link
              key={resource.slug}
              to="/resources/$slug"
              params={{ slug: resource.slug }}
              className="group flex flex-col justify-between rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
            >
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">{resource.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-semibold text-primary">
                {resource.cta}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <FinalCTA location="resources_index_final_cta" />
      </Section>
    </>
  );
}
