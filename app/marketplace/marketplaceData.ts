/**
 * Registry of the free, open-source skills and plugins listed at /marketplace.
 *
 * To list a new one: add an entry here and a body component in
 * ./content/<slug>.tsx, then register it in ./content/index.ts. The hub, the
 * detail route, and the sitemap all read from this list.
 */

export interface MarketplaceItem {
  /** URL segment under /marketplace/. Keyword-rich, it is the page URL. */
  slug: string;
  /** Short product name shown on the card. */
  name: string;
  /** "Skill" or "Plugin", shown as the card pill. */
  kind: "Skill" | "Plugin";
  /** H1 and <title> of the detail page. Written for search. */
  seoTitle: string;
  /** Meta description, ~150 chars. */
  metaDescription: string;
  /** One-line hook under the name on the card. */
  tagline: string;
  /** Card body. */
  description: string;
  /** Emoji icon. */
  icon: string;
  /** GitHub repo URL. */
  repo: string;
  /** "owner/name", for display. */
  repoName: string;
  /** Category for the meta row and schema. */
  category: string;
  license: string;
  /** Agents it runs in. */
  worksWith: string;
  keywords: string[];
}

export const MARKETPLACE: MarketplaceItem[] = [
  {
    slug: "harvey-ai-sales-agent",
    name: "Harvey",
    kind: "Plugin",
    seoTitle: "Harvey: A Free AI Sales Agent That Runs on Your Claude Code Plan",
    metaDescription:
      "Harvey is a free, open-source AI sales agent for Claude Code and Codex. It finds prospects, writes cold emails, handles replies and books meetings, with no API bill.",
    tagline: "An autonomous SDR that runs on your Claude subscription",
    description:
      "Finds local businesses worth selling to, reads their sites, writes cold email that mentions something real, and works replies toward a meeting. Nothing sends until you approve it.",
    icon: "💼",
    repo: "https://github.com/ethanplusai/harvey",
    repoName: "ethanplusai/harvey",
    category: "Sales & outreach",
    license: "MIT",
    worksWith: "Claude Code, Codex",
    keywords: [
      "ai sales agent",
      "claude code sales agent",
      "open source ai sdr",
      "cold email ai agent",
      "harvey ai sales",
      "free sales automation",
    ],
  },
  {
    slug: "brag-launch-video-skill",
    name: "/brag",
    kind: "Skill",
    seoTitle: "/brag: The Free Claude Code Skill That Makes Your Launch Video",
    metaDescription:
      "/brag is a free, open-source agent skill that turns the project you just built into a short launch video with music, motion and share copy. One command in Claude Code.",
    tagline: "Turn the thing you just built into a launch video",
    description:
      "Run /brag inside any project and it reads what you made, picks the angle, and renders a 20-ish second launch video with a soundtrack and ready-to-post share copy.",
    icon: "🎬",
    repo: "https://github.com/latent-spaces/brag",
    repoName: "latent-spaces/brag",
    category: "Launch & marketing",
    license: "MIT",
    worksWith: "Claude Code, Codex, Cursor, opencode, Gemini CLI",
    keywords: [
      "brag claude skill",
      "launch video generator",
      "claude code skill video",
      "ai launch video",
      "product launch video free",
      "agent skills",
    ],
  },
  {
    slug: "geo-seo-claude",
    name: "GEO-SEO Claude",
    kind: "Skill",
    seoTitle: "GEO SEO Claude Skill: Free AI Search Audit for Any Website",
    metaDescription:
      "geo-seo-claude is a free Claude Code skill that audits a site for AI search (ChatGPT, Perplexity, Google AI Overviews) and classic SEO, then writes a client-ready report.",
    tagline: "Audit any site for ChatGPT, Perplexity and AI Overviews",
    description:
      "One command scores a website for AI citability, checks which AI crawlers it blocks, generates llms.txt and schema, and hands you a 0 to 100 GEO score with a PDF report.",
    icon: "🔎",
    repo: "https://github.com/zubair-trabzada/geo-seo-claude",
    repoName: "zubair-trabzada/geo-seo-claude",
    category: "SEO & AI search",
    license: "MIT",
    worksWith: "Claude Code",
    keywords: [
      "geo seo claude",
      "generative engine optimization tool",
      "ai search audit",
      "claude seo skill",
      "llms.txt generator",
      "free geo audit",
    ],
  },
];

export function getMarketplaceItem(slug: string): MarketplaceItem | undefined {
  return MARKETPLACE.find((m) => m.slug === slug);
}
