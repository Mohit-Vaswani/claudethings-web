export default function GeoSeoBody() {
  return (
    <>
      <p className="intro">
        A growing share of people never see a page of blue links anymore. They ask ChatGPT,
        Perplexity or Google's AI Overview and read whatever it cites. If your site isn't one
        of those citations, you're invisible for that query, no matter where you rank.
        geo-seo-claude is a free Claude Code skill built for that problem. It audits a website
        for AI search first and classic SEO second, and gives you a fix list you can act on.
      </p>

      <h2>What GEO means, quickly</h2>
      <p>
        GEO stands for generative engine optimization. Traditional SEO asks "will Google rank
        this page?" GEO asks "will an AI model quote this page when someone asks a question?"
        The two overlap a lot (crawlability, structured data, good content) but they aren't the
        same. AI engines prefer passages that answer a question on their own, they lean heavily
        on brand mentions in places like Reddit, YouTube and Wikipedia, and a surprising number
        of sites block AI crawlers in robots.txt without realising it.
      </p>

      <h2>What the skill checks</h2>
      <p>
        Run <code>/geo audit https://yoursite.com</code> and it fetches your homepage, works
        out what kind of business you are, crawls the sitemap, then launches five subagents at
        the same time. One looks at AI visibility (citability, crawlers, llms.txt, brand
        mentions). One checks readiness for specific platforms like ChatGPT, Perplexity and
        Google AI Overviews. The others cover technical SEO, content quality and E-E-A-T, and
        schema markup. Everything rolls up into one GEO score out of 100.
      </p>
      <p>
        The weighting is out in the open, which I appreciate. AI citability counts for 25%,
        brand authority 20%, content quality 20%, technical foundations 15%, and structured data
        and platform optimization 10% each. You can disagree with the weights, but at least you
        know what you're arguing with.
      </p>
      <p>
        A few of the individual commands are useful on their own, too:
      </p>
      <ul>
        <li>
          <code>/geo quick</code> gives you a 60 second snapshot when you just want a gut check.
        </li>
        <li>
          <code>/geo crawlers</code> reads your robots.txt against 14+ AI bots, including
          GPTBot, ClaudeBot and PerplexityBot, and tells you which ones you're blocking.
        </li>
        <li>
          <code>/geo llmstxt</code> checks or writes an llms.txt file, the plain-text map of
          your site that AI tools can read.
        </li>
        <li>
          <code>/geo citability</code> scores your content blocks. The skill's view is that the
          passages AI tools like to quote run about 134 to 167 words and answer one question
          completely.
        </li>
        <li>
          <code>/geo schema</code> finds missing structured data and generates the JSON-LD.
        </li>
      </ul>

      <h2>Reports you can hand to a client</h2>
      <p>
        This is where it goes beyond a hobby script. <code>/geo report</code> writes a
        client-ready markdown report, and <code>/geo report-pdf</code> produces a proper PDF
        with score gauges, charts and a prioritized action plan. There are also commands for
        tracking prospects, drafting proposals and comparing results month over month. It's
        pretty clearly built with SEO freelancers and small agencies in mind, and the author
        runs a community that teaches how to sell GEO audits as a service. You don't need any
        of that to use the tool. It's MIT licensed and free.
      </p>

      <h2>Installing it</h2>
      <p>
        On macOS or Linux it's one line, and Windows works through Git Bash:
      </p>
      <pre>
        <code>
          curl -fsSL https://raw.githubusercontent.com/zubair-trabzada/geo-seo-claude/main/install.sh | bash
        </code>
      </pre>
      <p>
        You need Python 3.10+, Git and Claude Code. The installer puts its Python dependencies
        in a separate virtual environment inside <code>~/.claude/skills/geo/</code>, so it
        doesn't mess with your system Python, and the uninstaller removes it cleanly. As with
        any install script piped into bash, it's worth opening the script and reading it first.
        It's short.
      </p>

      <h2>My honest take</h2>
      <p>
        Some of the stats in the README (traffic growth percentages, market size projections)
        are the kind of numbers that float around GEO marketing, so take those with a pinch of
        salt. The tool itself is solid. The crawler check and llms.txt generator alone will
        catch real problems on most sites in a couple of minutes, and the full audit gives you a
        sensible to-do list instead of a 90-page dump. With over 11,000 GitHub stars at the time
        of writing, plenty of people seem to agree.
      </p>
      <p>
        It pairs well with our free{" "}
        <a href="/claude-skill-for-website-security-audit">website security audit skill</a>,
        since a site that leaks headers or serves mixed content has bigger problems than its
        GEO score. For more marketing tools, see our list of the{" "}
        <a href="/blog/best-ai-tools-for-marketers">best AI tools for marketers</a> and the{" "}
        <a href="/blog/claude-code-for-marketers">Claude Code for marketers</a> guide.
      </p>
    </>
  );
}
