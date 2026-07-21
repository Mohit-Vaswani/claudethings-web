import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";

/**
 * SEO helpers for the free-tool pages: one call builds the full Metadata object
 * (canonical, OG, Twitter, dynamic OG image) and one component renders the
 * SoftwareApplication + FAQPage + BreadcrumbList JSON-LD blocks.
 */

const BASE = "https://agentskit.co";

export interface ToolSeoInput {
  /** Route path, e.g. "/claude-code-wrapped". */
  path: string;
  /** <title> — keep the primary keyword up front. */
  title: string;
  /** Meta description. */
  description: string;
  keywords: string[];
  /** Short name used in OG/Twitter cards and breadcrumbs. */
  ogTitle: string;
  ogDescription: string;
  /** Name for the SoftwareApplication schema. */
  appName: string;
  appDescription: string;
  faq: Array<{ question: string; answer: string }>;
}

export function toolMetadata(t: ToolSeoInput): Metadata {
  const url = `${BASE}${t.path}`;
  return {
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: t.path },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      type: "website",
      url,
      images: [{ url: ogImage(t.title), width: 1200, height: 630, alt: t.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.ogTitle,
      description: t.ogDescription,
      images: [ogImage(t.title)],
    },
  };
}

export function ToolJsonLd(t: ToolSeoInput) {
  const url = `${BASE}${t.path}`;

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t.appName,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any (web browser)",
    url,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    description: t.appDescription,
    publisher: { "@type": "Organization", name: "AgentsKit", url: BASE },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AgentsKit", item: BASE },
      { "@type": "ListItem", position: 2, name: "Free Tools", item: `${BASE}/tools` },
      { "@type": "ListItem", position: 3, name: t.appName, item: url },
    ],
  };

  return (
    <>
      {[softwareLd, faqLd, breadcrumbLd].map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
    </>
  );
}
