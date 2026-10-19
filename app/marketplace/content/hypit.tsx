export default function HypitBody() {
  return (
    <>
      <p className="intro">
        Every short-form video that goes viral gets copied within a week. Usually by hand: someone
        watches it twenty times, rebuilds the cuts in CapCut, re-records the voiceover and hopes the
        timing lands. Hypit lets your coding agent do that rebuild for you. You give Claude Code a
        video, and instead of a script summary you get the whole thing back as an editable
        workflow you can re-run with a different host, product or language.
      </p>

      <h2>What Hypit is</h2>
      <p>
        Hypit is a skill plus a small video language for agents. The language is called SVML, and
        the clever bit is that everything in it is anchored to words, not seconds. Captions, B-roll,
        a sound effect, a zoom: each one hangs off a word in the script. So when you rewrite a line
        or translate the whole thing into Spanish, the timing re-flows on its own. Anyone who has
        tried to re-time captions after changing one sentence will get why that matters.
      </p>
      <p>
        You install it once with <code>npx skills add hypit-ai/hypit -g</code>. The first time you
        use it, your agent checks for the Hypit executable and helps set it up. Your video projects
        can live in any folder.
      </p>

      <h2>How you use it</h2>
      <p>Start a session in Claude Code or Codex and ask for what you want:</p>
      <pre>
        <code>/hypit Clone this video: /path/to/video.mp4, and replace the ranking with our product.</code>
      </pre>
      <p>
        Or skip the reference entirely and describe it: "make a ranking video that puts our app in S
        tier." The agent checks your environment, asks for whatever API keys that particular video
        needs, generates the material and builds the composition. You can also start from one of
        the bundled templates.
      </p>
      <p>
        The part people get excited about is variants. Because the output is a composition and not
        a flat MP4, you keep the structure that worked and only regenerate what changes. One winning
        ad becomes fifty different hooks. When it stops performing in two weeks, you re-run it with
        fresh openings and the body stays the same.
      </p>

      <h2>What people build with it</h2>
      <p>
        The README is pretty upfront that this is aimed at performance marketing. Paid social ads
        cloned from something that's already working. TikTok Shop and affiliate videos where the
        format stays and the product changes daily. AI UGC and talking-head clips with word-level
        captions, podcast clips with speaker-aware captions, and localized versions of the same
        video in ten languages.
      </p>
      <p>
        One of the example projects in the repo, a street-interview style clone with an AI host,
        tracked captions, a sound-synced reveal and three remixes, lists its total generation cost
        at $1.09. Your numbers will depend on which models you plug in, but it gives you a sense of
        scale.
      </p>

      <h2>Do you need to pay for AI models?</h2>
      <p>
        Not necessarily, and this surprised me. Hypit itself is free, with no seat pricing, render
        fees or watermark. If a video needs generated footage, voices or images, you pay whichever
        model service you connect (they recommend their own hosted HypiHub, but you can point it at
        your own API or local models). But a workflow can also be built purely from captions, motion
        graphics and code-rendered visuals, and that renders locally without calling a generation
        model at all.
      </p>

      <h2>Read the license before you build a business on it</h2>
      <p>
        Hypit is open source, but it isn't MIT. It uses Apache 2.0 with extra conditions. You can use
        it commercially for your own company and for client work, and the videos you make are
        entirely yours. What you can't do without a commercial license is run it as a multi-tenant
        hosted service for other people, or resell it bundled into your own product. You also have to
        leave the Hypit name and logo in the CLI and run reports. For most marketers and agencies
        that's fine. If you were planning to build "Hypit as a SaaS," it isn't.
      </p>

      <h2>Who it's for</h2>
      <p>
        Growth marketers running paid social, UGC agencies, e-commerce brands and solo creators who
        are comfortable in a terminal. You'll need Node 22.15+ and a coding agent. If you've never
        used Claude Code for marketing work, our guide to{" "}
        <a href="/blog/claude-code-for-marketers">Claude Code for marketers</a> is a good primer.
        With nearly 24,000 GitHub stars at the time of writing, it's one of the most popular agent
        video projects around right now.
      </p>
      <p>
        If you want a launch video for something you built rather than an ad, look at{" "}
        <a href="/marketplace/brag-launch-video-skill">/brag</a> instead. It's simpler and made for
        exactly that. And for more ways to use Claude in marketing, see our list of the{" "}
        <a href="/blog/best-ai-tools-for-marketers">best AI tools for marketers</a>.
      </p>
    </>
  );
}
