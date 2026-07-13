/**
 * Registry of blog posts. Each post is a static folder at app/blog/<slug>/.
 * The /blog index and the sitemap read from this list — add an entry here
 * when you publish a new post.
 */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** Human-readable publish/update label. */
  date: string;
  readingTime: string;
  tag: string;
  icon: string;
}

export const POSTS: BlogPost[] = [
  {
    slug: "mention-your-product-on-reddit-without-getting-banned",
    title: "How to Mention Your Product on Reddit Without Getting Banned (with a Claude Prompt That Writes the Post for You)",
    description:
      "Why most product posts get removed or shadow-banned on Reddit — and a copy-paste Claude prompt that interviews you about your product, karma, and goal, then writes a post that reads like a real person, not an ad.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Marketing",
    icon: "👽",
  },
  {
    slug: "claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
    title: "Claude Code Skills vs Subagents vs Slash Commands vs MCP: What Each Does and When to Use Each",
    description:
      "The four ways to extend Claude Code, explained side by side: what skills, subagents, slash commands, and MCP servers each do, how they differ, and a decision table for picking the right one.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "🧩",
  },
  {
    slug: "best-claude-code-subagents",
    title: "The 12 Claude Code Subagents Worth Setting Up First (and What Each One Does)",
    description:
      "A curated starter set of Claude Code subagents — code reviewer, debugger, security auditor, orchestrator, and more — with the reasoning behind each pick and what makes a subagent actually good.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Subagents",
    icon: "🤖",
  },
  {
    slug: "how-to-write-a-claude-code-skill-that-triggers",
    title: "How to Write a Claude Code Skill (SKILL.md) That Actually Triggers",
    description:
      "Why most Claude Code skills never fire — and how to fix it. How skill triggering works, the description formula, the five most common failure causes, and how to test a skill like code.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Skills",
    icon: "⚡",
  },
  {
    slug: "claude-md-best-practices-template",
    title: "CLAUDE.md Best Practices: The Exact Template to Give Every New Project",
    description:
      "What to put in CLAUDE.md (and what to leave out): a copy-paste template, the under-200-lines rule, what earns a line, and the habits that keep the file working as your project grows.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "📋",
  },
  {
    slug: "claude-code-custom-slash-commands-examples",
    title: "Claude Code Custom Slash Commands: 15 Copy-Paste Examples for Real Work",
    description:
      "Fifteen ready-to-use custom slash commands for Claude Code — review, commit, debug, changelog, dependency audits, and more — plus the 60-second syntax primer and the patterns behind good commands.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Slash commands",
    icon: "⌨️",
  },
  {
    slug: "claude-code-subagents-not-working",
    title: "Why Your Claude Code Subagents Aren't Working — Fixing Context Bleed and Bad Delegation",
    description:
      "A troubleshooting guide for subagents that never get used or return garbage: delegation-tuned descriptions, context bleed in both directions, tool scoping, and a 5-minute diagnostic.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Troubleshooting",
    icon: "🔧",
  },
  {
    slug: "run-claude-code-agents-in-parallel",
    title: "How to Run a Team of Claude Code Agents in Parallel Without Burning Through Tokens",
    description:
      "Sequential, parallel, and fan-out orchestration for Claude Code agents — when each pattern earns its cost, seven rules for keeping token spend sane, and a worked three-agent example.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Orchestration",
    icon: "🕸️",
  },
  {
    slug: "claude-code-for-marketers",
    title: "Claude Code for Marketers: Ship SEO Content and Campaigns Without Writing Code",
    description:
      "Claude Code isn't just for developers. How marketers use it for SEO content pipelines, campaign assets, and reporting — working on real files, no code required, with concrete prompts.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Marketing",
    icon: "📣",
  },
  {
    slug: "boilerplates-are-dead-claude-code-agents",
    title: "Boilerplates Are Dead: How to Ship a SaaS Faster with Claude Code Agents Instead of Templates",
    description:
      "Why $300 SaaS boilerplates stopped making sense: locked stacks, dead code, and rot — and the agent-first build sequence that replaces them with code generated for your stack.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Shipping",
    icon: "🚢",
  },
  {
    slug: "best-claude-code-skills",
    title: "The Best Claude Code Skills to Install in 2026 (and How to Add Them in One Command)",
    description:
      "An opinionated shortlist of Claude Code skills worth installing in 2026 — code review, security, documents, SEO, and more — plus how to judge any skill in thirty seconds and install safely.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Skills",
    icon: "🎯",
  },
  {
    slug: "getting-started-with-claude-code",
    title: "Getting Started with Claude Code: From Install to First Shipped Feature",
    description:
      "A practical, no-fluff guide to Claude Code: installation, your first session, CLAUDE.md, permissions, skills and slash commands — and the workflow habits that separate power users from tourists.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "🚀",
  },
  {
    slug: "how-to-build-ai-agents-with-claude",
    title: "How to Build AI Agents with Claude: A Practical Guide",
    description:
      "What an AI agent actually is, when you need one (and when you don't), the agent loop, tool use, MCP, and how to build your first working agent with the Claude API and Agent SDK.",
    date: "July 2026",
    readingTime: "12 min read",
    tag: "Agents",
    icon: "🤖",
  },
  {
    slug: "10-prompting-techniques-for-claude",
    title: "10 Prompting Techniques for Claude (From Anthropic's Own Playbook)",
    description:
      "The ten techniques that consistently improve Claude's output: context front-loading, examples over adjectives, XML structure, chain-of-thought, role prompting, output prefills, and more — each with a before/after.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Prompting",
    icon: "🧠",
  },
  {
    slug: "7-claude-prompts-for-smarter-investing",
    title: "7 Claude Prompts for Smarter Investing Research",
    description:
      "Seven copy-paste Claude prompts for investing research: reading annual reports, stress-testing a thesis, decoding earnings calls, and building a decision journal. Educational, not financial advice.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Finance",
    icon: "📈",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
