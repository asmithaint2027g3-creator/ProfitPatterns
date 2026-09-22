import { createFileRoute } from "@tanstack/react-router";
import { Mail, MessageCircle, MessagesSquare } from "lucide-react";

import { WhatsAppCTA } from "@/components/cta/WhatsAppCTA";
import { LongForm } from "@/components/forms/LongForm";
import { QuickForm } from "@/components/forms/QuickForm";
import { PageHero, Section, SectionHeading } from "@/components/layout/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/config/site";
import { breadcrumbSchema, canonical, organizationSchema, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact ProfitPatterns | Talk to an Expert",
      description:
        "Have a business challenge, an idea for AI or a process you believe could work better? Tell us what you are working on. Quick enquiry, strategy consultation, WhatsApp or chatbot — all reach the same team.",
    }),
    links: canonical("/contact"),
    scripts: [
      organizationSchema(),
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk About Your Business."
        description="Have a business challenge, an idea for AI or a process you believe could work better? Tell us what you are working on. Choose whichever way is easiest — all routes reach the same team."
      />

      {/* Contact option cards */}
      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          <ScrollReveal delay={0} direction="up">
            <div className="h-full rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
              <MessageCircle className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-base font-bold text-foreground">Chat on WhatsApp</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fastest route for a quick question or to arrange a call.
              </p>
              <WhatsAppCTA location="contact_page" variant="accent" size="sm" className="mt-4" />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} direction="up">
            <div className="h-full rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
              <Mail className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-base font-bold text-foreground">Email</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  {siteConfig.email}
                </a>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{siteConfig.responseTime}</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200} direction="up">
            <div className="h-full rounded border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
              <MessagesSquare className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-display text-base font-bold text-foreground">ProfitPatterns Assistant</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Open the assistant using the button in the bottom-right corner. It helps you find the
                right solution and can pass your details to us.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{siteConfig.locationNote}</p>
            </div>
          </ScrollReveal>
        </div>
      </Section>

      {/* Forms */}
      <Section className="border-y border-border bg-[#FBF9F5]">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ScrollReveal delay={0} direction="left">
            <div>
              <SectionHeading
                eyebrow="Quick Enquiry"
                title="Have a Quick Question?"
                description="Tell us a little about what you need and our team can understand your requirement."
              />
              <div className="mt-8 rounded border border-border bg-card p-6 shadow-sm">
                <QuickForm source="contact_page" />
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100} direction="right">
            <div>
              <SectionHeading
                eyebrow="Strategy Consultation"
                title="Request a Strategy Consultation."
                description="Give us more context about your business and challenge so we can understand your requirement before the conversation begins."
              />
              <div className="mt-8 rounded border border-border bg-card p-6 shadow-sm">
                <LongForm source="contact_page" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </>
  );
}
