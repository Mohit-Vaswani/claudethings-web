export default function ApiAnythingBody() {
  return (
    <>
      <p className="intro">
        Watch an AI agent use a website through a browser and you'll notice how slow it is. It loads
        the page, takes a snapshot, reads a wall of HTML, clicks, waits, reads again. Meanwhile the
        site's own frontend got the same data with one request. API Anything takes that shortcut.
        It teaches your agent a website once, and from then on the agent calls the site like an API
        and gets JSON back, no browser needed.
      </p>

      <h2>How it learns a site</h2>
      <p>
        You give it a page URL with a placeholder and two example inputs. A headless browser loads
        the page once for each example and records the network requests the page makes. Whatever
        changed between the two requests is clearly your input, so that becomes a parameter. The rest
        is stored as a template. Cookies and tokens are saved as references to a local store, never
        as values inside the template. Building the template doesn't use an LLM at all.
      </p>
      <p>
        After that, a call is just Node's <code>fetch</code> with the slots filled in. If the site
        blocks plain requests, it fetches from inside a browser page instead. As a last resort for
        reads, it runs the page itself and reads the response the page got.
      </p>
      <p>
        The bit I like most is the repair step. Sites change. An id rotates, a field moves. When a
        call stops working, API Anything re-learns the request and only saves the new version after
        a replay succeeds. If it can't fix it, you get an error with a reason and a suggested next
        step, not somebody else's data or a silent wrong answer.
      </p>

      <h2>Is it actually faster?</h2>
      <p>
        The repo has a benchmark, and the method and raw numbers are published, which I appreciate.
        Same agent, same prompt, a Google Flights task: one agent drove headless Chrome through
        Playwright MCP, the other called API Anything. Across five runs per task, the API Anything
        agent answered 1.5 to 2 times sooner, read about half as many tokens, and cost the same or
        less. All 20 answers were correct.
      </p>
      <p>
        The Goodreads test is more striking. Goodreads hasn't had a public API since 2020. The agent
        mapped search, book details, author lists and reviews in one run that took 6.3 minutes and
        cost $1.19. Looking up five books then took 30.5 seconds, against 182.5 seconds for a browser
        agent. And a plain script with no model at all built the same five-book table in 16 seconds.
      </p>

      <h2>What comes included</h2>
      <p>
        It ships with 22 read operations across 9 sites: Google Flights (search, top flights, price
        calendar), Hacker News, X and Instagram profiles, search on YouTube, Airbnb and Amazon,
        LinkedIn profiles and companies with your own login, and the Goodreads operations above.
        These cover selected features, not entire sites. For anything else you teach it yourself, or
        tell your agent what you need and let the bundled skill propose operations, wait for your
        approval, build them and test each one on an input it hasn't seen.
      </p>

      <h2>Installing it</h2>
      <p>
        It isn't on npm yet. The easy route is to paste this into Claude Code or Codex and let the
        agent handle it:
      </p>
      <pre>
        <code>Set up API Anything for me: https://github.com/goodnight000/api-anything/blob/main/INSTALL.md</code>
      </pre>
      <p>
        The agent checks for Node 22.13+, builds and installs the <code>api-anything</code> command,
        confirms a call works and connects the MCP server and skill. Over MCP your agent gets four
        tools: <code>list_sites</code>, <code>list_operations</code>, <code>call_operation</code> and{" "}
        <code>login</code>. Creating new operations needs a shell and a Chromium-based browser. If
        you'd rather read the install file before an agent runs it (a good habit), it's short. Our
        guide to <a href="/blog/claude-skills-github">installing Claude skills from GitHub</a> covers
        what to look for.
      </p>

      <h2>Limits, and being a good citizen</h2>
      <p>
        It's a local tool, not a hosted API. It uses your machine, your network and your logins. It
        won't solve CAPTCHAs, and if a site challenges real Chrome you'll need to clear that by hand.
        No write operations are bundled, and writes you build yourself need an explicit{" "}
        <code>--allow-writes</code> flag. Credentials stay in <code>~/.api-anything</code>.
      </p>
      <p>
        The README is clear that you're responsible for following each site's terms, and that's
        worth taking seriously. Pulling your own data or looking up a few flights is one thing.
        Hammering a site or scraping accounts at scale is another.
      </p>
      <p>
        If you build agents that touch the web a lot, this belongs in your toolkit. It's MIT licensed
        and sits nicely next to the servers in our{" "}
        <a href="/tools/claude-mcp-servers">MCP server guide</a>. For the bigger picture, read{" "}
        <a href="/blog/how-to-build-ai-agents-with-claude">how to build AI agents with Claude</a>.
      </p>
    </>
  );
}
