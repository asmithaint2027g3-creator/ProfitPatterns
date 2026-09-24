import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={cn("relative mx-auto max-w-7xl px-5 py-10 sm:py-14 lg:py-16", className)}>
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-2.5 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3.5 text-base leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-border bg-background overflow-hidden">
      {/* Subtle decorative corner accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/5"
      />
      <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-24">
        <p
          style={{ animationDelay: "0ms" }}
          className="animate-rise font-display text-xs font-semibold uppercase tracking-[0.22em] text-primary"
        >
          {eyebrow}
        </p>
        <h1
          style={{ animationDelay: "100ms" }}
          className="animate-rise mt-3.5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        >
          {title}
        </h1>
        <p
          style={{ animationDelay: "200ms" }}
          className="animate-rise mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          {description}
        </p>
        {children ? (
          <div
            style={{ animationDelay: "300ms" }}
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
          >
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
