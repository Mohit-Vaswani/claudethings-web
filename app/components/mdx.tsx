import type { ReactNode } from "react";
import type { FaqItem } from "@/app/lib/posts";

/**
 * Components available inside MDX post bodies, plus the FAQ block the blog
 * route renders from frontmatter.
 *
 * These emit exactly the markup the hand-written posts use (.intro, .callout,
 * .faq/.q/.a), so MDX posts inherit the existing .legal-doc prose styling with
 * no new CSS.
 */

/**
 * The bordered conversion block used near the end of a post.
 *
 * Emits no <p> of its own: MDX already wraps the children of a block-level JSX
 * component in a paragraph, and nesting one <p> inside another is invalid HTML
 * that fails hydration. The same rule applies to any block component added
 * here later, wrap in a <div>, let MDX supply the paragraph.
 */
function Callout({ children }: { children: ReactNode }) {
  return <div className="callout">{children}</div>;
}

/**
 * Renders the frontmatter FAQ as the same accordion the hand-written posts
 * use. Kept out of the MDX body so the identical data can feed FAQPage
 * JSON-LD without being written twice.
 */
export function PostFaq({ items }: { items: FaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        {items.map((item) => (
          <details className="q" key={item.q}>
            <summary>
              {item.q} <span className="plus">+</span>
            </summary>
            <div className="a">{item.a}</div>
          </details>
        ))}
      </div>
    </>
  );
}

export const mdxComponents = { Callout };
