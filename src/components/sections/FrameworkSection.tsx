import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/layout/Section";
import { frameworkStages } from "@/content/framework";
import { cn } from "@/lib/utils";

export function FrameworkSection() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Trigger animation loop when section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.2 }
    );

    const el = sectionRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Progressive stage advancement
  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!isInView || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveStageIndex((prev) => (prev + 1) % frameworkStages.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={sectionRef}>
      <SectionHeading
        eyebrow="The ProfitPatterns Framework"
        title="A repeatable path from question to measured outcome"
        description="Every engagement runs through the same five stages. The depth changes; the sequence does not."
      />

      <div className="relative mt-12">
        {/* Horizontal background track line on desktop */}
        <div
          aria-hidden="true"
          className="absolute top-9 left-6 right-6 hidden h-0.5 bg-border lg:block"
        />

        {/* Animated progressive active line */}
        <div
          aria-hidden="true"
          className="absolute top-9 left-6 hidden h-0.5 bg-primary transition-all duration-700 ease-out lg:block"
          style={{
            width: `calc(${(activeStageIndex / (frameworkStages.length - 1)) * 100}% - 3rem)`,
          }}
        />

        <ol className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {frameworkStages.map((stage, index) => {
            const isActive = activeStageIndex === index;
            const isCompleted = activeStageIndex > index;

            return (
              <li
                key={stage.number}
                className="group relative flex flex-col cursor-pointer"
                onClick={() => setActiveStageIndex(index)}
              >
                {/* Step indicator node */}
                <div className="mb-4 flex items-center gap-3">
                  <span
                    className={cn(
                      "relative z-10 flex size-8 items-center justify-center rounded border font-display text-sm font-bold transition-all duration-300",
                      isActive
                        ? "border-primary bg-primary text-white shadow-sm ring-4 ring-primary/15 scale-105"
                        : isCompleted
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-muted-foreground group-hover:border-primary/50",
                    )}
                  >
                    {stage.number}
                  </span>
                  <span
                    className={cn(
                      "font-display text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200",
                      isActive ? "text-primary" : "text-muted-foreground",
                      "lg:hidden"
                    )}
                  >
                    Stage {index + 1}
                  </span>
                </div>

                {/* Stage Card */}
                <div
                  className={cn(
                    "flex h-full flex-col justify-between rounded border p-5 transition-all duration-300",
                    isActive
                      ? "border-primary bg-[#FAF8F5] shadow-md -translate-y-1.5 ring-1 ring-primary/25"
                      : "border-border bg-card shadow-xs hover:-translate-y-1 hover:border-primary/40 hover:shadow-sm"
                  )}
                >
                  <div>
                    <div
                      className={cn(
                        "font-display text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors",
                        isActive ? "text-primary font-bold" : "text-primary/80"
                      )}
                    >
                      {stage.short}
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-foreground">
                      {stage.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                      {stage.description}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-border/70 pt-3.5">
                    <p className="font-display text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Deliverables
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {stage.outputs.map((output) => (
                        <li key={output} className="flex items-start gap-1.5 text-xs text-foreground/85">
                          <span
                            className={cn(
                              "mt-1 size-1 shrink-0 rounded-full transition-colors",
                              isActive ? "bg-primary" : "bg-primary/50"
                            )}
                            aria-hidden="true"
                          />
                          <span>{output}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Playback status indicator */}
        <div className="mt-6 flex justify-end">
          <p className="font-display text-xs text-muted-foreground italic">
            Click any stage to inspect or watch the automated sequence
          </p>
        </div>
      </div>
    </div>
  );
}
