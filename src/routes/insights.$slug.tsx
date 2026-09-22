import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { insights } from "@/content/insights";
import { articleSchema, breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const insight = insights.find((i) => i.slug === params.slug);
    if (!insight) throw notFound();
    const related = insights
      .filter((i) => i.slug !== insight.slug && i.category === insight.category)
      .slice(0, 3);
    return {
      insight,
      related: related.length > 0 ? related : insights.filter((i) => i.slug !== insight.slug).slice(0, 3),
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article not found — ProfitPatterns" }, { name: "robots", content: "noindex" }],
      };
    }
    const { insight } = loaderData;
    return {
      meta: pageMeta({
        title: `${insight.title} — ProfitPatterns Insights`,
        description: insight.excerpt,
        type: "article",
      }),
      links: canonical(`/insights/${insight.slug}`),
      scripts: [
        articleSchema({
          headline: insight.title,
          description: insight.excerpt,
          datePublished: insight.publishedAt,
        }),
        breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: insight.title, path: `/insights/${insight.slug}` },
        ]),
      ],
    };
  },
  notFoundComponent: () => (
    <Section>
      <h1 className="font-display text-3xl font-bold">Article not found</h1>
      <p className="mt-3 text-muted-foreground">
        <Link to="/insights" className="text-accent hover:underline">
          Back to insights
        </Link>
      </p>
    </Section>
  ),
  component: InsightDetail,
});

function InsightDetail() {
  const { insight, related } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow={insight.category}
        title={insight.title}
        description={insight.excerpt}
      />

      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="text-xs text-muted-foreground">
            {new Date(insight.publishedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · {insight.readingMinutes} min read
          </p>
          <div className="mt-8 space-y-10">
            {insight.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold tracking-tight">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-[16px] leading-[1.75] text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </Section>

      {related.length > 0 ? (
        <Section className="border-t border-border/60">
          <SectionHeading eyebrow="Related" title="Keep reading" />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                to="/insights/$slug"
                params={{ slug: item.slug }}
                className="rounded-2xl border border-border p-6 transition-colors hover:border-accent/50"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] text-accent">
                  {item.category}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug">{item.title}</h3>
              </Link>
            ))}
          </div>
        </Section>
      ) : null}

      <Section>
        <FinalCTA location="insight_final_cta" />
      </Section>
    </>
  );
}
