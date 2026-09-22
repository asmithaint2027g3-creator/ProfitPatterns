import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Button } from "@/components/ui/button";
import { resources } from "@/content/resources";
import { services } from "@/content/services";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const resource = resources.find((r) => r.slug === params.slug);
    if (!resource) throw notFound();
    const relatedService = resource.relatedSolution
      ? services.find((s) => s.slug === resource.relatedSolution)
      : undefined;
    return { resource, relatedService };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Resource not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { resource } = loaderData;
    return {
      meta: pageMeta({
        title: `${resource.title} | ProfitPatterns`,
        description: resource.description,
      }),
      links: canonical(`/resources/${resource.slug}`),
      scripts: [
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: resource.title, path: `/resources/${resource.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Resource not found</h1>
      <p className="mt-3 text-muted-foreground">
        That resource doesn&apos;t exist.{" "}
        <Link to="/resources" className="text-accent hover:underline">
          View all resources
        </Link>
        .
      </p>
    </Section>
  ),
  component: ResourceDetail,
});

function ResourceDetail() {
  const { resource, relatedService } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Resource"
        title={resource.title}
        description={resource.description}
      >
        <Button asChild size="lg">
          <Link to="/contact">{resource.cta}</Link>
        </Button>
        <WhatsAppCTA location={`resource_${resource.slug}_hero`} size="lg" />
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_0.4fr]">
          <div>
            <div className="rounded border border-border bg-card p-8 shadow-sm">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">About This Resource</p>
              <p className="mt-4 text-[15px] leading-relaxed text-foreground/85">{resource.intro}</p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link to="/contact">{resource.cta}</Link>
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded border border-border bg-[#FBF9F5] p-6">
              <p className="text-sm font-medium text-muted-foreground">
                These frameworks are designed as starting points for structured thinking. The most useful
                next step is often a conversation about how they apply to your specific business context.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {relatedService && (
              <div>
                <SectionHeading eyebrow="Related Solution" title="Take the Next Step" />
                <Link
                  to="/solutions/$slug"
                  params={{ slug: relatedService.slug }}
                  className="mt-5 block rounded border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
                >
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{relatedService.code}</span>
                  <h3 className="mt-2 font-display text-base font-bold text-foreground">{relatedService.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{relatedService.tagline}</p>
                </Link>
              </div>
            )}

            <div>
              <SectionHeading eyebrow="Get Started" title="Talk to an Expert" />
              <div className="mt-5 rounded border border-border bg-card p-5 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  Have a question about how this applies to your business? Start a conversation.
                </p>
                <div className="mt-4 space-y-2">
                  <Button asChild className="w-full">
                    <Link to="/contact">Talk to an Expert</Link>
                  </Button>
                  <WhatsAppCTA location={`resource_${resource.slug}_sidebar`} className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <FinalCTA location={`resource_${resource.slug}_final_cta`} />
      </Section>
    </>
  );
}
