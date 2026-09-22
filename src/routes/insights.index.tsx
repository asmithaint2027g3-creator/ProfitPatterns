import { Link, createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { insightCategories, insights } from "@/content/insights";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: pageMeta({
      title: "AI, Automation & Business Strategy Insights | ProfitPatterns",
      description:
        "Practical perspectives on AI strategy, business automation, data analytics, process optimization, digital transformation, profit growth and AI trends.",
    }),
    links: canonical("/insights"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Insights", path: "/insights" },
      ]),
    ],
  }),
  component: InsightsIndex,
});

function InsightsIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return insights.filter((insight) => {
      const matchesCategory = category === "All" || insight.category === category;
      const matchesQuery =
        q.length === 0 ||
        insight.title.toLowerCase().includes(q) ||
        insight.excerpt.toLowerCase().includes(q) ||
        insight.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Practical Thinking on AI, Automation and Business Strategy."
        description="Educational articles for business leaders evaluating where technology can make a meaningful difference. Written to inform, not to sell."
      />

      <Section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <label htmlFor="insight-search" className="sr-only">
              Search insights
            </label>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="insight-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles"
              className="w-full rounded-full border border-border bg-background/60 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground/70 focus:border-accent focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {["All", ...insightCategories].map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={cn(
                  "rounded border px-3 py-1 text-xs font-semibold tracking-wide transition-colors cursor-pointer",
                  category === item
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-12 rounded border border-border bg-card p-10 text-center text-muted-foreground">
            No articles match that search yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((insight) => (
              <Link
                key={insight.slug}
                to="/insights/$slug"
                params={{ slug: insight.slug }}
                className="group flex flex-col justify-between rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                    {insight.category}
                  </span>
                  <h2 className="mt-2.5 font-display text-lg font-bold leading-snug text-foreground group-hover:text-primary transition-colors">{insight.title}</h2>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {insight.excerpt}
                  </p>
                </div>
                <div className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
                  {new Date(insight.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {insight.readingMinutes} min read
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section>
        <FinalCTA location="insights_final_cta" />
      </Section>
    </>
  );
}
