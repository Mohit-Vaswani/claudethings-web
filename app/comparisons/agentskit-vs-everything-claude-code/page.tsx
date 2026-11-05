import VsPage, { KIT_PRICE, LADDER, vsMetadata, type VsData } from "../VsPage";

const data: VsData = {
  slug: "agentskit-vs-everything-claude-code",
  rival: "ECC",
  crumb: "AgentsKit vs ECC",
  title: "AgentsKit vs Everything Claude Code (ECC): Honest Comparison",
  description:
    "ECC is free, with 314 skills, hooks and memory that AgentsKit lacks. AgentsKit is simpler, paid and has a full marketing kit. Which one to pick.",
  readTime: "6 min read",
  intro: (
    <>
      <p className="intro">
        Everything Claude Code, now mostly called ECC, is a free, MIT-licensed system for AI coding
        tools, maintained by Affaan (affaan-m on GitHub). It has about 298,000 stars, 71 agents and
        314 skills, plus optional hooks, memory across sessions and security scanning of your agent
        configuration.
      </p>
      <p className="intro">
        AgentsKit is a paid set of 89 agents, 100+ skills and 181 slash commands for Claude Code,
        sold as an Engineer kit and a Marketing kit. We sell it, so read this with that in mind. On
        raw capability per dollar, ECC beats us, and it isn&apos;t close. So the useful question is
        whether you need what we do differently.
      </p>
    </>
  ),
  verdict: (
    <>
      pick ECC if you want the biggest free toolbox and don&apos;t mind configuring it. Pick
      AgentsKit if you want plain files you can read and a full marketing kit, and you&apos;re happy
      to pay for less setup.
    </>
  ),
  rivalSummary: "A very large free system: skills, hooks, memory and scanning, mostly opt-in.",
  usSummary: "Agents, skills and commands copied into your project, with nothing running behind them.",
  rivalBest: [
    "Engineers who like tuning their setup",
    "Teams that want hooks to block risky commands and gate tests",
    "Anyone who wants memory carried across sessions",
    "People working in Claude Code plus Codex or Cursor",
  ],
  rivalNot: [
    "People who want to install something and stop thinking about it",
    "Marketing teams that need campaign workflows, not a few content skills",
    "Windows users relying on memory features, given the defects its README lists",
  ],
  usBest: [
    "Claude Code users who want plain Markdown files they can read and edit",
    "Founders who need engineering and marketing roles in one place",
    "People who'd pay a one-time fee to skip the configuration",
  ],
  usNot: [
    "Anyone with no budget, since ECC is free and larger",
    "Teams that need hooks, session memory or config scanning",
    "Anyone not on Claude Code",
  ],
  rivalWins: (
    <>
      <p>
        <strong>Price, again.</strong> The repo is MIT-licensed and its README says it will stay
        that way. There is a paid hosted GitHub App for private repos, from $19 per seat per month,
        but it&apos;s optional.
      </p>
      <p>
        <strong>Things we simply don&apos;t have.</strong> ECC can run hooks outside the prompt,
        which means deterministic checks and a gated red, green, refactor cycle instead of hoping
        the model remembers. It keeps memory between sessions. It scans your agent configuration
        with AgentShield. AgentsKit ships no hooks and no memory system at all. If those are what
        you came for, you can stop reading.
      </p>
      <p>
        <strong>Skills.</strong> 314 against our 100+. Counting isn&apos;t everything, but
        that&apos;s a big gap.
      </p>
      <p>
        <strong>More than one tool.</strong> Claude Code is its stable primary target, Codex and
        Qoder have native plugins, and Cursor, OpenCode and Copilot CLI are in beta. We only do
        Claude Code.
      </p>
      <p>
        <strong>Pace and community.</strong> The repo has nearly 44,000 forks and was updated in early
        November. Our last kit update was in August.
      </p>
    </>
  ),
  usWins: (
    <>
      <p>
        <strong>Marketing as a real kit.</strong> ECC has useful content skills, including{" "}
        <code>content-engine</code>, <code>article-writing</code> and <code>market-research</code>,
        but most of its catalog is engineering. Our Marketing kit is a separate product: 31 agents,
        61 skills and 32 commands, such as <code>/campaign-brief</code>,{" "}
        <code>/email-sequence</code> and <code>/launch-plan</code>.
      </p>
      <p>
        <strong>Fewer moving parts.</strong> ECC has rules, hooks, instincts, a memory vault and
        install profiles, and that&apos;s where its power comes from. It also means more to learn.
        Its README warns against stacking install methods, explains why hooks can fire twice, and
        lists open defects on some platforms. To its credit, it tells you all this up front.
        AgentsKit copies Markdown files into <code>.claude</code>. Nothing runs in the background,
        and <code>agentskit doctor</code> shows what&apos;s installed.
      </p>
      <p>
        <strong>More commands and agents.</strong> We have 181 slash commands and 89 agents against
        98 legacy command shims and 71 agents. This matters if you like typing{" "}
        <code>/api-scaffold</code> rather than describing what you want. ECC treats commands as
        legacy and points you toward skills, so this is partly a difference in taste.
      </p>
    </>
  ),
  rows: [
    { label: "Price", rival: "Free. Optional GitHub App from $19/seat/month", us: `${KIT_PRICE} per kit. Both kits: ${LADDER}`, win: "rival" },
    { label: "Agents", rival: "71", us: "89", win: "us" },
    { label: "Skills", rival: "314", us: "100+", win: "rival" },
    { label: "Slash commands", rival: "98 legacy command shims", us: "181", win: "us" },
    { label: "Hooks", rival: "Optional, including test gates", us: "None", win: "rival" },
    { label: "Memory across sessions", rival: "Yes", us: "No", win: "rival" },
    { label: "Config security scanning", rival: "AgentShield", us: "A security-auditor agent, no scanner", win: "rival" },
    {
      label: "Marketing work",
      rival: "Some content, research and investor skills",
      us: "Full kit: 31 agents, 61 skills, 32 commands",
      win: "us",
    },
    {
      label: "Coding agents",
      rival: "Claude Code stable, others native, beta or experimental",
      us: "Claude Code only",
      win: "rival",
    },
    {
      label: "What runs on your machine",
      rival: "Hooks and scripts if you enable them",
      us: "Nothing beyond the installer. Plain files",
      win: "us",
    },
    { label: "Setup", rival: "Guided npx setup with many options", us: "One npx command from a private repo. Needs Node 18+" },
    {
      label: "Recent updates",
      rival: "Updated in early November 2026",
      us: "Lifetime updates included. Last update August 2026",
      win: "rival",
    },
    { label: "Refund", rival: "Nothing to refund", us: "14 days, no questions, even after install" },
  ],
  paying: (
    <p>
      ECC isn&apos;t one of those bundled sources. If you&apos;re comfortable assembling and
      configuring your own setup, ECC is probably the better deal, and we&apos;d rather tell you
      now than refund you later.
    </p>
  ),
  closing: "Tried a big free setup and want something smaller, with marketing included?",
  faqs: [
    {
      q: "Is AgentsKit a good Everything Claude Code alternative?",
      a: "It depends on why you're leaving. If ECC felt like too much to configure, or you need real marketing workflows, yes. If you rely on its hooks, memory or security scanning, no, because AgentsKit has none of those.",
    },
    {
      q: "Is Everything Claude Code the same as ECC?",
      a: "Yes. The project is now mostly called ECC and the repository lives at affaan-m/ECC. The older everything-claude-code name still appears in links and articles.",
    },
    {
      q: "Is ECC really free?",
      a: "The repo is MIT licensed and free to use. ECC Pro is a separate hosted GitHub App for private repos that starts at $19 per seat per month. You don't need it to use the open-source system.",
    },
    {
      q: "Can I use ECC and AgentsKit together?",
      a: "You can, but we haven't formally tested the combination, and both add a lot of agents and commands, so expect overlap. Use agentskit add to bring in single components instead of a whole kit. The Marketing kit is the part least likely to overlap.",
    },
    {
      q: "What's the biggest reason to choose ECC?",
      a: "It's free and does more, particularly with hooks, session memory and multi-tool support. For an engineer willing to configure things, that's hard to beat.",
    },
    {
      q: "What's the biggest reason to choose AgentsKit?",
      a: "You get engineering and marketing roles as plain files you can read, with one install command and nothing running in the background. It's a good fit if you want a kit rather than another system to maintain.",
    },
    {
      q: "Does paying for AgentsKit get me better engineering agents than ECC?",
      a: "We can't honestly claim that. We haven't benchmarked the two, and many of our engineering components come from open-source projects. You're paying mainly for curation, packaging, the original pieces and the marketing kit.",
    },
  ],
  sources: [
    { label: "affaan-m/ECC on GitHub", href: "https://github.com/affaan-m/ECC" },
    { label: "ECC pricing", href: "https://ecc.tools/pricing" },
    { label: "AgentsKit refund policy", href: "https://agentskit.co/refund" },
    { label: "AgentsKit pricing", href: "https://agentskit.co/#pricing" },
  ],
  related: [
    {
      href: "/comparisons/agentskit-vs-superpowers",
      title: "AgentsKit vs Superpowers",
      desc: "The most-starred process framework for coding agents, compared.",
    },
    {
      href: "/comparisons/agentskit-vs-claudekit",
      title: "AgentsKit vs ClaudeKit",
      desc: "Our closest paid competitor, now called AgentKit.",
    },
    {
      href: "/marketplace",
      title: "Free skills and plugins",
      desc: "Open-source Claude Code add-ons we've reviewed.",
    },
  ],
};

export const metadata = vsMetadata(data);

export default function Page() {
  return <VsPage data={data} />;
}
