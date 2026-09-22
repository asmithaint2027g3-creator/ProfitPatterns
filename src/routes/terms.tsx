import { createFileRoute } from "@tanstack/react-router";

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

const sections = [
  {
    heading: "Use of this website",
    body: [
      "You may use this website for lawful purposes and to enquire about our services. You may not attempt to disrupt it, submit automated or misleading enquiries, or misuse the contact channels provided.",
    ],
  },
  {
    heading: "Content is general, not advice",
    body: [
      "Articles, frameworks and case studies published here are general information. They are not consulting advice for your specific situation and should not be relied upon as such.",
      "Case studies are anonymised. Where a figure has not been verified and approved for publication, it is marked as unavailable rather than estimated.",
    ],
  },
  {
    heading: "No guaranteed outcomes",
    body: [
      "We do not promise specific revenue, savings or performance results. Outcomes depend on execution, market conditions and factors outside any consultant's control.",
    ],
  },
  {
    heading: "Engagements",
    body: [
      "Any engagement is governed by a separate written agreement covering scope, deliverables, timeline, price and confidentiality. Nothing on this website constitutes an offer or a contract.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "Content on this website belongs to ProfitPatterns unless stated otherwise. You may share and quote it with attribution; you may not republish it as your own.",
    ],
  },
];

function Terms() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Use"
        description="The basis on which this website and its content are provided."
      />
      <Section>
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-display text-2xl font-semibold tracking-tight">{section.heading}</h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-[15px] leading-relaxed text-muted-foreground">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
          <p className="text-[15px] text-muted-foreground">
            Questions:{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
