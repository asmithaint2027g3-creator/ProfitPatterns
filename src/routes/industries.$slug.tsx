import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = industries.find((i) => i.slug === params.slug);
    if (!industry) throw notFound();
    const related = services.filter((s) => industry.relatedSolutions.includes(s.slug));
    return { industry, related };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Industry not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { industry } = loaderData;
    return {
      meta: pageMeta({
        title: `${industry.title} | ProfitPatterns`,
        description: `${industry.intro.slice(0, 155)}`,
      }),
      links: canonical(`/industries/${industry.slug}`),
      scripts: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.title, path: `/industries/${industry.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Industry page not found</h1>
      <p className="mt-3 text-muted-foreground">
        That page doesn&apos;t exist.{" "}
        <Link to="/industries" className="text-accent hover:underline">
          View all industries
        </Link>
        .
      </p>
    </Section>
  ),
  component: IndustryDetail,
});

function IndustryDetail() {
  const { industry, related } = Route.useLoaderData();

  return (
    <>
      <PageHero eyebrow="Industries" title={industry.headline} description={industry.intro}>
        <Button asChild size="lg">
          <Link to="/contact">{industry.cta}</Link>
        </Button>
        <WhatsAppCTA location={`industry_${industry.slug}_hero`} size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Potential Focus Areas" title="Where ProfitPatterns May Create Value" />
            <ul className="mt-6 space-y-3">
              {industry.focus.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
              These represent potential applications of ProfitPatterns capabilities. The appropriate
              focus areas depend on your specific business context and challenges.
            </p>
          </div>

          {related.length > 0 && (
            <div>
              <SectionHeading eyebrow="Relevant Solutions" title="Solutions That May Apply" />
              <div className="mt-6 grid gap-4">
                {related.map((service) => (
                  <Link
                    key={service.slug}
                    to="/solutions/$slug"
                    params={{ slug: service.slug }}
                    className="group flex flex-col justify-between rounded border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                  >
                    <div>
                      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{service.code}</span>
                      <h3 className="mt-1.5 font-display text-base font-bold text-foreground group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{service.tagline}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 border-t border-border pt-3 text-xs font-semibold text-primary">
                      Explore Solution
                      <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </Section>

      <Section>
        <FinalCTA
          location={`industry_${industry.slug}_final_cta`}
          title={`Tell us about your ${industry.title.toLowerCase()} business.`}
        />
      </Section>
    </>
  );
}
