export default function BragBody() {
  return (
    <>
      <p className="intro">
        Here's a pattern you might recognize. You spend three weekends building something, it
        finally works, and then you post a screenshot and one sentence on X because making a
        proper launch video feels like a whole second project. /brag exists to kill that
        moment. You type one command inside your project and get a short launch video back,
        with music, motion and the copy to post alongside it.
      </p>

      <h2>How it works</h2>
      <p>
        /brag is an agent skill, so it runs inside the coding agent you already use. When you
        say <code>let's /brag</code>, it looks at the project you're sitting in, works out what
        the product actually does and who it's for, and decides which moments are worth
        showing. That's the story part, and that's the job the skill owns.
      </p>
      <p>
        Then it hands a focused brief to Hyperframes, HeyGen's video framework, which builds the
        scenes, times them to the music and renders the file. You end up with a{" "}
        <code>brag-output/</code> folder holding the plan, the composition brief, share copy for
        your post, and the finished <code>brag.mp4</code>. The looping video on the project's
        own launch site was made by running /brag on its own repo, which is a nice bit of
        dogfooding.
      </p>
      <p>
        You can steer the tone, too. The README's example is{" "}
        <code>/brag --tone "fake Series A launch from 2016"</code>, and yes, that's exactly
        as cringe-perfect as it sounds. Voiceover is off by default. Add <code>--voice</code> if
        you want narration.
      </p>

      <h2>/brag vs /brag-slim</h2>
      <p>
        There are two versions now. The original uses Hyperframes plus a bundle of music and
        sound effects. The newer <code>/brag-slim</code> is a single-file skill rebuilt for
        Claude Opus 5.5: no Hyperframes, no bundled assets, same creative rules, and it still
        writes a soundtrack and share copy for your specific project. On Opus 5.5, /brag
        switches to the slim version on its own. Run <code>/brag --full</code> if you want the
        classic workflow back.
      </p>
      <p>
        If you don't want to run anything locally, the authors also have a hosted version at
        letsbrag.app where you paste a link and get a video. The skill itself stays free and
        open source.
      </p>

      <h2>Installing it</h2>
      <p>In Claude Code it's two commands:</p>
      <pre>
        <code>{`/plugin marketplace add latent-spaces/brag
/plugin install brag@brag`}</code>
      </pre>
      <p>
        For Cursor, Codex, Copilot, Gemini CLI or opencode, the{" "}
        <code>npx skills add https://github.com/latent-spaces/brag --skill brag</code> route
        works across all of them. The full version needs Node.js 22+, FFmpeg on your PATH and
        the Hyperframes CLI (<code>npx hyperframes doctor</code> tells you if anything is
        missing). If plugin marketplaces are new to you, we wrote up{" "}
        <a href="/blog/claude-skills-marketplace">how Claude skill marketplaces work</a> and{" "}
        <a href="/blog/claude-skills-github">how to install skills straight from GitHub</a>.
      </p>

      <h2>Who should use it</h2>
      <p>
        Indie hackers, side-project people, anyone doing a Product Hunt launch or a "Show HN."
        Also developer-tool teams who ship small features weekly and never have a designer free
        to cut a clip for each one. A 20 second video with motion gets noticeably more
        attention in a feed than a static screenshot, and it takes /brag minutes instead of an
        afternoon in a video editor.
      </p>
      <p>
        It won't replace a real motion designer for your big funding announcement, and I
        wouldn't pretend otherwise. What it does is make "good enough to post" free. For most
        launches that's the gap that actually matters, because the alternative usually isn't a
        professional video. It's no video at all.
      </p>

      <h2>Why it took off</h2>
      <p>
        At the time of writing the repo has more than 16,000 stars on GitHub, which is a lot
        for a skill. I think the reason is simple. Coding agents made building fast, and the
        bottleneck moved to telling people about it. /brag goes after that second half. It's
        MIT licensed, and the bundled music and sound effects come from ende.app and Kenney,
        both credited in the repo.
      </p>
      <p>
        Once the video is out, the next problem is where to post it. Our guide on{" "}
        <a href="/blog/mention-your-product-on-reddit-without-getting-banned">
          mentioning your product on Reddit without getting banned
        </a>{" "}
        is a good next read. And if you're just getting set up, start with{" "}
        <a href="/blog/getting-started-with-claude-code">getting started with Claude Code</a>.
      </p>
    </>
  );
}
