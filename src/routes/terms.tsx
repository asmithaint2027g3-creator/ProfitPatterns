import { createFileRoute, Link } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";
import { canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: pageMeta({
      title: "Terms of Use — ProfitPatterns",
      description:
        "The terms that apply to using the ProfitPatterns website, including the status of content published here and the basis of any engagement.",
    }),
    links: canonical("/terms"),
  }),
  component: Terms,
});

const EFFECTIVE_DATE = "1 October 2024";

const sections = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    body: [
      `By accessing or using this website (profitpatterns.com), you agree to be bound by these Terms of Use. If you do not agree, please do not use the site. These terms were last updated on ${EFFECTIVE_DATE}.`,
      "ProfitPatterns reserves the right to update these terms at any time. We will note material changes with a new effective date at the top of this page. Continued use of the website after any change constitutes acceptance.",
    ],
  },
  {
    id: "permitted-use",
    heading: "2. Permitted Use",
    body: [
      "You may use this website for lawful purposes only — for example, to learn about our services, read our content, submit an enquiry, or contact us.",
      "You must not: attempt to gain unauthorised access to our systems; submit false, misleading or automated enquiries; use any scraping or data-mining tool without our written consent; or use the website in any way that could damage our reputation or disrupt the experience of other users.",
    ],
  },
  {
    id: "content-disclaimer",
    heading: "3. Content Is General Information, Not Professional Advice",
    body: [
      "Articles, frameworks, guides, case studies and other content published on this website are provided for general informational purposes only. They are not tailored consulting advice for your specific business situation and should not be relied upon as such.",
      "No content on this website creates a professional–client relationship between you and ProfitPatterns. Always seek qualified professional advice before making significant business, financial or technology decisions.",
      "Case studies and examples are illustrative. Where figures have not been independently verified and approved for publication, they are either omitted or labelled as approximate.",
    ],
  },
  {
    id: "no-guarantees",
    heading: "4. No Guarantees of Outcome",
    body: [
      "ProfitPatterns does not warrant or guarantee specific revenue gains, cost savings, efficiency improvements or any other business results from using our services or implementing the ideas described on this website.",
      "Outcomes depend on many factors outside our control, including your team's execution, market conditions, existing technology infrastructure, and decisions made by your organisation.",
    ],
  },
  {
    id: "engagements",
    heading: "5. Paid Engagements",
    body: [
      "Any paid consulting, advisory or implementation engagement is governed exclusively by a separate written agreement signed by both parties. That agreement will define scope, deliverables, timeline, fees, confidentiality and all other material terms.",
      "Nothing on this website constitutes an offer, binding commitment or contract to provide services. A contract is formed only upon execution of a written engagement agreement.",
    ],
  },
  {
    id: "intellectual-property",
    heading: "6. Intellectual Property",
    body: [
      "All content on this website — including text, graphics, frameworks, diagrams, video and brand assets — is owned by or licensed to ProfitPatterns and is protected by applicable intellectual-property law.",
      "You may share individual articles or excerpts with proper attribution (credit ProfitPatterns and link to the original page). You may not: republish, reproduce or repackage our content as your own; use our name or logo without prior written consent; or incorporate our frameworks into commercial products without a licence.",
    ],
  },
  {
    id: "third-party-links",
    heading: "7. Third-Party Links",
    body: [
      "This website may contain links to third-party websites or tools for your convenience. We do not control those sites and are not responsible for their content, privacy practices or availability.",
      "A link to a third-party website does not imply our endorsement or recommendation of that site or its content.",
    ],
  },
  {
    id: "limitation-of-liability",
    heading: "8. Limitation of Liability",
    body: [
      "To the fullest extent permitted by law, ProfitPatterns and its team members shall not be liable for any indirect, incidental, special or consequential loss or damage arising from your use of, or inability to use, this website or its content.",
      "Our total liability to you for any claim arising in connection with this website shall not exceed the amount you have paid us in the three months preceding the claim, or £100 (whichever is greater).",
    ],
  },
  {
    id: "governing-law",
    heading: "9. Governing Law",
    body: [
      "These terms are governed by the laws of the jurisdiction in which ProfitPatterns is registered. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of that jurisdiction.",
    ],
  },
  {
    id: "contact",
    heading: "10. Contact",
    body: [
      `If you have any questions about these Terms of Use, please contact us at ${siteConfig.email}.`,
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description={`The basis on which this website and its content are provided. Effective ${EFFECTIVE_DATE}.`}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          {/* Quick-navigation TOC */}
          <nav
            aria-label="Terms of use sections"
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

          {/* Terms sections */}
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
              Questions about these terms?
            </p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Email us at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-primary hover:underline underline-offset-4"
              >
                {siteConfig.email}
              </a>
              .
            </p>
          </div>

          {/* Link to Privacy Policy */}
          <p className="mt-8 text-sm text-muted-foreground">
            Also see our{" "}
            <Link to="/privacy" className="text-primary hover:underline underline-offset-4">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </Section>
    </>
  );
}
