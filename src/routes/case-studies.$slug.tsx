import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { caseStudies } from "@/content/case-studies";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const study = caseStudies.find((s) => s.slug === params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Case study not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { study } = loaderData;
    return {
      meta: pageMeta({
        title: `${study.title} — ProfitPatterns case study`,
        description: study.summary,
        type: "article",
      }),
      links: canonical(`/case-studies/${study.slug}`),
      scripts: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
          { name: study.title, path: `/case-studies/${study.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Case study not found</h1>
      <p className="mt-3 text-muted-foreground">
        <Link to="/case-studies" className="text-accent hover:underline">
          Back to case studies
        </Link>
      </p>
    </Section>
  ),
  component: CaseStudyDetail,
});

function CaseStudyDetail() {
  const { study } = Route.useLoaderData();
  const service = services.find((s) => s.slug === study.serviceSlug);

  return (
    <>
      <PageHero eyebrow={`Case study · ${study.sector}`} title={study.title} description={study.summary}>
        <Button asChild size="lg">
          <Link to="/contact">Discuss a similar problem</Link>
        </Button>
        <WhatsAppCTA location={`case_study_${study.slug}`} size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <Block title="Challenge" body={study.challenge} />
            <Block title="Context" body={study.context} />
            <div>
              <h2 className="font-display text-xl font-semibold">Approach</h2>
              <ul className="mt-3 space-y-2">
                {study.approach.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-relaxed text-muted-foreground">
                    <span className="mt-2.5 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Block title="Solution" body={study.solution} />
            <div>
              <h2 className="font-display text-xl font-semibold">Implementation</h2>
              <ol className="mt-3 space-y-2">
                {study.implementation.map((item, index) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground">
                    <span className="font-display text-sm font-bold text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
            <Block title="Outcome" body={study.outcome} />
          </div>

          <aside className="space-y-4">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Client</h2>
              <p className="mt-2 text-sm text-foreground/85">
                {study.client ?? "Withheld — not approved for publication."}
              </p>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Technology & strategy
              </h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {study.technology.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-border px-3 py-1 text-xs text-foreground/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Metrics</h2>
              <dl className="mt-3 space-y-3">
                {study.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dt className="text-sm text-foreground/85">{metric.label}</dt>
                    <dd className="text-sm text-muted-foreground">
                      {metric.value ?? <span className="text-accent">Awaiting verified figure</span>}
                      <span className="block text-xs">{metric.note}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            {service ? (
              <Link
                to="/services/$slug"
                params={{ slug: service.slug }}
                className="glass block rounded-2xl p-6 transition-colors hover:ring-1 hover:ring-accent/40"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Related service
                </span>
                <span className="mt-2 block font-display text-lg font-semibold">{service.title}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{service.tagline}</span>
              </Link>
            ) : null}
          </aside>
        </div>
      </Section>

      <Section className="border-t border-border/60">
        <SectionHeading eyebrow="Next" title="Other engagements" />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {caseStudies
            .filter((s) => s.slug !== study.slug)
            .map((other) => (
              <Link
                key={other.slug}
                to="/case-studies/$slug"
                params={{ slug: other.slug }}
                className="rounded-2xl border border-border p-6 transition-colors hover:border-accent/50"
              >
                <h3 className="font-display text-lg font-semibold">{other.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{other.summary}</p>
              </Link>
            ))}
        </div>
      </Section>

      <Section>
        <FinalCTA location={`case_study_${study.slug}_final_cta`} />
      </Section>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
