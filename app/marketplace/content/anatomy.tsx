export default function AnatomyBody() {
  return (
    <>
      <p className="intro">
        Most technical diagrams are boxes and arrows, and most of them explain nothing. Anatomy
        is a free Claude Code skill that goes the other way. You ask it to explain an idea, and
        it invents a physical machine whose working is the idea, then builds that machine as an
        interactive isometric drawing you can put on a docs page or a landing page.
      </p>

      <h2>What that looks like</h2>
      <p>
        The examples in the README are what sold me. A cache key that skips work when nothing
        changed becomes a pin-tumbler lock that only turns when every pin matches. One GPU
        context serving many canvases becomes a gantry plotter whose single print head visits
        16 wells. You don't have to come up with the metaphor. That's the part it does for you,
        and it's most of the work.
      </p>
      <p>
        Claude then builds the thing out of dozens of small, shaded parts, puts it in a framed
        card with a title and a live readout, and makes it move when you hover or use the
        keyboard. Every number on the figure comes from the same little model that moves the
        parts, so the readout and the drawing can't disagree. Then it checks its own work by
        zooming in on every joint in both light and dark themes.
      </p>

      <h2>Three kinds of figure</h2>
      <p>
        The core is SVG: solid isometric parts with four-tone shading, delivered as a
        standalone HTML page, a single <code>.svg</code> file, or React and Next.js components.
        When lines can't do the job (fire, water, steam, glow) it adds a WebGL shader layer
        that sits inside the same isometric camera, so the flame looks like part of the drawing
        instead of a sticker on top. The Raptor engine example in the repo has an exhaust plume
        done this way and it looks great.
      </p>
      <p>
        There's also a 3D mode, marked beta, where parts actually turn: a dial that spins,
        fingers that flex, a piece that breaks off and falls. The author is upfront that it's
        only proven on its own example so far.
      </p>

      <h2>How to use it</h2>
      <p>
        Install with <code>npx skills add wheresryan22/anatomy -g</code>, then in Claude Code:
      </p>
      <p>
        <code>/anatomy explain how a token bucket rate limiter works, interactive</code>
      </p>
      <p>
        No API keys and nothing to <code>npm install</code>. The kit uses only Node's built-in
        modules, so you need Node 20.10 or newer, plus Chrome or Chromium for the self-checks.
        It also runs in Codex (as <code>$anatomy</code>), OpenCode, Antigravity and MiniMax Code.
      </p>
      <p>
        The README gives three tips and they're good ones. Name the idea, not the drawing, and
        include the real numbers: sizes, counts, rates, thresholds. Or, if you already know the
        machine you want, name it and say what should move. And always say where the figure
        will live (HTML page, lone SVG, or a React component, light or dark), because the build
        is different for each.
      </p>

      <h2>Be ready to wait</h2>
      <p>
        Anatomy is slow on purpose, and you should know that before you try it on a deadline. A
        figure is a long session: a parts list, the geometry, an audit that proves no pipe
        passes through anything, then close-ups of every joint. The Raptor build alone takes a
        few minutes, and a full 3D audit can run 15 to 20 minutes. It will also chew through a
        fair bit of your Claude usage.
      </p>
      <p>
        It isn't a chart library either. No axes, no data plots. And it draws machines,
        instruments and tools, not people or maps. If your idea has no mechanism you could
        build, the figure comes out weaker. That's the honest limit, and the README says it
        plainly.
      </p>

      <h2>Who it's for</h2>
      <p>
        Developer-tool companies writing docs, technical bloggers, and anyone whose landing page
        has to explain how the product works. One good figure like this does more than three
        paragraphs of copy. If you're writing technical content with Claude more generally, our
        post on{" "}
        <a href="/blog/claude-skills-for-developers">Claude skills for developers</a> has more
        ideas, and you can share finished figures to the project's community gallery straight
        from your agent.
      </p>
      <p>
        MIT licensed, about 29,000 GitHub stars at the time of writing, zero dependencies.
      </p>
    </>
  );
}
