import { Link, createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { caseStudies } from "@/content/case-studies";
import { track } from "@/lib/analytics";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: pageMeta({
      title: "Case Studies — ProfitPatterns engagements",
      description:
        "Anonymised AI strategy, automation and analytics engagements: the challenge, the approach, the solution and how outcomes were measured.",
    }),
    links: canonical("/case-studies"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Case Studies", path: "/case-studies" },
      ]),
    ],
  }),
  component: CaseStudiesIndex,
});

function CaseStudiesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="Engagements, described honestly."
        description="Client names and figures are withheld unless verified and approved for publication. Where a metric is not yet confirmed, we say so rather than estimate."
      />

      <Section>
        {caseStudies.length === 0 ? (
          <p className="rounded-2xl border border-border p-8 text-center text-muted-foreground">
            Case studies are being prepared and will appear here.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                to="/case-studies/$slug"
                params={{ slug: study.slug }}
                onClick={() => track("case_study_view", { slug: study.slug, from: "index" })}
                className="glass rounded-2xl p-7 transition-colors hover:ring-1 hover:ring-accent/40"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {study.sector}
                </span>
                <h2 className="mt-3 font-display text-xl font-semibold">{study.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{study.summary}</p>
                <span className="mt-5 block text-sm text-accent">Read the case study →</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <FinalCTA location="case_studies_final_cta" />
      </Section>
    </>
  );
}
