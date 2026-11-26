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
  {
    slug: "hallmark-anti-ai-slop-design-skill",
    name: "Hallmark",
    kind: "Skill",
    seoTitle: "Hallmark: The Free Design Skill That Stops AI-Looking Websites",
    metaDescription:
      "Hallmark is a free design skill for Claude Code, Codex and Cursor. It builds pages from 50 themes and lints them in a real browser for the tells of AI-made design.",
    tagline: "Pages that don't look AI-generated",
    description:
      "Deals three themes from a catalogue of fifty, builds the page around what visitors came to do, then checks it at eight screen widths for the eyebrow labels, coloured headline words and fake forms that give AI pages away.",
    icon: "🖋️",
    repo: "https://github.com/Nutlope/hallmark",
    repoName: "Nutlope/hallmark",
    category: "Design & frontend",
    license: "MIT",
    worksWith: "Claude Code, Codex, Cursor, OpenCode",
    keywords: [
      "hallmark design skill",
      "anti ai slop design",
      "claude code design skill",
      "ai landing page generator",
      "together ai hallmark",
      "frontend design skill",
    ],
  },
  {
    slug: "anatomy-isometric-illustration-skill",
    name: "Anatomy",
    kind: "Skill",
    seoTitle: "Anatomy: A Free Claude Skill for Interactive Isometric Diagrams",
    metaDescription:
      "Anatomy is a free Claude Code skill that explains a technical idea by drawing it as a working machine: an interactive isometric SVG with optional WebGL and 3D.",
    tagline: "Explain an idea by building it as a machine",
    description:
      "Turns a concept like caching or rate limiting into a physical object whose working is the idea, then builds it as an interactive isometric figure in SVG, WebGL or 3D for your docs or landing page.",
    icon: "⚙️",
    repo: "https://github.com/wheresryan22/anatomy",
    repoName: "wheresryan22/anatomy",
    category: "Diagrams & visuals",
    license: "MIT",
    worksWith: "Claude Code, Codex, OpenCode, Antigravity, MiniMax Code",
    keywords: [
      "anatomy claude skill",
      "isometric illustration ai",
      "interactive svg diagram",
      "technical diagram generator",
      "claude code svg skill",
      "explainer illustration ai",
    ],
  },
  {
    slug: "ecc-claude-code-agent-harness",
    name: "ECC",
    kind: "Plugin",
    seoTitle: "ECC (Everything Claude Code): 328 Free Skills, Agents and Hooks",
    metaDescription:
      "ECC is a free, open-source agent harness for Claude Code with 72 agents, 328 skills, hooks, memory and a security scanner. What it does, how to install it, and the catch.",
    tagline: "A full engineering process for your agent",
    description:
      "Plan, test, implement, review, verify, remember. 72 agents, 328 skills, hooks, rules, cross-agent memory and AgentShield security scanning, all MIT licensed.",
    icon: "🧰",
    repo: "https://github.com/affaan-m/ECC",
    repoName: "affaan-m/ECC",
    category: "Agent workflow",
    license: "MIT",
    worksWith: "Claude Code, Codex, Cursor, OpenCode, Gemini CLI",
    keywords: [
      "everything claude code",
      "ecc claude code",
      "claude code agent harness",
      "claude code skills collection",
      "agentshield",
      "free claude code plugin",
    ],
  },
  {
    slug: "impeccable-design-skill",
    name: "Impeccable",
    kind: "Skill",
    seoTitle: "Impeccable: Free Design Skill to Fix AI Slop in Claude Code",
    metaDescription:
      "Impeccable is a free design skill for Claude Code, Cursor and Codex. 24 commands like polish and bolder, plus a 62-rule AI slop detector you can run in CI.",
    tagline: "Design words your agent understands",
    description:
      "Named moves like bolder, quieter and polish, a scored design critique, a technical audit, and a 62-rule slop detector that runs in your agent, your terminal or CI.",
    icon: "🎨",
    repo: "https://github.com/pbakaus/impeccable",
    repoName: "pbakaus/impeccable",
    category: "Design & frontend",
    license: "Apache-2.0",
    worksWith: "Claude Code, Cursor, Codex, GitHub Copilot, Gemini CLI",
    keywords: [
      "impeccable design skill",
      "ai slop detector",
      "claude code design",
      "frontend design skill",
      "ui audit ai",
      "paul bakaus impeccable",
    ],
  },
  {
    slug: "ponytail-lazy-senior-dev-skill",
    name: "Ponytail",
    kind: "Plugin",
    seoTitle: "Ponytail: The Claude Code Plugin That Makes Your Agent Write Less Code",
    metaDescription:
      "Ponytail is a free Claude Code plugin that makes your agent think like a lazy senior dev: about half the code and fewer tokens, with risky logic still tested.",
    tagline: "Your agent, but it writes one line instead of fifty",
    description:
      "Before writing code, the agent checks whether it needs to exist, whether the codebase or standard library already does it, and only then writes the minimum. Comes with a review, a repo audit and a cost band.",
    icon: "🧑‍💻",
    repo: "https://github.com/DietrichGebert/ponytail",
    repoName: "DietrichGebert/ponytail",
    category: "Code quality",
    license: "MIT",
    worksWith: "Claude Code, Codex, Cursor, Copilot, OpenCode, Gemini CLI",
    keywords: [
      "ponytail claude code",
      "yagni ai agent",
      "reduce claude code tokens",
      "claude code plugin less code",
      "ai code review plugin",
      "lazy senior dev prompt",
    ],
  },
  {
    slug: "matt-pocock-skills",
    name: "Matt Pocock's Skills",
    kind: "Plugin",
    seoTitle: "Matt Pocock's Skills: Free Claude Code Skills for Real Engineers",
    metaDescription:
      "Matt Pocock's free skills for Claude Code, Codex and Copilot: /grill-me, /tdd, /to-spec and more. Small, composable skills for real engineering, not vibe coding.",
    tagline: "Small, composable skills for real engineering",
    description:
      "The skills Matt Pocock uses every day: /grill-me to align before coding, a shared project glossary, TDD and bug-diagnosis loops, spec and ticket writing, and an architecture review.",
    icon: "🛠️",
    repo: "https://github.com/mattpocock/skills",
    repoName: "mattpocock/skills",
    category: "Agent workflow",
    license: "MIT",
    worksWith: "Claude Code, Codex, GitHub Copilot, Gemini CLI, Cursor",
    keywords: [
      "matt pocock skills",
      "grill me skill",
      "claude code tdd skill",
      "agent skills for engineers",
      "claude code workflow skills",
      "mattpocock skills github",
    ],
  },
  {
    slug: "cloudflare-security-audit-skill",
    name: "Cloudflare Security Audit",
    kind: "Skill",
    seoTitle: "Cloudflare's Free Security Audit Skill for Claude Code, Explained",
    metaDescription:
      "Cloudflare's security-audit skill turns Claude Code into a code auditor that maps your repo, hunts for bugs and has separate agents verify every finding. Free, MIT.",
    tagline: "A code audit where every finding gets double-checked",
    description:
      "Six phases from reconnaissance to report. Isolated agents hunt for vulnerabilities, a fresh verifier tries to disprove each one, and only findings with a full source trace are marked confirmed.",
    icon: "🛡️",
    repo: "https://github.com/cloudflare/security-audit-skill",
    repoName: "cloudflare/security-audit-skill",
    category: "Security",
    license: "MIT",
    worksWith: "Claude Code and agents with parallel subagents",
    keywords: [
      "cloudflare security audit skill",
      "ai security audit",
      "claude code security review",
      "ai vulnerability scanner",
      "agent pen test code",
      "security audit skill",
    ],
  },
];

export function getMarketplaceItem(slug: string): MarketplaceItem | undefined {
  return MARKETPLACE.find((m) => m.slug === slug);
}
