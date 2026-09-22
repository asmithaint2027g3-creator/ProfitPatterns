import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Solution not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} | ProfitPatterns`;
    return {
      meta: pageMeta({ title, description: service.summary }),
      links: canonical(`/solutions/${service.slug}`),
      scripts: [
        serviceSchema({ name: service.title, description: service.summary }),
        faqSchema(service.faqs),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/solutions" },
          { name: service.title, path: `/solutions/${service.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Solution not found</h1>
      <p className="mt-3 text-muted-foreground">
        That solution doesn&apos;t exist.{" "}
        <Link to="/solutions" className="text-accent hover:underline">
          View all solutions
        </Link>
        .
      </p>
    </Section>
  ),
  component: SolutionDetail,
});

function SolutionDetail() {
  const { service } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow={`Solution · ${service.code}`} title={service.title} description={service.tagline}>
        <Button asChild size="lg">
          <Link to="/contact">Talk to an Expert</Link>
        </Button>
        <WhatsAppCTA location={`solution_${service.slug}_hero`} size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded border border-border bg-card p-7 shadow-sm">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">The problem</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{service.problem}</p>
          </div>
          <div className="rounded border border-border bg-card p-7 shadow-sm">
            <h2 className="font-display text-xl font-bold tracking-tight text-foreground">The opportunity</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{service.opportunity}</p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-[#FBF9F5]">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Approach" title="How we work through it" />
            <ol className="mt-6 space-y-4">
              {service.approach.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="font-display text-sm font-bold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">{item}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow="Deliverables" title="What you receive" />
            <ul className="mt-6 grid gap-3">
              {service.deliverables.map((item) => (
                <li key={item} className="rounded border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="rounded border border-border bg-card p-8 shadow-sm">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">Expected business objective</p>
          <p className="mt-4 max-w-3xl font-display text-2xl font-bold leading-snug text-foreground">{service.objective}</p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            We do not guarantee financial results. Outcomes depend on execution and conditions outside
            any consultant&apos;s control. We commit to analysis, recommendations and honest measurement
            against an agreed baseline.
          </p>
        </div>
      </Section>

      <Section className="border-y border-border/60">
        <SectionHeading eyebrow="FAQ" title={`${service.title} questions`} />
        <FaqAccordion items={service.faqs} className="mt-8" />
      </Section>

      <Section>
        <FinalCTA
          location={`solution_${service.slug}_final_cta`}
          title={`Considering ${service.title.toLowerCase()}?`}
        />
      </Section>
    </>
  );
}
