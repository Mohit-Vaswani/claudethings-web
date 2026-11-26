export default function HallmarkBody() {
  return (
    <>
      <p className="intro">
        You can spot an AI-built landing page from across the room. Small uppercase label
        above every heading, one word in the headline painted a different colour, three
        feature cards, an email sign-up box at the bottom whether the business needs one or
        not. Hallmark is a free design skill from Together AI whose whole job is to stop your
        agent from building that page.
      </p>

      <h2>What Hallmark does</h2>
      <p>
        Ask Claude Code for a page and Hallmark takes over the design. It starts by reading
        your project: the fonts and colours you already use, the framework, any locked{" "}
        <code>design.md</code>. Then it asks you once for real material. Photos, screenshots,
        actual numbers. It won't invent a testimonial or a "10,000+ happy customers" line,
        which is the first thing I check for in AI-built pages.
      </p>
      <p>
        Next it deals you three themes out of a catalogue of fifty. A theme in Hallmark is a
        material, not a template: paper, type, colour, surfaces, texture. It doesn't decide
        what goes on the page or in what order, so two prompts in the same theme give you two
        different pages. The layout comes from what the page is for. A booking page puts the
        booking where you'd expect it and ends on it. A shop sells. A newsletter page
        subscribes.
      </p>
      <p>
        The hero gets built on its own first, rendered, and reviewed cold before anything else
        exists. That order makes sense to me. If the top of the page is wrong, the rest
        doesn't matter.
      </p>

      <h2>The slop linter is the real feature</h2>
      <p>
        Hallmark ships a script called <code>sloplint</code> that opens the finished page in a
        real browser at eight widths and checks it against the tells. Eyebrow labels over
        every heading. Tracked capitals. A coloured word in the headline. A hero that misses
        the screen. A form that says "thanks!" without sending anything. Then a subagent with
        no memory of the build reviews it fresh and gets the last word.
      </p>
      <p>
        The checks come in tiers, and I like how honest they are about it. The Floor never
        ships: bad contrast, missing focus states, ignoring reduced motion, invented facts, a
        broken phone layout. Reflex gates catch the defaults a model falls into, and you can
        overrule one if you write down why. Finish checks are craft details that never block
        anything.
      </p>
      <p>
        You can run the linter on any page you already have, too:{" "}
        <code>node skills/hallmark/scripts/sloplint.mjs ./index.html --render</code>. That alone
        is worth a look if you've shipped a few AI-built pages and want to know how they read.
      </p>

      <h2>Redesign and audit without losing anything</h2>
      <p>
        Hallmark won't touch an existing design unless you name it.{" "}
        <code>/hallmark redesign ./src/app</code> rebuilds a page but keeps its content and
        wiring. Before it starts, it records every link, form field, handler and heading, and
        it fails the redesign if one goes missing. You get a side-by-side before and after.{" "}
        <code>/hallmark audit ./index.html</code> only reports, so it's the safe first step.
      </p>
      <p>
        Photos come from a library of 755 openly licensed images on Wikimedia Commons, credited
        on the page. It skips Unsplash and Pexels on purpose, because their terms bar AI tools
        from picking images. Small detail, but it tells you somebody read the fine print.
      </p>

      <h2>Install</h2>
      <p>
        One command: <code>npx skills add nutlope/hallmark -g</code>. It needs Node 18 or
        later. For the browser checks you also want <code>npm i -g puppeteer-core</code> and
        Chrome; without them the static checks still run. There's a Claude Code plugin route
        as well (<code>/plugin marketplace add nutlope/hallmark</code>), and it works in Codex,
        Cursor and OpenCode. If it doesn't fire on its own, say "use hallmark to build..." and
        it will. Our guide on{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">skills that trigger</a>{" "}
        explains why some skills need the nudge.
      </p>

      <h2>Who should use it</h2>
      <p>
        Anyone shipping marketing pages with an agent: indie hackers, agencies, founders who
        don't have a designer. It's built for standalone HTML and CSS pages, so if you need a
        component inside a big React design system, look at{" "}
        <a href="/marketplace/impeccable-design-skill">Impeccable</a> instead. Hallmark lists
        Impeccable as one of its inspirations, and the two overlap less than you'd think.
        Impeccable is better at fixing what exists. Hallmark is better at a page from nothing.
      </p>
      <p>
        It's MIT licensed, with more than 61,000 GitHub stars at the time of writing. For more
        like this, see our list of the{" "}
        <a href="/blog/best-claude-code-skills">best Claude Code skills</a>.
      </p>
    </>
  );
}
