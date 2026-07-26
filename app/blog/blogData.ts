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
    slug: "best-mcp-servers-for-claude-code",
    title: "The 12 Best MCP Servers for Claude Code",
    description:
      "A ranked shortlist of the MCP servers worth connecting — why Context7 comes first, which ones just duplicate Claude Code, and why four to six beats forty.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "MCP",
    icon: "🔌",
  },
  {
    slug: "best-claude-code-plugins",
    title: "The Best Claude Code Plugins in 2026",
    description:
      "Plugins bundle skills, agents, commands, hooks, and MCP servers into one versioned install. Which are worth it, the 60-second test, and three to avoid.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Plugins",
    icon: "🧰",
  },
  {
    slug: "best-ai-coding-assistants",
    title: "The Best AI Coding Assistants in 2026",
    description:
      "Claude Code, Cursor, Codex, Copilot, Cline and more — ranked on shipped work, not demos, with a pick-by-job table and the setting that matters most.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Tools",
    icon: "⚖️",
  },
  {
    slug: "best-claude-code-hooks",
    title: "The 9 Best Claude Code Hooks to Set Up First",
    description:
      "The nine hooks worth having — auto-format, dangerous-command blocking, secret guards, test runs, and notifications — plus which event to use for each.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Hooks",
    icon: "🪝",
  },
  {
    slug: "best-ai-tools-for-marketers",
    title: "The Best AI Tools for Marketers in 2026",
    description:
      "Seven tools that cover the whole job, not fifty that overlap: content, keyword data, research, design, video, lifecycle, and automation — with a clear #1.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Marketing",
    icon: "🧲",
  },
  {
    slug: "claude-skills-examples",
    title: "Claude Skills Examples: 6 Real SKILL.md Files",
    description:
      "Six worked Claude skills — commit messages, tests, PDFs, brand voice, debugging, and conventions — plus the anatomy of a SKILL.md and why skills fire.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Skills",
    icon: "🧪",
  },
  {
    slug: "claude-skills-for-coding",
    title: "Claude Skills for Coding: 8 That Improve Code",
    description:
      "Code review, tests, debugging, refactoring, security, migrations, and git hygiene — what goes in each coding skill, and when to use one over CLAUDE.md.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Coding",
    icon: "💻",
  },
  {
    slug: "claude-skills-marketplace",
    title: "Claude Skills Marketplace: Find & Vet Skills",
    description:
      "There's no single app store for Claude skills. How plugin marketplaces work, how to vet a skill in thirty seconds, and what's actually worth paying for.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Ecosystem",
    icon: "🏪",
  },
  {
    slug: "claude-skills-for-pdf",
    title: "Claude Skills for PDF: Extract, Fill, Merge, OCR",
    description:
      "How a PDF skill bundles scripts to extract tables, fill forms, merge, split, OCR scans, and generate documents — and the pattern worth stealing.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Documents",
    icon: "📄",
  },
  {
    slug: "claude-skills-github",
    title: "Claude Skills on GitHub: Find & Install Safely",
    description:
      "Almost every Claude skill lives on GitHub. Where the good ones are, how to copy a skill folder into place, how to judge a repo fast, and the safety rules.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Skills",
    icon: "🐙",
  },
  {
    slug: "claude-skills-for-research",
    title: "Claude Skills for Research: Method, Not Guessing",
    description:
      "How a research skill encodes a search protocol, a sourcing rule with teeth, and permission to find nothing — plus five research skills worth having.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Research",
    icon: "🔬",
  },
  {
    slug: "claude-skills-for-developers",
    title: "Claude Skills for Developers: The Complete Guide",
    description:
      "How skills work via progressive disclosure, how they differ from CLAUDE.md, subagents, and MCP, the model-decides-code-executes pattern, and team rollout.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Skills",
    icon: "🛠️",
  },
  {
    slug: "claude-skills-for-studying",
    title: "Claude Skills for Studying: A Tutor, Not Answers",
    description:
      "Six study skills — Socratic tutoring, active recall, the Feynman technique, spaced repetition, worked examples, and exam simulation — and how to write one.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Learning",
    icon: "📚",
  },
  {
    slug: "mention-your-product-on-reddit-without-getting-banned",
    title: "Mention Your Product on Reddit Without a Ban",
    description:
      "Why most product posts get removed on Reddit — plus a copy-paste Claude prompt that interviews you, then writes a post that reads like a person, not an ad.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Marketing",
    icon: "👽",
  },
  {
    slug: "claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp",
    title: "Skills vs Subagents vs Slash Commands vs MCP",
    description:
      "The four ways to extend Claude Code, side by side: what skills, subagents, slash commands, and MCP servers each do, and a table for picking the right one.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "🧩",
  },
  {
    slug: "best-claude-code-subagents",
    title: "The 12 Best Claude Code Subagents",
    description:
      "A curated starter set of Claude Code subagents — code reviewer, debugger, security auditor, orchestrator, and more — and what makes a subagent actually good.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Subagents",
    icon: "🤖",
  },
  {
    slug: "how-to-write-a-claude-code-skill-that-triggers",
    title: "Write a Claude Code Skill That Triggers",
    description:
      "Why most Claude Code skills never fire — and how to fix it: how triggering works, the description formula, five common failure causes, and testing skills.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Skills",
    icon: "⚡",
  },
  {
    slug: "claude-md-best-practices-template",
    title: "CLAUDE.md Best Practices + Template",
    description:
      "What to put in CLAUDE.md and what to leave out: a copy-paste template, the under-200-lines rule, what earns a line, and the habits that keep it working.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "📋",
  },
  {
    slug: "claude-code-custom-slash-commands-examples",
    title: "15 Claude Code Slash Command Examples",
    description:
      "Fifteen ready-to-use custom slash commands for Claude Code — review, commit, debug, changelog, dependency audits — plus a 60-second syntax primer.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Slash commands",
    icon: "⌨️",
  },
  {
    slug: "claude-code-subagents-not-working",
    title: "Why Your Claude Code Subagents Aren't Working",
    description:
      "A troubleshooting guide for subagents that never run or return garbage: delegation-tuned descriptions, context bleed, tool scoping, and a 5-minute diagnostic.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Troubleshooting",
    icon: "🔧",
  },
  {
    slug: "run-claude-code-agents-in-parallel",
    title: "Run Claude Code Agents in Parallel",
    description:
      "Sequential, parallel, and fan-out orchestration for Claude Code agents — when each earns its cost, seven rules to keep token spend sane, and an example.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Orchestration",
    icon: "🕸️",
  },
  {
    slug: "claude-code-for-marketers",
    title: "Claude Code for Marketers",
    description:
      "Claude Code isn't just for developers. How marketers use it for SEO content pipelines, campaign assets, and reporting — on real files, no code required.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Marketing",
    icon: "📣",
  },
  {
    slug: "boilerplates-are-dead-claude-code-agents",
    title: "Boilerplates Are Dead: Ship SaaS with Agents",
    description:
      "Why $300 SaaS boilerplates stopped making sense — locked stacks, dead code, and rot — and the agent-first build sequence that replaces them.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Shipping",
    icon: "🚢",
  },
  {
    slug: "best-claude-code-skills",
    title: "The Best Claude Code Skills to Install in 2026",
    description:
      "An opinionated shortlist of Claude Code skills worth installing — code review, security, documents, SEO, and more — plus how to vet any skill in 30 seconds.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Skills",
    icon: "🎯",
  },
  {
    slug: "getting-started-with-claude-code",
    title: "Getting Started with Claude Code",
    description:
      "A no-fluff guide to Claude Code: install, your first session, CLAUDE.md, permissions, skills — and the habits that separate power users from tourists.",
    date: "July 2026",
    readingTime: "9 min read",
    tag: "Claude Code",
    icon: "🚀",
  },
  {
    slug: "how-to-build-ai-agents-with-claude",
    title: "How to Build AI Agents with Claude",
    description:
      "What an AI agent actually is, when you need one (and when you don't), the agent loop, tool use, MCP, and how to build your first agent with the Claude API.",
    date: "July 2026",
    readingTime: "12 min read",
    tag: "Agents",
    icon: "🤖",
  },
  {
    slug: "10-prompting-techniques-for-claude",
    title: "10 Prompting Techniques for Claude",
    description:
      "Ten techniques that consistently improve Claude's output: context front-loading, examples over adjectives, XML structure, chain-of-thought, and role prompting.",
    date: "July 2026",
    readingTime: "10 min read",
    tag: "Prompting",
    icon: "🧠",
  },
  {
    slug: "7-claude-prompts-for-smarter-investing",
    title: "7 Claude Prompts for Smarter Investing Research",
    description:
      "Seven copy-paste Claude prompts for investing research: reading annual reports, stress-testing a thesis, and decoding earnings calls. Educational, not advice.",
    date: "July 2026",
    readingTime: "8 min read",
    tag: "Finance",
    icon: "📈",
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
