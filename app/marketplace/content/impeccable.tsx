export default function ImpeccableBody() {
  return (
    <>
      <p className="intro">
        Inter for everything. A purple-to-blue gradient. Cards inside cards, grey text on a
        coloured background, a rounded icon tile above every heading. Ask any coding agent for
        a page with no other guidance and you get some mix of those. Impeccable, by Paul
        Bakaus, is a free skill that gives your agent the words and the checks to do better.
      </p>

      <h2>A vocabulary, not a template</h2>
      <p>
        The big idea is that "make it pop" is a terrible instruction. Your agent has to guess.
        Impeccable replaces the guessing with named moves, each backed by its own playbook.{" "}
        <code>/impeccable bolder the pricing cards</code> amplifies a design that's playing it
        safe. <code>quieter</code> does the reverse. <code>distill</code> removes what the page
        doesn't need, <code>typeset</code> fixes fonts and hierarchy, <code>layout</code> fixes
        spacing, <code>harden</code> deals with errors, i18n, overflow and edge cases. There
        are 24 commands in all.
      </p>
      <p>
        Two are reviewers. <code>critique</code> scores a design against usability heuristics
        and ranks what to fix first. <code>audit</code> checks accessibility, performance,
        theming and responsive behaviour, with findings ranked P0 (blocking) down to P3
        (polish). I'd start with critique on one component, which is exactly what the README
        suggests: <code>/impeccable critique the pricing cards</code>. Narrow targets work much
        better than "review my whole site."
      </p>

      <h2>It learns your product first</h2>
      <p>
        Run <code>/impeccable init</code> once per project. It reads your code, asks only what
        it can't work out (who the product is for, what it needs to do, the constraints), and
        writes a <code>PRODUCT.md</code> that every later command reads. Then{" "}
        <code>/impeccable document</code> captures your current visual system in{" "}
        <code>DESIGN.md</code>, so changes stay on brand instead of drifting toward the
        defaults. It's the same reason a good{" "}
        <a href="/blog/claude-md-best-practices-template">CLAUDE.md</a> helps: the agent stops
        re-guessing context every session.
      </p>

      <h2>The slop detector works without an agent</h2>
      <p>
        This is the part I'd adopt even if I never used the commands. Impeccable ships 62
        deterministic rules that flag the AI-design tells plus plain quality problems like
        cramped padding and skipped heading levels. No model, no API key. You can run it in a
        terminal or in CI:
      </p>
      <p>
        <code>npx impeccable detect src/</code> or{" "}
        <code>npx impeccable detect http://localhost:5173</code>
      </p>
      <p>
        Point it at a running page and it also catches things like low contrast and tiny text.
        It can output GitHub annotations or SARIF for code scanning, so new slop fails the pull
        request that introduced it. The installer also offers a hook that scans every UI file
        your agent edits before it calls the job done. Say yes to that. There's even a Chrome
        extension that overlays the findings on any live site.
      </p>

      <h2>Live mode</h2>
      <p>
        <code>/impeccable live</code> opens your dev server with an overlay. Click an element,
        pick a direction, and it swaps variants in place. Accept one and it's written back to
        your source. It works with Vite, Next, SvelteKit, Astro, Nuxt and plain HTML. One
        thing to know: if no chat session is connected, applying copy edits can fall back to
        running the Codex or Claude CLI with approvals and sandboxing turned off. You can stop
        that by setting <code>IMPECCABLE_LIVE_COPY_AGENT=chat</code>. Read that section of the
        README before using live mode on a repo you don't know.
      </p>

      <h2>Install and who it's for</h2>
      <p>
        From your project root: <code>npx impeccable install</code>, reload your tool, then{" "}
        <code>/impeccable init</code>. It supports Claude Code, Cursor, Codex, Copilot, Gemini
        CLI and about fifteen more. Anonymous telemetry is on by default (it records which
        visual directions you picked, never your code); <code>npx impeccable telemetry off</code>{" "}
        turns it off.
      </p>
      <p>
        It's at its best on interfaces that already exist, which is most real work. Frontend
        developers and small product teams without a full-time designer get the most from it.
        For building a new marketing page from scratch,{" "}
        <a href="/marketplace/hallmark-anti-ai-slop-design-skill">Hallmark</a> is the other one
        to try. Impeccable started from Anthropic's own frontend-design skill, it's Apache 2.0
        licensed, and it had about 117,000 GitHub stars at the time of writing.
      </p>
    </>
  );
}
