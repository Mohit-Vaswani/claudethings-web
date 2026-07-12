/**
 * Registry of comparison pages. Each comparison is a static folder at
 * app/comparisons/<slug>/. The /comparisons index and sitemap read this list.
 */

export interface Comparison {
  slug: string;
  title: string;
  description: string;
  icon: string;
  vs: string;
}

export const COMPARISONS: Comparison[] = [
  {
    slug: "claude-vs-chatgpt",
    title: "Claude vs ChatGPT",
    vs: "Claude · ChatGPT",
    description:
      "The honest comparison: where Claude wins (writing, long documents, coding agents), where ChatGPT wins (ecosystem, multimodal breadth), and how to choose for your actual workload.",
    icon: "⚖️",
  },
  {
    slug: "claude-sonnet-vs-opus",
    title: "Claude Sonnet vs Opus",
    vs: "Sonnet · Opus",
    description:
      "Anthropic's two main model tiers explained: what you actually get for Opus-level pricing, when Sonnet is the smarter choice, and a decision framework by task type.",
    icon: "🎚️",
  },
  {
    slug: "claude-vs-copilot",
    title: "Claude vs GitHub Copilot",
    vs: "Claude Code · Copilot",
    description:
      "Autocomplete vs agent: how Claude Code and GitHub Copilot differ in kind, not just quality — and why many developers run both.",
    icon: "🛠️",
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}
