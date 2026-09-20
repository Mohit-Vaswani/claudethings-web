import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * MDX blog loader.
 *
 * Posts live as single files at content/blog/<slug>.mdx and are rendered by
 * the dynamic route app/blog/[slug]/page.tsx. The 28 original posts are still
 * hand-built folder routes under app/blog/<slug>/page.tsx; Next.js gives those
 * static segments precedence over the dynamic one, so both systems coexist and
 * legacy posts keep working untouched. New posts should always be MDX.
 *
 * Everything the sitemap, the blog index, and the JSON-LD need is derived from
 * frontmatter, so publishing a post is one file and no registry edit.
 */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export interface FaqItem {
  q: string;
  a: string;
}

export interface RelatedRef {
  href: string;
  title: string;
  desc: string;
}

export interface MdxPost {
  slug: string;
  title: string;
  description: string;
  /**
   * Lead paragraph, rendered as <p class="intro"> above the MDX body.
   *
   * Lives in frontmatter rather than the body for two reasons: MDX would
   * double-wrap a JSX intro component in a paragraph, and keeping it a
   * discrete field forces every post to open with a direct answer, which is
   * what answer engines extract.
   */
  intro: string;
  /** ISO date (YYYY-MM-DD), used for schema.org and sorting. */
  date: string;
  /** Human label for the meta row, derived from `date` unless overridden. */
  dateDisplay: string;
  readingTime: string;
  tag: string;
  icon: string;
  eyebrow: string;
  /** Last breadcrumb label. Falls back to `tag`. */
  crumb: string;
  /** The primary query this page is built to answer. Tracking only. */
  targetKeyword?: string;
  faq: FaqItem[];
  related: RelatedRef[];
  /** Unpublished posts render with noindex and stay out of the sitemap. */
  published: boolean;
  /** Raw MDX body, frontmatter stripped. */
  body: string;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** ~220 wpm, rounded up, matching the tone of the hand-written posts. */
function readingTime(body: string): string {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 220))} min read`;
}

function parse(slug: string, raw: string): MdxPost {
  const { data, content } = matter(raw);

  const date = String(data.date ?? "").slice(0, 10);
  const faq: FaqItem[] = Array.isArray(data.faq)
    ? data.faq
        .filter((f: unknown): f is FaqItem => !!f && typeof f === "object" && "q" in f && "a" in f)
        .map((f: FaqItem) => ({ q: String(f.q), a: String(f.a) }))
    : [];
  const related: RelatedRef[] = Array.isArray(data.related)
    ? data.related.map((r: RelatedRef) => ({
        href: String(r.href),
        title: String(r.title),
        desc: String(r.desc ?? ""),
      }))
    : [];

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    intro: String(data.intro ?? data.description ?? ""),
    date,
    dateDisplay: data.dateDisplay ? String(data.dateDisplay) : formatDate(date),
    readingTime: data.readingTime ? String(data.readingTime) : readingTime(content),
    tag: String(data.tag ?? "Guide"),
    icon: String(data.icon ?? "📄"),
    eyebrow: String(data.eyebrow ?? "Guide"),
    crumb: String(data.crumb ?? data.tag ?? "Guide"),
    targetKeyword: data.targetKeyword ? String(data.targetKeyword) : undefined,
    faq,
    related,
    // Default to published: a file in content/blog is meant to ship unless it
    // explicitly says otherwise.
    published: data.published !== false,
    body: content,
  };
}

/** Every MDX post, published or not, newest first. */
export function getAllMdxPosts(): MdxPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      return parse(slug, fs.readFileSync(path.join(CONTENT_DIR, f), "utf8"));
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Only posts that should be indexed and listed. */
export function getPublishedMdxPosts(): MdxPost[] {
  return getAllMdxPosts().filter((p) => p.published);
}

export function getMdxPost(slug: string): MdxPost | undefined {
  return getAllMdxPosts().find((p) => p.slug === slug);
}
