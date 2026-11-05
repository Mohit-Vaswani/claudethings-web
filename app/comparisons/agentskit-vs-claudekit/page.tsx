import VsPage, { BUNDLE_PRICE, KIT_PRICE, LADDER, vsMetadata, type VsData } from "../VsPage";

const data: VsData = {
  slug: "agentskit-vs-claudekit",
  rival: "AgentKit",
  crumb: "AgentsKit vs ClaudeKit",
  title: "AgentsKit vs ClaudeKit (Now AgentKit): Honest Comparison",
  description:
    "ClaudeKit, now AgentKit, has more customers, more tools and a desktop app. AgentsKit costs less, with lifetime updates and a refund after install.",
  readTime: "6 min read",
  intro: (
    <>
      <p className="intro">
        ClaudeKit is now AgentKit: claudekit.cc redirects to agentkit.best. It sells an Engineer kit
        and a Marketing kit at $99 each, or both for $149 with 12 months of its desktop app. Of
        everything on this site&apos;s comparison list, it&apos;s the product most like ours.
      </p>
      <p className="intro">
        AgentsKit also sells an Engineer kit and a Marketing kit, at {KIT_PRICE} each. Both kits
        cost {LADDER}. We sell it, so read this with that in mind. AgentKit is the bigger and more
        established product, and we&apos;re not going to pretend otherwise. We&apos;re cheaper to
        start with and our terms are friendlier, and for some buyers that settles it.
      </p>
    </>
  ),
  verdict: (
    <>
      pick AgentKit if you use several coding agents, want a desktop app, or want a large community
      around the product. Pick AgentsKit if you only use Claude Code and care about a lower entry
      price, lifetime updates and being able to get a refund after you&apos;ve tried it.
    </>
  ),
  note: (
    <p>
      One thing to clear up, since the names are one letter apart: AgentKit and AgentsKit are
      separate products from separate teams, and neither is connected to the other.
    </p>
  ),
  rivalSummary: "Paid kits for many coding agents, with a CLI, a desktop app and a large community.",
  usSummary: "Paid kits for Claude Code only, delivered as a private GitHub repo.",
  rivalBest: [
    "People using Claude Code alongside Codex, Pi or other agents",
    "Anyone who wants a desktop app to sync kits between devices",
    "Buyers who want thousands of other users and an active Discord",
    "Anyone without a GitHub account, or who'd rather not use one for this",
  ],
  rivalNot: [
    "Buyers who want updates forever without a renewal",
    "People who want to try the kit on real code before committing to it",
    "Buying a single kit on a tight budget",
  ],
  usBest: [
    "People who only use Claude Code",
    "Buyers who want to test on their own codebase with a refund still available",
    "Anyone who wants the source in a repo they can read and git pull",
  ],
  usNot: [
    "Anyone working mainly in Codex, Cursor or another agent",
    "Buyers who want a big community and lots of other users' experience to draw on",
    "Anyone who wants a desktop app",
  ],
  rivalWins: (
    <>
      <p>
        <strong>Scale and proof.</strong> AgentKit reports 3,366+ builders, 4,003+ people on Discord
        and a 4.9 rating from 349 reviews. Those are its own numbers and we can&apos;t verify them,
        but even heavily discounted they dwarf ours. We have a few dozen customers. If you want
        lots of people who&apos;ve already hit your problem, that&apos;s AgentKit.
      </p>
      <p>
        <strong>Works in more places.</strong> It lists Claude Code, Codex, Cursor, Pi, Oh My Pi,
        DeepSeek Harness and Grok, with more in preview. It also publishes which ones passed a
        measured run on each operating system, including where a run failed. We haven&apos;t
        published anything like that, and we only support Claude Code.
      </p>
      <p>
        <strong>Product around the kits.</strong> AgentKit has a native desktop app for macOS,
        Windows and Linux, plus an upgrade path that takes a backup first and rolls back with one
        command. We have an installer, <code>agentskit update</code> and git.
      </p>
      <p>
        <strong>The $149 comparison.</strong> Once our launch price ends, both bundles cost $149,
        and AgentKit&apos;s includes a 3-device desktop license for a year. At that point the price
        stops being a reason to choose us.
      </p>
    </>
  ),
  usWins: (
    <>
      <p>
        <strong>Lower entry price.</strong> One kit costs {KIT_PRICE} here and $99 there. While the
        launch price lasts, the bundle costs {BUNDLE_PRICE} against their $149.
      </p>
      <p>
        <strong>Updates that don&apos;t expire.</strong> AgentKit includes 12 months of updates.
        After that you keep what you have and still get patches for your last minor version, but
        newer versions need a paid renewal. Our updates are included for life. In fairness, our last
        update was in August, so judge that promise by how often we actually ship.
      </p>
      <p>
        <strong>A refund after you&apos;ve tried it.</strong> This is the difference we&apos;d look
        at hardest. Both offer 14 days. AgentKit&apos;s terms say refunds are no longer available
        once you&apos;ve installed or downloaded a kit, so you have to decide before you use it.
        Ours covers real use: install it, try it on your codebase, and email us if it didn&apos;t
        help.
      </p>
      <p>
        <strong>Published contents.</strong> We publish exact counts per kit: 58 agents and 159
        commands in Engineer, 31 agents and 32 commands in Marketing. We couldn&apos;t find agent
        totals on AgentKit&apos;s site. Its docs, which still use the ClaudeKit name, list 75+ and
        55+ skills.
      </p>
    </>
  ),
  rows: [
    { label: "One kit", rival: "$99", us: KIT_PRICE, win: "us" },
    {
      label: "Both kits",
      rival: "$149, with 12 months of desktop app",
      us: LADDER,
      win: "us",
    },
    {
      label: "Updates",
      rival: "12 months, then a paid renewal for new versions",
      us: "Lifetime, no renewal",
      win: "us",
    },
    {
      label: "Refund",
      rival: "14 days, only before you install or download",
      us: "14 days, even after install",
      win: "us",
    },
    {
      label: "Coding agents",
      rival: "7 listed, plus 3 in preview",
      us: "Claude Code only",
      win: "rival",
    },
    {
      label: "Published test runs",
      rival: "Per agent and operating system",
      us: "None",
      win: "rival",
    },
    {
      label: "Desktop app",
      rival: "Yes. $49/year for 1 device, $99/year for 3",
      us: "No",
      win: "rival",
    },
    {
      label: "Upgrade rollback",
      rival: "Backup first, then one-command rollback",
      us: "agentskit update, or use git",
      win: "rival",
    },
    {
      label: "Customers",
      rival: "3,366+ builders (self-reported)",
      us: "A few dozen",
      win: "rival",
    },
    {
      label: "Delivery",
      rival: "License key and CLI. No GitHub account needed",
      us: "Private GitHub repo you can read and git pull",
    },
    {
      label: "Marketing kit",
      rival: "Yes, $99",
      us: `Yes, ${KIT_PRICE}`,
    },
    {
      label: "Published counts",
      rival: "75+ and 55+ skills in older docs. No agent totals found",
      us: "Exact counts per kit",
      win: "us",
    },
    {
      label: "Recent activity",
      rival: "Shipping v3. Terms updated November 2026",
      us: "Last kit update August 2026",
      win: "rival",
    },
  ],
  paying: (
    <p>
      We can&apos;t tell you how much of AgentKit is original, because we haven&apos;t seen its
      source and don&apos;t want to guess. We can tell you how ours is put together, so you can
      decide with that in front of you.
    </p>
  ),
  closing: "Only on Claude Code and want to try a kit on real work before deciding?",
  faqs: [
    {
      q: "Is ClaudeKit the same as AgentKit?",
      a: "It appears so. claudekit.cc now redirects to agentkit.best, and the docs at docs.claudekit.cc describe the same Engineer and Marketing kits under the older name with the older ck command. The current site uses the ak command.",
    },
    {
      q: "Are AgentKit and AgentsKit the same product?",
      a: "No. AgentKit, at agentkit.best, and AgentsKit, at agentskit.co, are separate products from separate teams. The names are just similar.",
    },
    {
      q: "Is AgentsKit a good ClaudeKit alternative?",
      a: "If you only use Claude Code and want a lower price, lifetime updates and a refund after trying it, yes. If you need other coding agents, a desktop app or a large community, AgentKit is the stronger choice.",
    },
    {
      q: "Can I get a refund after installing?",
      a: "From AgentsKit, yes: 14 days, even after you install. AgentKit's terms offer 14 days only if you haven't installed or downloaded a kit, and say refunds are no longer available once you have.",
    },
    {
      q: "What happens when AgentKit's 12 months of updates end?",
      a: "According to its terms, you keep the versions published during your window and continue to get patch releases of your last minor version. Newer minor or major versions need a paid renewal. The terms don't state a renewal price; it's shown at checkout.",
    },
    {
      q: "What's the biggest reason to choose AgentKit?",
      a: "It's the safer pick if you use more than one coding agent or want a large user base behind the product. It has far more customers than we do and supports far more tools.",
    },
    {
      q: "What's the biggest reason to choose AgentsKit?",
      a: "You pay less to start and take less risk. Updates don't expire, and you can test the kit on your own code and still get your money back within 14 days.",
    },
  ],
  sources: [
    { label: "AgentKit homepage and pricing", href: "https://agentkit.best/" },
    { label: "AgentKit terms: refunds and updates", href: "https://agentkit.best/terms" },
    { label: "ClaudeKit docs", href: "https://docs.claudekit.cc/docs/getting-started/introduction" },
    { label: "AgentsKit refund policy", href: "https://agentskit.co/refund" },
    { label: "AgentsKit pricing", href: "https://agentskit.co/#pricing" },
  ],
  related: [
    {
      href: "/comparisons/agentskit-vs-superpowers",
      title: "AgentsKit vs Superpowers",
      desc: "A free process framework, and when it's all you need.",
    },
    {
      href: "/comparisons/agentskit-vs-everything-claude-code",
      title: "AgentsKit vs Everything Claude Code",
      desc: "The biggest free toolbox for Claude Code, and where it beats us.",
    },
    {
      href: "/refund",
      title: "AgentsKit refund policy",
      desc: "The full terms of the 14-day guarantee.",
    },
  ],
};

export const metadata = vsMetadata(data);

export default function Page() {
  return <VsPage data={data} />;
}
