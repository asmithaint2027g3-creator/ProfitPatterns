import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, faqSchema, pageMeta, serviceSchema } from "@/lib/seo";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — ProfitPatterns`;
    return {
      meta: pageMeta({ title, description: service.summary }),
      links: canonical(`/services/${service.slug}`),
      scripts: [
        serviceSchema({ name: service.title, description: service.summary }),
        faqSchema(service.faqs),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Service not found</h1>
      <p className="mt-3 text-muted-foreground">
        That service doesn't exist.{" "}
        <Link to="/services" className="text-accent hover:underline">
          View all services
        </Link>
        .
      </p>
    </Section>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow={`Service · ${service.code}`} title={service.title} description={service.tagline}>
        <Button asChild size="lg">
          <Link to="/contact">Request a Strategy Consultation</Link>
        </Button>
        <WhatsAppCTA location={`service_${service.slug}_hero`} size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass rounded-2xl p-7">
            <h2 className="font-display text-xl font-semibold">The problem</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{service.problem}</p>
          </div>
          <div className="glass rounded-2xl p-7">
            <h2 className="font-display text-xl font-semibold">The opportunity</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              {service.opportunity}
            </p>
          </div>
        </div>
      </Section>

      <Section className="border-y border-border/60">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Approach" title="How we work through it" />
            <ol className="mt-6 space-y-4">
              {service.approach.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="font-display text-sm font-bold text-accent">
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
                <li key={item} className="rounded-xl border border-border px-4 py-3 text-sm text-foreground/85">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="glass rounded-2xl p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">Expected business objective</p>
          <p className="mt-4 max-w-3xl font-display text-2xl leading-snug">{service.objective}</p>
          <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
            We do not guarantee financial results. Outcomes depend on execution and conditions outside
            any consultant's control; we commit to analysis, recommendations and honest measurement
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
          location={`service_${service.slug}_final_cta`}
          title={`Considering ${service.title.toLowerCase()}?`}
        />
      </Section>
    </>
  );
}
