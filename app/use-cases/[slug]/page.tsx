import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import { notFound } from "next/navigation";
import SiteShell from "../../components/SiteShell";
import PromptCard from "../../components/PromptCard";
import { USE_CASES, getUseCase } from "../useCasesData";

export const dynamicParams = false;

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ slug: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) return {};
  const url = `https://claudethings.com/use-cases/${u.slug}`;
  return {
    title: u.metaTitle,
    description: u.description,
    alternates: { canonical: `/use-cases/${u.slug}` },
    openGraph: {
      title: u.title,
      description: u.description,
      type: "article",
      url,
      images: [{ url: ogImage(u.title), width: 1200, height: 630, alt: u.title }],
    },
    twitter: { card: "summary_large_image", title: u.title, description: u.description, images: [ogImage(u.title)] },
  };
}

export default async function UseCasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const u = getUseCase(slug);
  if (!u) notFound();

  const others = USE_CASES.filter((o) => o.slug !== u.slug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: u.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <main className="legal-main">
        <div className="wrap">
          <article className="legal-doc">
            <div className="crumbs">
              <a href="/">Home</a> <span className="sep">/</span>{" "}
              <a href="/use-cases">Use cases</a> <span className="sep">/</span>{" "}
              <span>{u.label}</span>
            </div>
            <div className="eyebrow">
              <span className="pulse"></span> Claude for {u.label.toLowerCase()}
            </div>
            <h1>{u.title}</h1>
            <div className="meta-row">
              <span>
                Updated <b>July 2026</b>
              </span>
              <span>Honest assessment — strengths and limits</span>
            </div>

            {u.intro.map((p, i) => (
              <p className="intro" key={i}>
                {p}
              </p>
            ))}

            <h2>Where Claude earns its keep</h2>
            {u.fits.map((f, i) => (
              <div key={i}>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}

            <h2>A realistic workflow</h2>
            {u.workflow.map((w, i) => (
              <div key={i}>
                <h3>{w.title}</h3>
                <p>{w.body}</p>
              </div>
            ))}

            <h2>Starter prompts</h2>
            {u.prompts.map((p, i) => (
              <div key={i}>
                <h3>{p.title}</h3>
                <PromptCard title={`starter — ${p.title}`} prompt={p.prompt} note={p.note} />
              </div>
            ))}

            <h2>The setup that makes it stick</h2>
            <ul>
              {u.setup.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>

            <div className="callout">
              <p>
                <strong>Skip the blank-slate setup:</strong> the ClaudeThings kits install 89
                specialized agents, 103 skills, and 181 slash commands into Claude Code with one
                command — engineering and marketing workflows included.{" "}
                <a href="/#pricing">See the kits →</a>
              </p>
            </div>

            <h2>Frequently asked questions</h2>
            <div className="faq" style={{ marginTop: 22 }}>
              {u.faq.map((f, i) => (
                <details className="q" key={i}>
                  <summary>
                    {f.q} <span className="plus">+</span>
                  </summary>
                  <div className="a">{f.a}</div>
                </details>
              ))}
            </div>

            <h2>More use cases</h2>
            <div className="legal-index">
              {others.map((o) => (
                <a href={`/use-cases/${o.slug}`} key={o.slug}>
                  <h3>
                    {o.icon} {o.label}
                  </h3>
                  <p>{o.description.split(":")[0]}.</p>
                  <span className="arrow">Read →</span>
                </a>
              ))}
              <a href="/prompts">
                <h3>📋 The prompt library</h3>
                <p>50 field-tested Claude prompts across five disciplines, free to copy.</p>
                <span className="arrow">Browse →</span>
              </a>
            </div>
          </article>
        </div>
      </main>
    </SiteShell>
  );
}
