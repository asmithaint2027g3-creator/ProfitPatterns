import { createFileRoute } from "@tanstack/react-router";

import { PageHero } from "@/components/layout/Section";
import { IdealCustomerProfileSection } from "@/components/sections/IdealCustomerProfileSection";
import { breadcrumbSchema, canonical, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/icp")({
  head: () => ({
    meta: pageMeta({
      title: "Ideal Customer Profile (ICP) | ProfitPatterns — Strategic Qualification Framework",
      description:
        "Understand who ProfitPatterns is built for: growth-stage B2B service firms, agencies, and consultancies seeking predictable profit, operational leverage, and AI architecture.",
    }),
    links: canonical("/icp"),
    scripts: [
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Ideal Customer Profile", path: "/icp" },
      ]),
    ],
  }),
  component: ICPPage,
});

function ICPPage() {
  return (
    <>
      <PageHero
        eyebrow="STRATEGIC QUALIFICATION FRAMEWORK"
        title="Who ProfitPatterns Is Built For."
        description="We partner specifically with founders, CEOs, and senior decision-makers of established service-based businesses, agencies, and consultancies who have achieved real market traction — but are now experiencing plateaus, unpredictable revenue, or operational drag."
      />
      <IdealCustomerProfileSection />
    </>
  );
}
