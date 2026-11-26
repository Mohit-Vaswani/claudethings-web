export default function PonytailBody() {
  return (
    <>
      <p className="intro">
        You know the guy. Long ponytail, oval glasses, has been at the company longer than the
        version control. You show him fifty lines, he says nothing, and replaces them with one.
        Ponytail is a free plugin that puts him inside Claude Code. It makes your agent write
        less code, and the surprising part is that the code it does write is better tested.
      </p>

      <h2>What it changes</h2>
      <p>
        Agents love to build things. Ask for a date picker and a typical agent installs a date
        picker library or hand-rolls a whole calendar. The README's example is 335 lines. With
        Ponytail, the agent first looks at what's already there, notices the repo has an{" "}
        <code>Input</code> component and that every browser already ships a date picker, and
        writes 10 lines with <code>type="date"</code>.
      </p>
      <p>
        It does this by climbing a ladder before it writes anything, and stopping at the first
        rung that works. Does this need to exist at all? Is it already in the codebase? Does
        the standard library do it? Is there a native platform feature? An installed
        dependency? Can it be one line? Only after all of that does it write the minimum that
        works, plus one small test if there's logic in it.
      </p>
      <p>
        The important rule: it's lazy about the solution, never about reading. It traces the
        real code path before picking a rung. And validation, error handling, security and
        accessibility are never on the chopping block.
      </p>

      <h2>The numbers</h2>
      <p>
        The author benchmarked version 5 in Claude Code on 39 tasks, including a real FastAPI
        and React repo, five runs each, with and without the skill. With Ponytail: 53% less
        code, 41% less time, 26% lower cost, 45% fewer tokens. And 98% of risky logic shipped
        with a test, against 68% without it. On the six security tasks (SQL injection, path
        traversal, forged tokens and so on) it passed all 30 runs.
      </p>
      <p>
        These are the author's own benchmarks, so take them as a direction, not a guarantee.
        But the method and per-task tables are published in the repo, which is more than most
        "X% faster" claims give you.
      </p>

      <h2>The commands worth knowing</h2>
      <p>
        Once installed it's on every session. You can turn it up or down with{" "}
        <code>/ponytail lite</code>, <code>full</code> or <code>ultra</code> (the README says
        ultra is "for when the codebase has wronged you personally"), or <code>off</code>.
      </p>
      <p>
        <code>/ponytail-review</code> reviews your diff like the senior dev who gets paged when
        it breaks. It reads the code your change touches, not only the diff, and each finding
        says what goes wrong, how to fix it, and what happens if you don't.{" "}
        <code>/ponytail-audit</code> does the same for the whole repo and tells you what to fix
        first. <code>/ponytail-debt</code> collects the <code>shortcut:</code> comments it
        leaves behind into a ledger, so "later" doesn't quietly become "never."
      </p>
      <p>
        Newer versions also add a small band above the Claude Code prompt showing what the
        current task cost, tokens used, how often it reused existing code, and whether tests
        passed. <code>/ponytail band</code> hides it if you don't want it. All of that data
        stays on your machine.
      </p>

      <h2>Install</h2>
      <p>
        In Claude Code, as two separate prompts:{" "}
        <code>/plugin marketplace add DietrichGebert/ponytail</code> and then{" "}
        <code>/plugin install ponytail@ponytail</code>. Codex has its own plugin commands, and
        for Cursor, Copilot, Windsurf and others you can drop the <code>AGENTS.md</code> file
        into your project. The author asks you to install only from{" "}
        <code>DietrichGebert/ponytail</code> on GitHub or <code>@dietrichgebert/ponytail</code>{" "}
        on npm, and notes it never ships <code>.exe</code> files. With nearly 200,000 stars,
        copycats are a real risk, so listen to that.
      </p>

      <h2>Who it's for</h2>
      <p>
        Anyone whose agent keeps writing 300 lines where 30 would do, which is most of us. It
        pairs nicely with a strict{" "}
        <a href="/blog/claude-md-best-practices-template">CLAUDE.md</a>, and if you're paying
        per token, the cost drop alone justifies trying it for a week. MIT licensed. If you
        want more process rather than less, look at{" "}
        <a href="/marketplace/matt-pocock-skills">Matt Pocock's skills</a> for the planning side.
      </p>
    </>
  );
}
