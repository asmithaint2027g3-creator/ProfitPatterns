import { ShieldCheck } from "lucide-react";

import { SectionHeading } from "@/components/layout/Section";
import {
  certifications,
  clientLogos,
  technologyPartners,
  testimonials,
  workingPrinciples,
} from "@/content/trust";

/**
 * Trust section. Testimonials, logos, certifications and partners render only
 * when real, verified entries exist in src/content/trust.ts — nothing is invented.
 */
export function TrustSection() {
  return (
    <div>
      <SectionHeading
        eyebrow="How we work"
        title="Trust built on commitments, not claims"
        description="We publish how we operate rather than borrowed credibility. Client evidence appears here only once it is verified and approved."
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {workingPrinciples.map((principle) => (
          <div key={principle.title} className="glass rounded-2xl p-6">
            <ShieldCheck className="size-5 text-accent" aria-hidden="true" />
            <h3 className="mt-4 font-display text-base font-semibold">{principle.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
          </div>
        ))}
      </div>

      {testimonials.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <figure key={t.quote} className="glass rounded-2xl p-6">
              <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">
                {t.author} · {t.role}, {t.company}
              </figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {clientLogos.length > 0 ? (
        <ul className="mt-10 flex flex-wrap items-center gap-8">
          {clientLogos.map((logo) => (
            <li key={logo.name}>
              <img src={logo.src} alt={`${logo.name} logo`} loading="lazy" className="h-7 w-auto" />
            </li>
          ))}
        </ul>
      ) : null}

      {certifications.length > 0 || technologyPartners.length > 0 ? (
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {certifications.length > 0 ? (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">Certifications</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {certifications.map((c) => (
                  <li key={c.label}>
                    {c.label} — {c.issuer}
                    {c.year ? ` (${c.year})` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {technologyPartners.length > 0 ? (
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display text-base font-semibold">Technology partners</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {technologyPartners.map((p) => (
                  <li key={p.name}>
                    {p.name} — {p.note}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
