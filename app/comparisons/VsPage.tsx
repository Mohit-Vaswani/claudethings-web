import type { Metadata } from "next";
import type { ReactNode } from "react";
import ArticlePage, { type RelatedLink } from "../components/ArticlePage";
import { PLAN_BY_ID } from "@/app/lib/plans";
import { ogImage } from "@/app/lib/og";
import { SITE_URL } from "@/app/lib/site";

/**
 * Template for "AgentsKit vs <competitor>" pages.
 *
 * Every rival fact on these pages is dated, so `CHECKED` and the numbers in each
 * page's copy have to be refreshed together. The rival's strengths come before
 * ours on purpose: that section is why anyone believes the rest of the page.
 */

export const CHECKED = "November 2026";

/**
 * Current kit prices come from plans.ts. The $149 step lives in TIERS inside
 * components/pricing.tsx, a client module a server component can't read, so
 * LADDER repeats it. Update this line when the bundle price steps up.
 */
export const KIT_PRICE = `$${PLAN_BY_ID.engineer.price}`;
export const BUNDLE_PRICE = `$${PLAN_BY_ID.bundle.price}`;
export const LADDER = `${BUNDLE_PRICE} for the first 50 customers, then $149`;

export type Row = {
  label: string;
  rival: string;
  us: string;
  /** Which side is stronger on this row. Leave unset when it's a matter of taste. */
  win?: "rival" | "us";
};

export type Faq = { q: string; a: string };
export type Source = { label: string; href: string };

export type VsData = {
  slug: string;
  /** Rival's name as used in headings and table columns. */
  rival: string;
  title: string;
  description: string;
  crumb: string;
  readTime: string;
  intro: ReactNode;
  verdict: ReactNode;
  /** Optional note placed straight after the verdict. */
  note?: ReactNode;
  rivalSummary: string;
  usSummary: string;
  rivalBest: string[];
  rivalNot: string[];
  usBest: string[];
  usNot: string[];
  rows: Row[];
  rivalWins: ReactNode;
  usWins: ReactNode;
  /** Page-specific closing line for the "what you're paying for" section. */
  paying: ReactNode;
  closing: string;
  faqs: Faq[];
  sources: Source[];
  related: RelatedLink[];
};

export function vsMetadata(d: VsData): Metadata {
  const path = `/comparisons/${d.slug}`;
  const image = ogImage(d.title);
  return {
    title: { absolute: d.title },
    description: d.description,
    alternates: { canonical: path },
    openGraph: {
      title: d.title,
      description: d.description,
      type: "article",
      url: `${SITE_URL}${path}`,
      images: [{ url: image, width: 1200, height: 630, alt: d.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: d.title,
      description: d.description,
      images: [image],
    },
  };
}

function FitCard({
  name,
  summary,
  best,
  not,
}: {
  name: string;
  summary: string;
  best: string[];
  not: string[];
}) {
  return (
    <div className="vs-card">
      <h3>{name}</h3>
      <p>{summary}</p>
      <div className="vs-label vs-label-yes">Best for</div>
      <ul className="vs-list">
        {best.map((item) => (
          <li className="vs-yes" key={item}>
            {item}
          </li>
        ))}
      </ul>
      <div className="vs-label vs-label-no">Not ideal for</div>
      <ul className="vs-list">
        {not.map((item) => (
          <li className="vs-no" key={item}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function VsPage({ data: d }: { data: VsData }) {
  const url = `${SITE_URL}/comparisons/${d.slug}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.title,
    description: d.description,
    url,
    dateModified: "2026-11-05",
    author: { "@type": "Organization", name: "AgentsKit" },
    publisher: { "@type": "Organization", name: "AgentsKit", url: SITE_URL },
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const crumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE_URL}/comparisons` },
      { "@type": "ListItem", position: 3, name: d.crumb, item: url },
    ],
  };

  return (
    <ArticlePage
      crumbs={[
        { label: "Home", href: "/" },
        { label: "Comparisons", href: "/comparisons" },
        { label: d.crumb },
      ]}
      eyebrow="Comparison"
      title={d.title}
      meta={[`Checked ${CHECKED}`, d.readTime, "Written by the AgentsKit team"]}
      jsonLd={[articleLd, faqLd, crumbLd]}
      related={d.related}
      relatedHeading="More comparisons"
    >
      {d.intro}

      <div className="callout vs-verdict">
        <p>
          <strong>Quick verdict:</strong> {d.verdict}
        </p>
      </div>
      {d.note}

      <div className="vs-actions">
        <a className="btn btn-primary" href="/#pricing">
          See AgentsKit pricing
        </a>
        <a className="btn btn-ghost" href="#side-by-side">
          Skip to the table
        </a>
      </div>

      <h2>Who each one is for</h2>
      <div className="vs-split">
        <FitCard name={d.rival} summary={d.rivalSummary} best={d.rivalBest} not={d.rivalNot} />
        <FitCard name="AgentsKit" summary={d.usSummary} best={d.usBest} not={d.usNot} />
      </div>

      <h2>Where {d.rival} wins</h2>
      {d.rivalWins}

      <h2>Where AgentsKit wins</h2>
      {d.usWins}

      <h2 id="side-by-side">Side by side</h2>
      <p className="vs-legend">
        Shaded cells mark the stronger option on that row. Unshaded rows come down to taste.
      </p>
      <div className="cmp vs-table">
        <table>
          <thead>
            <tr>
              <th>Compared</th>
              <th>{d.rival}</th>
              <th>AgentsKit</th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td className={r.win === "rival" ? "us" : undefined}>{r.rival}</td>
                <td className={r.win === "us" ? "us" : undefined}>{r.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What you&apos;re actually paying for</h2>
      <p>
        You should know this before you buy: AgentsKit is a curated distribution. Many of the
        bundled agents, skills and commands come from open-source projects under MIT or Apache-2.0
        licenses, including{" "}
        <a href="https://github.com/wshobson/agents">wshobson/agents</a>,{" "}
        <a href="https://github.com/VoltAgent/awesome-claude-code-subagents">VoltAgent&apos;s subagents</a>,{" "}
        <a href="https://github.com/davila7/claude-code-templates">claude-code-templates</a> and{" "}
        <a href="https://github.com/coreyhaines31/marketingskills">Corey Haines&apos;s marketing skills</a>.
        Each one is credited in the kit, and with enough patience you could collect a lot of it
        yourself for free.
      </p>
      <p>
        The original parts are the <code>tech-lead</code>, <code>shipper</code>,{" "}
        <code>growth-strategist</code> and <code>brand-voice</code> agents, the marketing slash
        commands, the CLAUDE.md templates, the installer and the docs. The rest of the price buys
        the sorting: someone already picked what goes in, fixed the broken parts and put it behind
        one install command.
      </p>
      {d.paying}

      <div className="callout vs-cta">
        <p>
          <strong>{d.closing}</strong>
        </p>
        <p>
          Engineer or Marketing kit: {KIT_PRICE}. Both kits: {LADDER}. One-time payment, and a{" "}
          <a href="/refund">14-day refund</a> that still applies after you&apos;ve installed it.
        </p>
        <a className="btn btn-primary" href="/#pricing">
          See plans
        </a>
      </div>

      <h2>{d.rival} vs AgentsKit questions</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        {d.faqs.map((f) => (
          <details className="q" key={f.q}>
            <summary>
              {f.q} <span className="plus">+</span>
            </summary>
            <div className="a">{f.a}</div>
          </details>
        ))}
      </div>

      <h2>Sources</h2>
      <p>
        We read these on November 5, 2026. Products change quickly, so check them before you decide.
        If we got something wrong, email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> and we&apos;ll fix it.
      </p>
      <ul>
        {d.sources.map((s) => (
          <li key={s.href}>
            <a href={s.href}>{s.label}</a>
          </li>
        ))}
      </ul>
    </ArticlePage>
  );
}
