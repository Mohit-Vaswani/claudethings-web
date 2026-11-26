export default function MattPocockSkillsBody() {
  return (
    <>
      <p className="intro">
        Matt Pocock, the TypeScript teacher behind Total TypeScript and AI Hero, put the skills
        he uses every day on GitHub. He calls them "skills for real engineers," and the point is
        right there in the README: real engineering, not vibe coding. They're small, you can
        read each one in a few minutes, and you can change them to fit how you work.
      </p>

      <h2>Why it's different from the big frameworks</h2>
      <p>
        Tools like GSD, BMAD and Spec-Kit try to own your whole process. Matt's argument is that
        when they do, you lose control, and when the process has a bug you can't fix it. His
        skills go the other way. Each one does one job, they compose, and they work with any
        model. If you've bounced off a giant agent framework before, this is the set to try.
      </p>

      <h2>Start with /grill-me</h2>
      <p>
        His most popular skill is also the simplest idea. The most common way an agent fails
        is that it builds something you didn't actually want. So before any code,{" "}
        <code>/grill-me</code> has the agent interview you, relentlessly, about the plan until
        every branch of the decision tree is settled. It feels slow the first time. Then you
        notice how much rework it saved.
      </p>
      <p>
        <code>/grill-with-docs</code> does the same thing for code work and adds the trick Matt
        says might be the coolest in the repo: it builds a shared language for your project in
        a <code>GLOSSARY.md</code> file, and records hard decisions as ADRs. His example: instead
        of "there's a problem when a lesson inside a section of a course is made real (given a
        spot in the file system)," the agent can say "there's a problem with the
        materialization cascade." Shorter prompts, shorter answers, more consistent names in
        the code, fewer tokens spent thinking.
      </p>

      <h2>The rest of the set</h2>
      <p>
        The engineering skills follow a real workflow. <code>/to-spec</code> turns a
        conversation into a spec and files it in your issue tracker. <code>/to-tickets</code>{" "}
        breaks a plan into small tickets with their dependencies marked.{" "}
        <code>/implement</code> builds from a spec using a red-green-refactor TDD loop and ends
        with a code review. <code>/tdd</code> and <code>/diagnosing-bugs</code> are the
        disciplined loops underneath. And{" "}
        <code>/improve-codebase-architecture</code> scans your code for places where a module
        could be deeper and simpler, then walks you through the one you pick. He suggests
        running it every few days, and he's clear it finds candidates, it doesn't untangle a
        mess for you.
      </p>
      <p>
        There are non-coding ones too. <code>/handoff</code> compacts a conversation into a
        document another agent can pick up. <code>/teach</code> teaches you a topic over
        several sessions. <code>/wait-what</code> is for the moment the agent says something
        you don't follow: it re-explains in plain English, using your glossary. Tiny skill,
        very good idea.
      </p>

      <h2>Install</h2>
      <p>
        In Claude Code it's one line:{" "}
        <code>claude plugin install mattpocock-skills@claude-plugins-official</code>, and it
        updates itself. There are plugin routes for Codex and GitHub Copilot, a Gemini CLI
        command, and <code>npx skills@latest add mattpocock/skills</code> for everything else if
        you'd rather have editable files. Pick one per agent, or you'll get every skill twice.
      </p>
      <p>
        Then run <code>/setup-matt-pocock-skills</code> once per repo. It asks which issue
        tracker you use (GitHub, GitLab, local files), what triage labels you apply, and where
        docs should go.
      </p>

      <h2>Who it's for</h2>
      <p>
        Working developers who already know how they like to build and want their agent to
        follow along rather than take over. It's MIT licensed and, at around 333,000 GitHub
        stars at the time of writing, one of the most-starred skill repos anywhere. If you want
        to write your own skills in the same style, Matt includes a{" "}
        <code>writing-for-agents</code> skill, and our guide on{" "}
        <a href="/blog/how-to-write-a-claude-code-skill-that-triggers">
          writing a Claude Code skill that triggers
        </a>{" "}
        covers the rest. For a heavier, all-in-one option, compare{" "}
        <a href="/marketplace/ecc-claude-code-agent-harness">ECC</a>.
      </p>
    </>
  );
}
