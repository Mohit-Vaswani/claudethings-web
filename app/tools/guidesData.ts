/**
 * Registry of curated guide pages living under /tools/<slug>. These are
 * editorial roundups (unlike the interactive tools in toolsData.ts).
 * The /tools index and the sitemap read from this list.
 */

export interface ToolGuide {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export const TOOL_GUIDES: ToolGuide[] = [
  {
    slug: "claude-coding-tools",
    name: "Claude Coding Tools",
    tagline: "The 2026 stack for coding with Claude",
    description:
      "Claude Code, IDE integrations, AI editors, and the extensions that matter — how the pieces fit and what to install first.",
    icon: "⌨️",
  },
  {
    slug: "claude-mcp-servers",
    name: "Claude MCP Servers",
    tagline: "Give Claude hands: the connectors worth installing",
    description:
      "What MCP is, the servers that earn a permanent spot (GitHub, Postgres, browser automation, and more), and how to add them safely.",
    icon: "🔌",
  },
  {
    slug: "claude-productivity-tools",
    name: "Claude Productivity Tools",
    tagline: "Beyond chat: the features people miss",
    description:
      "Projects, Artifacts, connectors, skills, and the workflow setups that turn Claude from a chat window into a working system.",
    icon: "⚡",
  },
];

export function getGuide(slug: string): ToolGuide | undefined {
  return TOOL_GUIDES.find((g) => g.slug === slug);
}
