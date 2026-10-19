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
  /** Shown as the card pill. */
  kind: "Skill" | "Plugin" | "MCP server";
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
  /** Override for the schema.org license URL when it isn't a stock OSI license. */
  licenseUrl?: string;
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
  {
    slug: "hypit-ai-video-cloning",
    name: "Hypit",
    kind: "Skill",
    seoTitle: "Hypit: Clone Any Viral Video With Claude Code (Free, Open Source)",
    metaDescription:
      "Hypit is a free, open-source skill that lets Claude Code or Codex clone a viral video as an editable workflow, then swap the host, script or language and render variants.",
    tagline: "Clone a viral video into a workflow you can remix",
    description:
      "Drop in a TikTok, Reel or ad and your agent rebuilds it as an editable composition: footage, word-timed captions, B-roll and effects. Swap the parts that change and render as many variants as you want.",
    icon: "🎞️",
    repo: "https://github.com/hypit-ai/hypit",
    repoName: "hypit-ai/hypit",
    category: "Video & content",
    license: "Apache-2.0 (with conditions)",
    licenseUrl: "https://github.com/hypit-ai/hypit/blob/main/LICENSE",
    worksWith: "Claude Code, Codex",
    keywords: [
      "hypit ai",
      "clone viral video ai",
      "ai video agent",
      "claude code video skill",
      "ugc ad generator open source",
      "ai video variants",
    ],
  },
  {
    slug: "rea-reverse-engineering-mcp",
    name: "REA",
    kind: "MCP server",
    seoTitle: "REA: Reverse Engineer Any App With Claude Code (Free MCP Server)",
    metaDescription:
      "REA is a free, open-source MCP server that lets Claude Code, Codex or Cursor reverse engineer apps, Electron bundles and native binaries, with evidence for every finding.",
    tagline: "See a feature you like, find out how it's built",
    description:
      "Connects your agent to Ghidra, Hopper, IDA, JADX and a browser so it can take apart native binaries, Electron and JavaScript apps, .NET, Android APKs and websites, then explain what it found and build your own version.",
    icon: "🔬",
    repo: "https://github.com/morluto/rea",
    repoName: "morluto/rea",
    category: "Reverse engineering",
    license: "MIT",
    worksWith: "Claude Code, Codex, Cursor, Gemini CLI",
    keywords: [
      "rea reverse engineering",
      "reverse engineering mcp",
      "claude code reverse engineering",
      "ghidra mcp server",
      "ai binary analysis",
      "electron app reverse engineering",
    ],
  },
  {
    slug: "api-anything-website-to-api",
    name: "API Anything",
    kind: "Plugin",
    seoTitle: "API Anything: Turn Any Website Into an API Your Agent Can Call",
    metaDescription:
      "API Anything is a free, open-source tool that teaches Claude Code a website once, then lets it call that site like an API over MCP instead of driving a slow browser.",
    tagline: "Stop making your agent click through websites",
    description:
      "Watches a site's own frontend make a request, learns which parts are your inputs, and saves it as an operation your agent calls over MCP. Plain HTTP, JSON back, and it re-learns itself when the site changes.",
    icon: "🔌",
    repo: "https://github.com/goodnight000/api-anything",
    repoName: "goodnight000/api-anything",
    category: "Automation & data",
    license: "MIT",
    worksWith: "Claude Code, Codex, any MCP client",
    keywords: [
      "api anything",
      "turn website into api",
      "website to api ai",
      "claude code mcp scraping",
      "browser automation alternative",
      "unofficial api generator",
    ],
  },
];

export function getMarketplaceItem(slug: string): MarketplaceItem | undefined {
  return MARKETPLACE.find((m) => m.slug === slug);
}
