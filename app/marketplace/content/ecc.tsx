export default function EccBody() {
  return (
    <>
      <p className="intro">
        ECC (it started life as Everything Claude Code) is the biggest free toolkit for Claude
        Code there is. 72 agents, 328 skills, 99 commands, plus hooks, rules, memory and a
        security scanner, all MIT licensed. If you've ever wished someone would just hand you a
        whole engineering process for your agent, this is that.
      </p>
      <p>
        Quick disclosure before anything else: we sell{" "}
        <a href="/">AgentsKit</a>, which overlaps with ECC. We still think ECC is worth your
        time, and we wrote an{" "}
        <a href="/comparisons/agentskit-vs-everything-claude-code">honest comparison</a> that
        starts with where ECC wins.
      </p>

      <h2>What ECC actually gives you</h2>
      <p>
        The pitch is a loop: plan, test, implement, review, verify, remember, improve. Instead
        of typing "please use TDD" into every prompt and hoping the model remembers, ECC makes
        it a gated workflow. You run <code>/ecc:plan "Add usage-based billing alerts"</code>,
        edit the plan, and the TDD skill makes the agent capture a failing test before it
        writes the code. A reviewer with fresh context then looks for regressions, and the
        build, lint, types and tests get checked at the end. What you get back is the code plus
        a trail: the plan, the red test, the green test, the review.
      </p>
      <p>
        The pieces are split on purpose. Skills load only when a task needs them. Agents get
        their own context and tool permissions. Rules are always loaded, so you pick them per
        language. Hooks run outside the model entirely, which is the only reliable way to
        enforce something. If those four words blur together for you, our explainer on{" "}
        <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">
          skills vs subagents vs slash commands vs MCP
        </a>{" "}
        sorts it out.
      </p>

      <h2>The parts I'd use first</h2>
      <p>
        Don't install it and try to learn 328 skills. The README itself says start with the
        workflow you need. Building a feature: <code>/ecc:plan</code> then the TDD workflow.
        Broken build: <code>/build-fix</code>. Long session getting heavy:{" "}
        <code>/context-budget</code>. Ending for the day: <code>/save-session</code>, then{" "}
        <code>/resume-session</code> tomorrow.
      </p>
      <p>
        AgentShield is the other one. It scans your own agent setup (prompts, hooks, MCP
        config, permissions, secrets) as an attack surface. Most people never audit the hooks
        and MCP servers they pasted in from a blog post, and they should. There's also a guard
        that stops destructive shell commands like <code>rm</code> and forced git checkouts
        before they run.
      </p>
      <p>
        The newer Memory Vault keeps durable context in plain Markdown under{" "}
        <code>.ecc/memory/</code>, readable by Claude, Codex, Kimi and others, so you can hand
        work from one agent to another.
      </p>

      <h2>Install</h2>
      <p>
        The guided installer is <code>npx ecc-universal@2.2.3 setup</code> (Node 18+, Git and
        Claude Code 2.1 or newer). Or from inside Claude Code:{" "}
        <code>/plugin marketplace add https://github.com/affaan-m/ECC</code> then{" "}
        <code>/plugin install ecc@ecc</code>. Pick one route, not both. Stacking a manual
        install on top of the plugin makes hooks fire twice, and the README warns about this
        more than once.
      </p>
      <p>
        Only install from the official sources: the <code>affaan-m/ECC</code> repo, the{" "}
        <code>ecc-universal</code> and <code>ecc-agentshield</code> npm packages, or ecc.tools.
        A project this popular attracts fake mirrors.
      </p>

      <h2>The catch</h2>
      <p>
        Size. With everything turned on, ECC puts a lot into your context window, and rules in
        particular are always loaded. There's a minimal profile (
        <code>npx ecc-universal@2.2.3 install --profile minimal --target claude</code>) that
        skips the runtime hooks, and I'd start there. The token tips in the README are good
        too, like running subagents on a cheaper model.
      </p>
      <p>
        It's also mostly one maintainer shipping weekly across seven agents, so things move
        fast and sometimes break. Claude Code gets the full experience. Cursor, OpenCode,
        Gemini and the others get adapters with fewer features, so check the support table
        before you assume parity. The core repo is free forever; the paid part is ECC Pro, a
        hosted GitHub App for private repos from $19 a seat per month.
      </p>

      <h2>Who it's for</h2>
      <p>
        Developers who want a full, opinionated process and are happy to spend an afternoon
        trimming it to fit. With over 310,000 GitHub stars at the time of writing, it's one of
        the most popular repos on GitHub. If you'd rather start smaller, see our roundup of the{" "}
        <a href="/blog/best-claude-code-plugins">best Claude Code plugins</a>, or Matt Pocock's{" "}
        <a href="/marketplace/matt-pocock-skills">much leaner skill set</a>.
      </p>
    </>
  );
}
