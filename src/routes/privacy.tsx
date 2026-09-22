import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section } from "@/components/layout/Section";
import { siteConfig } from "@/config/site";
import { canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: pageMeta({
      title: "Privacy Policy — ProfitPatterns",
      description:
        "How ProfitPatterns collects, uses, stores and protects the information you share through our forms, WhatsApp and assistant.",
    }),
    links: canonical("/privacy"),
  }),
  component: Privacy,
});

const sections = [
  {
    heading: "What we collect",
    body: [
      "Information you submit through our forms or assistant: name, work email, phone number, company, role, and the details you choose to share about your business challenge.",
      "Basic usage information such as pages viewed, used to understand which content is useful. This is handled through the analytics tools configured for this site.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "To respond to your enquiry, prepare for a consultation, and maintain a record of our correspondence with you.",
      "We do not sell your information, and we do not share it with third parties for their own marketing.",
    ],
  },
  {
    heading: "How it is stored",
    body: [
      "Submissions are stored in a private database that is not readable from the public website. Access is limited to the people who need it to respond to you.",
      "We keep enquiry records only as long as needed for the purpose above, or as required by law.",
    ],
  },
  {
    heading: "WhatsApp and third-party tools",
    body: [
      "If you contact us via WhatsApp, that conversation is also subject to WhatsApp's own privacy terms.",
      "Analytics tools, where enabled, set their own cookies and are governed by their respective policies.",
    ],
  },
  {
    heading: "Your rights",
    body: [
      "You can ask us what information we hold about you, ask for it to be corrected, or ask us to delete it. Email us and we will action the request.",
    ],
  },
];

function Privacy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Plain-language summary of what we collect, why, and what you can ask us to do about it."
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
            Questions about this policy:{" "}
            <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
              {siteConfig.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
