export default function ReaBody() {
  return (
    <>
      <p className="intro">
        You're using some app and it does one thing really well. The search is instant, or the
        clipboard keeps formatting perfectly between windows, and you want that in your own
        product. Normally you'd guess. REA lets you ask your agent to actually find out. It's a free
        MCP server that hands Claude Code real reverse engineering tools, so the agent can inspect
        an app without its source code, explain how the feature works, show you the evidence, and
        then build a version for your project.
      </p>

      <h2>What REA does</h2>
      <p>
        REA stands for Reverse Engineer Anything, and the list of targets is long. Native binaries,
        through Hopper, Ghidra or IDA. JavaScript and Electron apps, where it recovers modules,
        imports, source maps, routes and IPC between processes. .NET assemblies, Android APKs via
        JADX, Flutter apps, Go and Rust binaries, WebAssembly, SQLite databases, firmware, saved
        network captures and live websites through a Chrome-family browser.
      </p>
      <p>
        You don't need to know which tool fits which file. You ask a question in plain English, the
        agent calls REA over MCP, REA runs the right analysis and returns findings with the evidence
        attached. The agent then asks follow-ups, explains the behavior, or writes and tests an
        implementation. The same workflows are available as a CLI if you'd rather script it.
      </p>

      <h2>Setting it up</h2>
      <p>With Node.js 22.19+ installed, it's one command:</p>
      <pre>
        <code>npx rea-agents setup</code>
      </pre>
      <p>
        You pick your agents (Claude Code, Codex, Cursor, Gemini CLI and a few others are
        supported), review the config changes it proposes and approve them. It backs up your
        existing config first, which is a nice touch. Restart the agent and you can ask something
        like "understand how search works in the Notes app, show me the evidence, and build a
        similar feature for my project."
      </p>
      <p>
        Static JavaScript and .NET analysis work out of the box. Deep native analysis needs Hopper,
        Ghidra or IDA. Setup can install Hopper for you with your approval, and it uses Ghidra or IDA
        if you already have them. If MCP servers are new to you, our{" "}
        <a href="/blog/best-mcp-servers-for-claude-code">guide to MCP servers for Claude Code</a>{" "}
        explains how they plug in.
      </p>
      <p>
        One practical warning from the project itself: get REA only from the official GitHub repo,
        rea.tools or the <code>rea-agents</code> npm package. A tool that runs disassemblers on your
        machine is exactly the kind of thing someone would clone and backdoor.
      </p>

      <h2>The showcases are worth a look</h2>
      <p>
        The project publishes case studies, and they're more convincing than any feature list. In
        one, REA traces Notion's clipboard bridge from the renderer, through preload and IPC, into
        the main process. In another, it follows a sound call in the old game DX-Ball into its
        stereo panning helper and reconstructs it in C, and the rebuilt version matches the original
        across 3,205 test cases. A third recovers the bullet-ring math from a 16-bit PC-98 game.
        Those are hard problems, and they show the evidence trail rather than just claiming success.
      </p>

      <h2>Who it's for</h2>
      <p>
        Developers who want to understand how a competitor or a favourite tool solves a problem.
        Security researchers and CTF players. People maintaining old software with no source left.
        Modders and game preservation folks. And honestly anyone curious about how the apps on their
        own machine work.
      </p>
      <p>
        Analysis runs locally and REA doesn't upload your target, though whatever your agent sees
        goes to your model provider under its own data policy. Keep that in mind with anything
        sensitive.
      </p>

      <h2>A note on doing this responsibly</h2>
      <p>
        Understanding how something works is not the same as having the right to copy it. Software
        licenses often restrict reverse engineering, and the law varies by country. The repo ships a
        disclaimer for a reason. Using REA to learn a technique and then write your own version is a
        very different thing from lifting someone's code or bypassing their licensing. Stick to the
        first.
      </p>
      <p>
        REA is MIT licensed and moves fast, with frequent releases, so run <code>rea update</code>{" "}
        now and then. If you build apps yourself, pair it with our free{" "}
        <a href="/claude-skill-for-website-security-audit">website security audit skill</a> to see
        your own product the way an outsider would. For more on agents and tools, read{" "}
        <a href="/blog/claude-code-skills-vs-subagents-vs-slash-commands-vs-mcp">
          skills vs subagents vs slash commands vs MCP
        </a>
        .
      </p>
    </>
  );
}
