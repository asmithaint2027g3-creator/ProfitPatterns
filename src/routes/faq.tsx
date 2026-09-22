import { createFileRoute } from "@tanstack/react-router";

import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero, Section } from "@/components/layout/Section";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { faqs } from "@/content/faqs";
import { breadcrumbSchema, canonical, faqSchema, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: pageMeta({
      title: "FAQ | ProfitPatterns — Common Questions Answered",
      description:
        "Answers to common questions about what ProfitPatterns does, how engagements work, pricing, timelines, AI consulting and how to get started.",
    }),
    links: canonical("/faq"),
    scripts: [
      faqSchema(faqs),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "FAQ", path: "/faq" },
      ]),
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const topics = Array.from(new Set(faqs.map((f) => f.topic)));

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Common Questions, Answered."
        description="If something isn't covered here, use the assistant in the corner of your screen or send a quick message — we will answer directly."
      />

      <Section>
        <div className="space-y-12">
          {topics.map((topic) => (
            <div key={topic}>
              <h2 className="font-display text-xl font-semibold tracking-tight">{topic}</h2>
              <FaqAccordion items={faqs.filter((f) => f.topic === topic)} className="mt-5" />
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <FinalCTA location="faq_final_cta" />
      </Section>
    </>
  );
}
