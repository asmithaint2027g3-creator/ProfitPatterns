import { Link } from "@tanstack/react-router";
import { ArrowRight, Plus } from "lucide-react";
import { useState } from "react";

import { SectionHeading } from "@/components/layout/Section";
import { problemPatterns } from "@/content/problems";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ProblemDiscovery() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <SectionHeading
        eyebrow="Start with the problem"
        title="Which of these sounds like your business?"
        description="Select the pattern that feels closest. Each one points to what's usually happening underneath, and what can be done about it."
      />

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {problemPatterns.map((pattern) => {
          const isOpen = openId === pattern.id;
          return (
            <article
              key={pattern.id}
              className={cn(
                "group rounded border border-border bg-card p-6 shadow-sm transition-all duration-200",
                isOpen ? "border-primary/50 shadow-md lg:col-span-2" : "hover:border-primary/40",
              )}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`problem-${pattern.id}`}
                onClick={() => {
                  const next = isOpen ? null : pattern.id;
                  setOpenId(next);
                  if (next) track("cta_click", { location: "problem_cards", cta: pattern.id });
                }}
                className="flex w-full items-start justify-between gap-4 text-left cursor-pointer"
              >
                <span>
                  <span className="block font-display text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {pattern.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                    {pattern.teaser}
                  </span>
                </span>
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded border border-border bg-secondary text-primary transition-colors group-hover:border-primary/40">
                  <Plus
                    className={cn(
                      "size-3.5 transition-transform duration-200",
                      isOpen && "rotate-45 text-foreground",
                    )}
                    aria-hidden="true"
                  />
                </span>
              </button>

              {isOpen && (
                <div id={`problem-${pattern.id}`} className="mt-5 space-y-4 border-t border-border pt-5 animate-rise">
                  <div>
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      The Underlying Problem
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                      {pattern.problem}
                    </p>
                  </div>
                  <div>
                    <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      The Practical Opportunity
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
                      {pattern.opportunity}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <Link
                      to="/solutions/$slug"
                      params={{ slug: pattern.serviceSlug }}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline underline-offset-4"
                    >
                      {pattern.serviceTitle}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() =>
                        track("cta_click", { location: "problem_cards", cta: "discuss_this" })
                      }
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline"
                    >
                      Discuss this with us →
                    </Link>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
