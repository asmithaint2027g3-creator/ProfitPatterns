import { siteConfig } from "@/config/site";

export function pageMeta({
  title,
  description,
  type = "website",
}: {
  title: string;
  description: string;
  type?: "website" | "article";
}) {
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export function canonical(path: string) {
  return [{ rel: "canonical", href: path }];
}

/* ------------------------------ structured data ----------------------------- */

function ld(data: Record<string, unknown>) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function organizationSchema() {
  return ld({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    description: siteConfig.description,
    email: siteConfig.email,
    areaServed: "Worldwide",
    knowsAbout: [
      "AI consulting",
      "AI strategy consulting",
      "business automation",
      "data analytics consulting",
      "process optimization",
      "digital transformation",
      "profit strategy",
    ],
  });
}

export function serviceSchema({
  name,
  description,
}: {
  name: string;
  description: string;
}) {
  return ld({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    provider: { "@type": "Organization", name: siteConfig.name },
  });
}

export function articleSchema({
  headline,
  description,
  datePublished,
}: {
  headline: string;
  description: string;
  datePublished: string;
}) {
  return ld({
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    datePublished,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  });
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return ld({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  });
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return ld({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path,
    })),
  });
}
