export default function CloudflareSecurityAuditBody() {
  return (
    <>
      <p className="intro">
        Ask an AI agent to "find security bugs" and you usually get a confident list where half
        the findings are wrong. Cloudflare's security-audit skill is built around that problem.
        It's the skill that seeded Cloudflare's own vulnerability-hunting system, released free
        under MIT, and its core rule is simple: the agent that finds a bug is never the agent
        that confirms it.
      </p>

      <h2>How an audit runs</h2>
      <p>
        You open your coding agent in a repo and say "security audit this codebase." The skill
        then runs six phases, each with its own isolated agents.
      </p>
      <p>
        First, reconnaissance. It maps the architecture, the trust boundaries and every place
        input comes in, and writes that down in <code>architecture.md</code> plus a coverage
        ledger. Then hunters go after specific parts of the code, each one recording what it
        checked, while "coverage critics" look for the gaps nobody covered. Every candidate
        bug then goes to a fresh verifier whose job is to disprove it. What survives is written
        to <code>findings.json</code>, validated against a schema, and checked once more by
        another independent agent before the final <code>REPORT.md</code> gets written.
      </p>
      <p>
        Each finding ends up in one of three states. <code>confirmed</code> means there's a
        complete trace through the source and an observed result. <code>needs_validation</code>{" "}
        means the agent got close but one exact fact is still unresolved, and it says which
        fact. <code>rejected</code> means someone tried to prove it and couldn't. I like that
        middle bucket a lot. It's an honest "we don't know yet" instead of a made-up severity.
      </p>

      <h2>It knows what to look for</h2>
      <p>
        The hunting guides are where Cloudflare's experience shows. There are separate playbooks
        for web protocols and auth, client-side and browser bugs, cloud and deployment config,
        supply chain and release pipelines, RPC and message queues, multi-tenant data
        isolation, desktop and mobile apps, memory safety in native code, and prompt injection
        in LLM-backed apps. The skill picks the ones that fit your target.
      </p>
      <p>
        It's also strict about what counts. Severity has to come from real impact, not from
        breaking a checklist. And if one layer already blocks an attack, a missing second layer
        is filed as a hardening note, not a vulnerability. That alone cuts a lot of the noise
        you get from generic scanners.
      </p>

      <h2>Run it more than once</h2>
      <p>
        Runs are additive. The second audit reads the first one's ledger and findings, goes
        after the gaps, and re-checks code that changed. Cloudflare says that in their tests a
        single run found roughly half of the vulnerabilities that repeated runs found in total.
        So budget for several passes on anything that matters, and expect it to use a fair
        amount of your agent's quota each time.
      </p>

      <h2>Install and requirements</h2>
      <p>
        Install with{" "}
        <code>
          npx skills add https://github.com/cloudflare/security-audit-skill --skill
          security-audit
        </code>{" "}
        (add <code>--global</code> for all projects). You need an agent and model that support
        tool use and parallel subagents (Claude Code is the obvious fit) and Node.js for the
        validators.
      </p>
      <p>
        One requirement people will skip and shouldn't: if you want it to actually run the
        target's code, builds or tests, it expects an OS-level sandbox with no outside network
        and writes limited to scratch folders. Without that, it won't execute anything and
        leaves those leads as <code>needs_validation</code>. That's the right call. Output goes
        to <code>~/security-audit-skill/&lt;repo-name&gt;/</code> by default, outside your repo.
      </p>

      <h2>Who it's for</h2>
      <p>
        Engineering teams that want a serious code-level audit before a launch or a pen test,
        and security folks who want an agent that shows its work. Only point it at code you own
        or have permission to test. If what you need is a quicker check of a live website
        (headers, HTTPS, exposed files, leaked keys), our free{" "}
        <a href="/claude-skill-for-website-security-audit">website security audit skill</a> is
        built for that, and the two work well together. It had about 78,000 GitHub stars at the
        time of writing, and Cloudflare's blog post "Build your own vulnerability harness"
        explains how it grew into their fleet-wide system.
      </p>
    </>
  );
}
