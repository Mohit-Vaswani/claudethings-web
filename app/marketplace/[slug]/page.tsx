import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { MARKETPLACE, getMarketplaceItem } from "../marketplaceData";
import { BODIES } from "../content";
import { SITE_URL } from "@/app/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return MARKETPLACE.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const m = getMarketplaceItem(slug);
  if (!m) return {};
  const path = `/marketplace/${m.slug}`;
  return {
    title: m.seoTitle,
    description: m.metaDescription,
    keywords: m.keywords,
    alternates: { canonical: path },
    openGraph: {
      title: m.seoTitle,
      description: m.metaDescription,
      type: "article",
      url: `${SITE_URL}${path}`,
      images: [{ url: ogImage(m.seoTitle), width: 1200, height: 630, alt: m.seoTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.seoTitle,
      description: m.metaDescription,
      images: [ogImage(m.seoTitle)],
    },
  };
}

export default async function MarketplaceItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const m = getMarketplaceItem(slug);
  const Body = BODIES[slug];
  if (!m || !Body) notFound();

  const url = `${SITE_URL}/marketplace/${m.slug}`;

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: m.name,
    description: m.metaDescription,
    url,
    sameAs: m.repo,
    applicationCategory: "DeveloperApplication",
    operatingSystem: m.worksWith,
    license: m.licenseUrl ?? `https://opensource.org/licenses/${m.license}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Marketplace", item: `${SITE_URL}/marketplace` },
      { "@type": "ListItem", position: 3, name: m.name, item: url },
    ],
  };

  // Cross-link the other listings so every detail page passes link equity to
  // its siblings, then point back at the hub.
  const related = [
    ...MARKETPLACE.filter((o) => o.slug !== m.slug).map((o) => ({
      href: `/marketplace/${o.slug}`,
      title: o.name,
      desc: o.tagline,
    })),
    {
      href: "/marketplace",
      title: "Browse the marketplace",
      desc: "Every free skill and plugin we've reviewed, in one place.",
    },
  ];

  return (
    <ArticlePage
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Marketplace", href: "/marketplace" },
        { label: m.name },
      ]}
      eyebrow={`Free ${m.kind.toLowerCase()} · ${m.category}`}
      title={m.seoTitle}
      meta={[`Works with ${m.worksWith}`, `${m.license} license`, "Free & open source"]}
      jsonLd={[softwareLd, breadcrumbLd]}
      related={related}
      relatedHeading="More free skills and plugins"
    >
      <Body />

      <h2>Get {m.name} on GitHub</h2>
      <p>
        {m.name} is free and open source. The code, install steps and docs all live in the
        repository: <a href={m.repo} target="_blank" rel="noopener">{m.repoName}</a>.
      </p>
      <p>
        <a
          className="btn btn-primary btn-lg"
          href={m.repo}
          target="_blank"
          rel="noopener"
          data-fast-goal="marketplace_github_click"
          data-fast-goal-item={m.slug}
        >
          View {m.name} on GitHub →
        </a>
      </p>
      <p style={{ fontSize: 13, color: "var(--bone-faint)" }}>
        Listed by AgentsKit. We don't maintain this project and aren't affiliated with its
        author. Read the code before you run anything that touches your machine or your inbox.
      </p>
    </ArticlePage>
  );
}
