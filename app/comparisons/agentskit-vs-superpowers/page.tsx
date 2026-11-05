import VsPage, { BUNDLE_PRICE, KIT_PRICE, LADDER, vsMetadata, type VsData } from "../VsPage";

const data: VsData = {
  slug: "agentskit-vs-superpowers",
  rival: "Superpowers",
  crumb: "AgentsKit vs Superpowers",
  title: "AgentsKit vs Superpowers: Which Claude Code Setup Fits?",
  description:
    "Superpowers is free and better than AgentsKit at forcing a disciplined process. AgentsKit is a paid catalog of specialists with a marketing kit. How to choose.",
  readTime: "6 min read",
  intro: (
    <>
      <p className="intro">
        Superpowers is a free, MIT-licensed development methodology for coding agents, built by
        Jesse Vincent and the team at Prime Radiant. It has about 313,000 GitHub stars. Install it
        and your agent has to brainstorm, plan, write tests first and go through review before it
        calls anything done.
      </p>
      <p className="intro">
        AgentsKit is a paid set of 89 agents, 100+ skills and 181 slash commands for Claude Code,
        sold as an Engineer kit and a Marketing kit. We sell it, so weigh this page accordingly.
        We&apos;ll still say the awkward part first: if your only problem is that your agent writes
        sloppy code, install Superpowers and you may never need to buy anything from us.
      </p>
    </>
  ),
  verdict: (
    <>
      pick Superpowers if you want your agent to follow a stricter engineering process and you
      don&apos;t want to pay. Pick AgentsKit if you want ready-made specialists for your stack, or
      you need marketing work done in Claude Code too.
    </>
  ),
  rivalSummary: "One opinionated process, enforced on every task, across most coding agents.",
  usSummary: "A large catalog of roles for Claude Code. You decide when to use them.",
  rivalBest: [
    "Developers whose agent skips tests, plans or review",
    "Anyone who wants good process switched on by default",
    "People moving between Claude Code, Cursor, Codex and Gemini CLI",
    "A budget of exactly $0",
  ],
  rivalNot: [
    "Marketing, SEO or growth work, since it only covers software development",
    "Small tweaks, where a full brainstorm and plan can feel heavy",
    "Finding a Postgres or Kubernetes specialist out of the box",
  ],
  usBest: [
    "Claude Code users who want specialists such as postgres-pro or sre-engineer",
    "Founders who write the code and do the marketing themselves",
    "People who'd rather not assemble a setup from a dozen GitHub repos",
  ],
  usNot: [
    "Anyone not on Claude Code, because that's all we support",
    "Teams that need the process enforced, because nothing here forces one",
    "People who enjoy building their own setup and don't mind the time",
  ],
  rivalWins: (
    <>
      <p>
        <strong>Price.</strong> It&apos;s free and MIT-licensed. We charge {KIT_PRICE} and up, so
        we have to justify that money. Superpowers doesn&apos;t.
      </p>
      <p>
        <strong>Discipline.</strong> This is the real difference between the two. Its README calls
        them mandatory workflows, and it means it: the agent checks for a relevant skill before any
        task, writes the failing test first, and gets a two-stage review for spec compliance and
        code quality. AgentsKit has a <code>test-automator</code> agent and a{" "}
        <code>/test-coverage</code> command, but they only run if someone reaches for them. An
        agent that cuts corners will keep cutting them with our kit installed.
      </p>
      <p>
        <strong>Reach.</strong> Superpowers has install instructions for 16 tools, including
        Cursor, Codex, Gemini CLI and GitHub Copilot CLI. We support one.
      </p>
      <p>
        <strong>Momentum.</strong> The repo was updated in early November and has more than 27,000 forks.
        Our most recent kit update shipped in August. Lifetime updates are part of what you buy
        from us, but nobody should mistake that for the same pace.
      </p>
    </>
  ),
  usWins: (
    <>
      <p>
        <strong>Range of roles.</strong> Superpowers teaches an agent how to work. It doesn&apos;t
        ship a <code>kubernetes-specialist</code>, a <code>postgres-pro</code> or a{" "}
        <code>/deploy-checklist</code> command. Our Engineer kit has 58 agents and 159 commands of
        that kind, written for particular jobs and stacks.
      </p>
      <p>
        <strong>Marketing.</strong> Superpowers doesn&apos;t touch it. Our Marketing kit has 31
        agents, 61 skills and 32 commands, including <code>/campaign-brief</code> and{" "}
        <code>/landing-page</code>, with a CLAUDE.md template for your brand voice. If you&apos;re
        the founder and the marketing team, this is the strongest reason to look at us.
      </p>
      <p>
        <strong>Less ceremony.</strong> Some days you want to fix one thing. AgentsKit doesn&apos;t
        impose a workflow, so a small job can stay small. The trade-off is the one above: nothing
        stops you from skipping steps you shouldn&apos;t skip.
      </p>
    </>
  ),
  rows: [
    { label: "Price", rival: "Free", us: `${KIT_PRICE} per kit. Both kits: ${LADDER}`, win: "rival" },
    { label: "What it is", rival: "A methodology made of skills", us: "A catalog of agents, skills and commands" },
    {
      label: "Size",
      rival: "About 15 skills, by our count of its README",
      us: "89 agents, 100+ skills, 181 commands",
      win: "us",
    },
    {
      label: "Enforced process",
      rival: "Yes. Mandatory workflows on every task",
      us: "No. You choose what to run",
      win: "rival",
    },
    {
      label: "Test-first coding",
      rival: "Built into the flow",
      us: "Available through agents and commands, not required",
      win: "rival",
    },
    {
      label: "Stack and role specialists",
      rival: "None listed",
      us: "Postgres, Kubernetes, Terraform, Go, Rust and more",
      win: "us",
    },
    {
      label: "Marketing work",
      rival: "Not covered",
      us: "Full kit: 31 agents, 61 skills, 32 commands",
      win: "us",
    },
    {
      label: "Coding agents",
      rival: "16 tools with install steps",
      us: "Claude Code only",
      win: "rival",
    },
    {
      label: "Install",
      rival: "One plugin command in most tools",
      us: "Private GitHub repo plus npx. Needs Node 18+",
      win: "rival",
    },
    {
      label: "Recent updates",
      rival: "Updated in early November 2026",
      us: "Lifetime updates included. Last update August 2026",
      win: "rival",
    },
    {
      label: "License",
      rival: "MIT",
      us: "Commercial license for unlimited projects. Bundled open source keeps its own license",
      win: "rival",
    },
    {
      label: "Refund",
      rival: "Nothing to refund",
      us: "14 days, no questions, even after install",
    },
  ],
  paying: (
    <p>
      Superpowers isn&apos;t one of those bundled sources, and you can&apos;t get what it does from
      our kit. That&apos;s the main reason this comparison isn&apos;t really either/or.
    </p>
  ),
  closing: "Already running Superpowers and still missing specialists or marketing?",
  faqs: [
    {
      q: "Is AgentsKit a good Superpowers alternative?",
      a: "Only partly. If you want enforced test-driven development and mandatory planning, AgentsKit doesn't replace Superpowers, because it doesn't enforce anything. It's a better fit if you were looking for specialist agents, ready-made slash commands or marketing workflows, which Superpowers doesn't try to provide.",
    },
    {
      q: "Can I use Superpowers and AgentsKit together?",
      a: "Nothing in how they install prevents it: Superpowers is a plugin, and AgentsKit copies agents, skills and commands into your project's .claude folder. We haven't run a formal test of the two together, so try it on one project first and use agentskit add to bring in only the parts you need.",
    },
    {
      q: "Is Superpowers really free?",
      a: "Yes. The repository is MIT licensed and its README shows no paid tier. Prime Radiant invites enterprises to contact them about commercial support and extra tooling, but you don't need that to use it.",
    },
    {
      q: "What's the biggest reason to choose Superpowers?",
      a: "It changes how your agent behaves on every task without you having to remember anything, and it costs nothing. If the code your agent ships keeps disappointing you, start there.",
    },
    {
      q: "What's the biggest reason to choose AgentsKit?",
      a: "Coverage. You get specialists across engineering and marketing behind one install command, which suits a founder or small team covering jobs they don't have people for.",
    },
    {
      q: "Does AgentsKit work outside Claude Code?",
      a: "No. AgentsKit is built for Claude Code. If you work mainly in Cursor, Codex or Gemini CLI, Superpowers is the better choice.",
    },
    {
      q: "What if I buy AgentsKit and it doesn't help?",
      a: `Email us within 14 days for a full refund, with no questions asked. It covers real use, so you can install the kit and try it on your own codebase first. Today the bundle costs ${BUNDLE_PRICE}.`,
    },
  ],
  sources: [
    { label: "obra/superpowers on GitHub", href: "https://github.com/obra/superpowers" },
    { label: "AgentsKit refund policy", href: "https://agentskit.co/refund" },
    { label: "AgentsKit pricing", href: "https://agentskit.co/#pricing" },
  ],
  related: [
    {
      href: "/comparisons/agentskit-vs-everything-claude-code",
      title: "AgentsKit vs Everything Claude Code",
      desc: "The biggest free toolbox for Claude Code, and where it beats us.",
    },
    {
      href: "/comparisons/agentskit-vs-claudekit",
      title: "AgentsKit vs ClaudeKit",
      desc: "Our closest paid competitor, now called AgentKit.",
    },
    {
      href: "/blog/getting-started-with-claude-code",
      title: "Getting Started with Claude Code",
      desc: "New to all this? Start with the tool itself.",
    },
  ],
};

export const metadata = vsMetadata(data);

export default function Page() {
  return <VsPage data={data} />;
}
