import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";
import { canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
      title: "Privacy Policy — ProfitPatterns",
      description:
        "How ProfitPatterns collects, uses, stores and protects the information you share through our forms, WhatsApp and AI assistant.",
    }),
    links: canonical("/privacy"),
  }),
  component: Privacy,
});

const EFFECTIVE_DATE = "1 October 2024";

const sections = [
  {
    id: "who-we-are",
    heading: "1. Who We Are",
    body: [
      `ProfitPatterns ("we", "us", "our") is a business consulting and AI strategy firm. This Privacy Policy explains how we handle personal information collected through our website (profitpatterns.com), our contact forms, our AI assistant, and any WhatsApp communication you initiate with us.`,
      `For questions about this policy, contact us at ${siteConfig.email}.`,
    ],
  },
  {
    id: "information-we-collect",
    heading: "2. Information We Collect",
    body: [
      "Contact & enquiry data: name, work email address, phone number, company name, job role, and the details you choose to share about your business challenge when submitting a form or chatting with us.",
      "AI assistant interactions: the questions and messages you send through our on-site assistant, used solely to answer your enquiry in real time. We do not use this to build advertising profiles.",
      "Usage analytics: pages viewed, time on page, referral source, and browser/device type — collected through privacy-respecting analytics tools to help us understand which content is useful.",
      "Cookies: we use strictly necessary cookies to make the site function, and optional analytics cookies with your consent. See Section 6 for details.",
    ],
  },
  {
    id: "why-we-collect",
    heading: "3. Why We Collect It (Legal Basis)",
    body: [
      "To respond to your enquiry and prepare for any consultation — legal basis: contract performance / legitimate interest.",
      "To send you relevant follow-up information if you have requested it or would reasonably expect it — legal basis: legitimate interest (you can opt out at any time).",
      "To improve our website and services — legal basis: legitimate interest, using aggregated and anonymised data only.",
      "We do NOT sell your personal information. We do NOT share it with third parties for their own marketing purposes.",
    ],
  },
  {
    id: "how-stored",
    heading: "4. How Your Data Is Stored & Protected",
    body: [
      "Form submissions are stored in a private, access-controlled database not readable from the public website. Access is restricted to team members who need it to respond to your enquiry.",
      "Data is transmitted over encrypted HTTPS connections. Storage services we use implement industry-standard encryption at rest.",
      "We retain enquiry records for as long as required to fulfil the purpose stated above — typically no more than 3 years — or as required by applicable law, after which they are securely deleted.",
    ],
  },
  {
    id: "third-parties",
    heading: "5. Third-Party Services",
    body: [
      "We may use third-party tools to operate our website and communication channels. Each third party processes data under its own privacy policy.",
      "WhatsApp: if you contact us via WhatsApp (operated by Meta Platforms, Inc.), that conversation is also subject to WhatsApp's Privacy Policy.",
      "Google Analytics / similar: if enabled, these services use cookies and collect anonymised usage data. You can opt out via your browser's cookie settings or a browser extension such as the Google Analytics Opt-out Add-on.",
      "We do not embed social-media tracking pixels without disclosure.",
    ],
  },
  {
    id: "cookies",
    heading: "6. Cookies",
    body: [
      "Strictly necessary cookies: required for the site to function (e.g. session management, security). These cannot be disabled.",
      "Analytics cookies: help us understand how visitors interact with the site. These are only placed with your consent where required by law.",
      "You can manage cookie preferences through your browser settings at any time. Disabling analytics cookies will not affect your ability to use the site.",
    ],
  },
  {
    id: "your-rights",
    heading: "7. Your Rights",
    body: [
      "Depending on your location, you may have the right to: access the personal data we hold about you; ask for inaccurate data to be corrected; request deletion of your data (the 'right to be forgotten'); object to or restrict certain processing; and receive a portable copy of your data.",
      `To exercise any of these rights, email us at ${siteConfig.email}. We will respond within 30 days. We may need to verify your identity before processing the request.`,
      "If you believe we have not handled your data correctly, you have the right to lodge a complaint with the relevant data protection authority in your jurisdiction.",
    ],
  },
  {
    id: "changes",
    heading: "8. Changes to This Policy",
    body: [
      `This policy was last updated on ${EFFECTIVE_DATE}. We may update it from time to time. Material changes will be noted at the top of this page with a new effective date. Continued use of the website after any update constitutes acceptance of the revised policy.`,
    ],
  },
];

function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Plain-language summary of how we collect, use and protect your information. Effective ${EFFECTIVE_DATE}.`}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Quick-navigation TOC */}
          <nav
            aria-label="Privacy policy sections"
            className="mb-12 rounded-xl border border-border bg-secondary/50 p-5"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Contents
            </p>
            <ol className="space-y-1 text-sm text-muted-foreground">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {s.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Policy sections */}
          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.id} id={section.id}>
                <h2 className="font-display text-xl font-semibold tracking-tight">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((paragraph, i) => (
                    <p
                      key={i}
                      className="text-[15px] leading-relaxed text-muted-foreground"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Contact callout */}
          <div className="mt-14 rounded-xl border border-border bg-secondary/60 p-6">
            <p className="text-sm font-semibold text-foreground">
              Privacy questions or data requests
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Email us at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {siteConfig.email}
              </a>{" "}
              — we aim to respond within 2 business days.
            </p>
          </div>

          {/* Link to Terms */}
          <p className="mt-8 text-sm text-muted-foreground">
            Also see our{" "}
            <Link to="/terms" className="text-primary hover:underline underline-offset-4">
              Terms of Use
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
