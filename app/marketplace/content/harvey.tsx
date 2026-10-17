export default function HarveyBody() {
  return (
    <>
      <p className="intro">
        Most "AI sales agents" are a monthly invoice with a chatbot attached. Harvey is the
        opposite pitch. It's an open-source sales agent that runs on your own laptop and uses
        the Claude Pro or Max plan you already pay for, through Claude Code. No API key, no
        per-token bill, no $400 a month for a prospecting database.
      </p>

      <h2>What Harvey actually does</h2>
      <p>
        You point it at your own website with <code>harvey train https://your-site.com</code>{" "}
        and it learns what you sell. Then it goes looking for businesses that might want it.
        The default source is OpenStreetMap, which costs nothing and needs no account. For each
        business it reads the homepage, the robots.txt and the sitemap. That's three HTTP
        requests and zero model calls, and it's where the useful facts come from: which agency
        built their site (most of them sign the footer), whether they're running Google or Meta
        ads, whether the blog died in 2023, whether you can book online or have to phone in.
      </p>
      <p>
        Those facts end up in the first line of the email. That's the whole idea. A cold email
        that says "noticed you're running Google Ads but there's no way to book after 6pm" gets
        read. One that says "I hope this finds you well" gets deleted, and Harvey's writing rules
        literally ban that phrase, along with "circling back" and "just wanted to reach out."
      </p>
      <p>
        After that it runs on a loop, every 15 minutes by default. Wake up, check the budget,
        pick the most useful job (replies first, then sending, then writing, then finding new
        leads), do it, log it, go back to sleep. It also respects quiet hours, so it isn't
        firing off mail at 3am.
      </p>

      <h2>The part I like most: you approve everything</h2>
      <p>
        Harvey can collect 23 different signals about a business, but it won't touch any of
        them until you confirm them. Each one tells you what it costs before you turn it on.
        Then you build a target list like a filter: has an agency, running Google Ads, doesn't
        have online booking. The dashboard at <code>localhost:5555</code> counts the matches as
        you click.
      </p>
      <p>
        Every email sits in an outbox until you approve it, one at a time if you want. Email
        addresses get tagged as verified, risky, guess or invalid, and it only sends to the
        deliverable ones. If you never want it to send anything, <code>harvey export</code>{" "}
        gives you a CSV you can load into whatever sequencer you already use. Honestly that
        alone is worth the install for a lot of people.
      </p>

      <h2>Who it's for</h2>
      <p>
        Agencies, freelancers and small SaaS teams selling to local businesses with 5 to 50
        staff. That's exactly the segment where tools like Apollo and ZoomInfo have thin
        coverage, and where a specific, observed detail beats a generic template. If you sell
        enterprise software to Fortune 500 buyers, this isn't built for you.
      </p>
      <p>
        You'll want to be a little technical. Setup is Python 3.11+, a <code>.env</code> file
        and a sending mailbox, ideally on a separate domain so your main one doesn't take a
        reputation hit. The easiest path is to clone the repo, open Claude Code inside it and
        say "set up Harvey for me." The repo ships a CLAUDE.md that turns Claude into the setup
        wizard. If you've never written one, our{" "}
        <a href="/blog/claude-md-best-practices-template">CLAUDE.md guide</a> explains why that
        trick works so well.
      </p>

      <h2>The sales brain is just Markdown</h2>
      <p>
        Harvey's know-how lives in a <code>skills/</code> folder of plain Markdown files:
        email frameworks (AIDA, PAS and a few others), objection handling, lead qualification,
        offer strategy. They get pasted into the prompt before each run. So if the emails feel
        too pushy, you open <code>email_frameworks.md</code> and change it, and the next cycle
        behaves differently. No retraining, no restart. It's the same pattern behind every good{" "}
        <a href="/blog/best-claude-code-skills">Claude Code skill</a>: put the expertise in a
        file the agent reads.
      </p>

      <h2>Things to know before you run it</h2>
      <p>
        It uses your subscription's quota, so it will eat into the Claude usage you'd otherwise
        spend coding. Harvey reads your quota and throttles itself (there's a setting to cap it
        at, say, 80% of your daily limit), which is thoughtful, but keep an eye on it the first
        week. Check your provider's terms too. And cold email has real legal rules depending on
        where you and your prospects are; the repo has a section on this and you should read it.
      </p>
      <p>
        If Claude isn't your thing, it also works with a ChatGPT plan through Codex on macOS
        and Linux. It's MIT licensed and very actively maintained, with over 1,200 GitHub stars
        at the time of writing.
      </p>
      <p>
        If you want more of this kind of thing, read how{" "}
        <a href="/blog/claude-code-for-marketers">marketers use Claude Code</a> day to day, or
        see our walkthrough on{" "}
        <a href="/blog/how-to-build-ai-agents-with-claude">building your own agents with Claude</a>.
      </p>
    </>
  );
}
