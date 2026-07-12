import type { ReactNode } from "react";
import SiteShell from "./SiteShell";

export interface Crumb {
  label: string;
  href?: string;
}

export interface RelatedLink {
  href: string;
  title: string;
  desc: string;
}

/**
 * Shared chrome for long-form article pages (blog posts, comparisons,
 * use cases): breadcrumbs, eyebrow, title, meta row, prose body, and a
 * related-content grid. Prose styling comes from the .legal-doc classes.
 */
export default function ArticlePage({
  crumbs,
  eyebrow,
  title,
  meta,
  jsonLd = [],
  children,
  related,
  relatedHeading = "Keep reading",
}: {
  crumbs: Crumb[];
  eyebrow: string;
  title: string;
  meta: string[];
  jsonLd?: object[];
  children: ReactNode;
  related?: RelatedLink[];
  relatedHeading?: string;
}) {
  return (
    <SiteShell>
      {jsonLd.map((ld, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      ))}
      <main className="legal-main">
        <div className="wrap">
          <article className="legal-doc">
            <div className="crumbs">
              {crumbs.map((c, i) => (
                <span key={i} style={{ display: "contents" }}>
                  {i > 0 && <span className="sep">/</span>}
                  {c.href ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
                </span>
              ))}
            </div>
            <div className="eyebrow">
              <span className="pulse"></span> {eyebrow}
            </div>
            <h1>{title}</h1>
            <div className="meta-row">
              {meta.map((m, i) => (
                <span key={i}>{m}</span>
              ))}
            </div>

            {children}

            {related && related.length > 0 && (
              <>
                <h2>{relatedHeading}</h2>
                <div className="legal-index">
                  {related.map((r) => (
                    <a href={r.href} key={r.href}>
                      <h3>{r.title}</h3>
                      <p>{r.desc}</p>
                      <span className="arrow">Read →</span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </article>
        </div>
      </main>
    </SiteShell>
  );
}
