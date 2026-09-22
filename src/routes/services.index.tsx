import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { track } from "@/lib/analytics";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: pageMeta({
      title: "Services — AI strategy, automation and profit consulting",
      description:
        "AI strategy, business automation, data and analytics, process optimization, digital transformation and profit growth strategy — each tied to a measurable business objective.",
    }),
    links: canonical("/services"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Six services. One question: what will actually move the business?"
        description="Every engagement starts from a problem you can name and ends with something you can measure."
      >
        <Button asChild size="lg">
          <Link to="/contact">Request a Strategy Consultation</Link>
        </Button>
        <WhatsAppCTA location="services_hero" size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="glass rounded-2xl p-7">
              <span className="text-[11px] uppercase tracking-[0.18em] text-accent">
                {service.code}
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold">{service.title}</h2>
              <p className="mt-2 text-[15px] text-foreground/85">{service.tagline}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
              <ul className="mt-5 space-y-1.5">
                {service.deliverables.slice(0, 3).map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-foreground/70">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  to="/services/$slug"
                  params={{ slug: service.slug }}
                  onClick={() => track("service_view", { service: service.slug, from: "services" })}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                >
                  Explore {service.title}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
                <WhatsAppCTA
                  location={`services_${service.slug}`}
                  label="Ask about this"
                  size="sm"
                  showIcon={false}
                />
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <FinalCTA location="services_final_cta" />
      </Section>
    </>
  );
}
