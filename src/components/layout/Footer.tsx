import { Link } from "@tanstack/react-router";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { siteConfig } from "@/config/site";
import { industries } from "@/content/industries";
import { services } from "@/content/services";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-[#F5F2EB]/60">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <img
                src="/favicon.png"
                alt="ProfitPatterns"
                width={28}
                height={28}
                className="size-7 rounded-md border border-primary/40 object-cover shadow-xs"
              />
              <span className="font-display font-semibold tracking-tight text-foreground text-lg">
                Profit<span className="text-primary font-normal">Patterns</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              ProfitPatterns helps businesses turn AI, automation, data and strategic improvement into
              practical business opportunities and measurable profit advantages.
            </p>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-primary underline-offset-4 hover:underline">
                  {siteConfig.email}
                </a>
              </p>
            </div>
            <WhatsAppCTA location="footer" size="sm" className="mt-5" />
          </div>

          {/* Company column */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Company
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="transition-colors hover:text-foreground">About</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-foreground">Our Approach</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-foreground">Why ProfitPatterns</Link></li>
              <li><Link to="/how-it-works" className="transition-colors hover:text-foreground">How We Work</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-foreground">FAQ</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          {/* Solutions column */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Solutions
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    to="/solutions/$slug"
                    params={{ slug: service.slug }}
                    className="transition-colors hover:text-foreground line-clamp-1"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries & Resources column */}
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Industries
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {industries.slice(0, 4).map((industry) => (
                <li key={industry.slug}>
                  <Link
                    to="/industries/$slug"
                    params={{ slug: industry.slug }}
                    className="transition-colors hover:text-foreground line-clamp-1"
                  >
                    {industry.title}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 font-display text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Resources
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/insights" className="transition-colors hover:text-foreground">Insights</Link></li>
              <li><Link to="/resources" className="transition-colors hover:text-foreground">All Resources</Link></li>
              <li><Link to="/audit-submission" className="font-semibold text-primary transition-colors hover:underline">Submit Process for Audit</Link></li>
              <li><Link to="/resources/ai-opportunity-assessment" className="transition-colors hover:text-foreground">AI Assessment</Link></li>
              <li><Link to="/resources/ai-readiness-checklist" className="transition-colors hover:text-foreground">AI Readiness</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom legal bar — bold & clearly visible ── */}
      <div className="bg-gradient-to-r from-[#0F0F0F] via-[#1A1710] to-[#0F0F0F] border-t border-[#C4B296]/20">
        <div className="mx-auto max-w-7xl px-5 py-4 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">

            {/* Copyright */}
            <p className="text-[11px] font-medium text-[#888880] tracking-wide whitespace-nowrap">
              © {new Date().getFullYear()}{" "}
              <span className="text-[#C4B296] font-semibold">ProfitPatterns</span>.
              {" "}All rights reserved.
            </p>

            {/* Legal links — bright & prominent */}
            <nav aria-label="Legal links" className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2">
              {/* Privacy Policy — amber pill */}
              <Link
                to="/privacy"
                className="inline-flex items-center gap-1 rounded-full bg-[#C4B296]/15 border border-[#C4B296]/40 px-3 py-1 text-[11px] font-semibold text-[#E8D9C0] transition-all hover:bg-[#C4B296]/30 hover:border-[#C4B296]/70 hover:text-white"
              >
                🔒 Privacy Policy
              </Link>

              <span className="text-[#444] text-xs select-none">·</span>

              {/* Terms of Use — amber pill */}
              <Link
                to="/terms"
                className="inline-flex items-center gap-1 rounded-full bg-[#C4B296]/15 border border-[#C4B296]/40 px-3 py-1 text-[11px] font-semibold text-[#E8D9C0] transition-all hover:bg-[#C4B296]/30 hover:border-[#C4B296]/70 hover:text-white"
              >
                📄 Terms of Use
              </Link>

              <span className="text-[#444] text-xs select-none">·</span>

              {/* FAQ — plain bright */}
              <Link
                to="/faq"
                className="text-[11px] font-medium text-[#999] transition-colors hover:text-white px-2 py-1"
              >
                FAQ
              </Link>

              <span className="text-[#444] text-xs select-none">·</span>

              {/* Contact — plain bright */}
              <Link
                to="/contact"
                className="text-[11px] font-medium text-[#999] transition-colors hover:text-white px-2 py-1"
              >
                Contact
              </Link>
            </nav>

          </div>
        </div>
      </div>
    </footer>
  );
}
