import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "../../components/SiteShell";
import PromptCard from "../../components/PromptCard";
import { COLLECTIONS, getCollection } from "../promptsData";

export const dynamicParams = false;

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  const url = `https://claudethings.com/prompts/${c.slug}`;
  return {
    title: c.metaTitle,
    description: c.description,
    alternates: { canonical: `/prompts/${c.slug}` },
    openGraph: {
      title: c.title,
      description: c.description,
      type: "article",
      url,
      images: [{ url: "/og.jpg", width: 1200, height: 630, alt: c.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: c.title,
      description: c.description,
      images: ["/og.jpg"],
    },
  };
}

export default async function PromptCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();

  const others = COLLECTIONS.filter((o) => o.slug !== c.slug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://claudethings.com/" },
      { "@type": "ListItem", position: 2, name: "Prompts", item: "https://claudethings.com/prompts" },
      { "@type": "ListItem", position: 3, name: c.label, item: `https://claudethings.com/prompts/${c.slug}` },
    ],
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <main className="legal-main">
        <div className="wrap">
          <article className="legal-doc">
            <div className="crumbs">
              <a href="/">Home</a> <span className="sep">/</span> <a href="/prompts">Prompts</a>{" "}
              <span className="sep">/</span> <span>{c.label}</span>
            </div>
            <div className="eyebrow">
              <span className="pulse"></span> {c.label} prompts
            </div>
            <h1>{c.title}</h1>
            <div className="meta-row">
              <span>
                Updated <b>July 2026</b>
              </span>
              <span>
                <b>{c.prompts.length}</b> prompts
              </span>
              <span>
                Free to copy — <b>no signup</b>
              </span>
            </div>

            {c.intro.map((p, i) => (
              <p className="intro" key={i}>
                {p}
              </p>
            ))}

            <h2>How to use these prompts</h2>
            <ul>
              {c.howToUse.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>

            <h2>The prompts</h2>
            {c.prompts.map((p, i) => (
              <div key={i}>
                <h3>
                  {i + 1}. {p.title}
                </h3>
                <PromptCard title={`prompt ${String(i + 1).padStart(2, "0")} — ${p.title}`} prompt={p.prompt} note={p.note} />
              </div>
            ))}

            <h2>Getting more out of every prompt</h2>
            {c.tips.map((t, i) => (
              <div key={i}>
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </div>
            ))}

            <div className="callout">
              <p>
                <strong>Want this expertise installed, not pasted?</strong> The ClaudeThings kits
                turn workflows like these into <strong>89 agents, 103 skills, and 181 slash
                commands</strong> that live inside Claude Code — one command to install, any stack.{" "}
                <a href="/#pricing">See the kits →</a>
              </p>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq" style={{ marginTop: 22 }}>
              {c.faq.map((f, i) => (
                <details className="q" key={i}>
                  <summary>
                    {f.q} <span className="plus">+</span>
                  </summary>
                  <div className="a">{f.a}</div>
                </details>
              ))}
            </div>

            <h2>More Claude prompts</h2>
            <div className="legal-index">
              {others.map((o) => (
                <a href={`/prompts/${o.slug}`} key={o.slug}>
                  <h3>
                    {o.icon} {o.label}
                  </h3>
                  <p>{o.title}</p>
                  <span className="arrow">Browse →</span>
                </a>
              ))}
            </div>
          </article>
        </div>
      </main>
    </SiteShell>
  );
}
