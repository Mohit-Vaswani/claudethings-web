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
