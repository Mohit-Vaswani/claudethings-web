import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import ArticlePage from "../../components/ArticlePage";
import { getPost } from "../blogData";

const post = getPost("mention-your-product-on-reddit-without-getting-banned")!;
const URL = `https://agentskit.co/blog/${post.slug}`;

export const metadata: Metadata = {
  title: `${post.title} — AgentsKit`,
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: post.title,
    description: post.description,
    type: "article",
    url: URL,
    images: [{ url: ogImage(post.title, post.tag), width: 1200, height: 630, alt: post.title }],
  },
  twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [ogImage(post.title, post.tag)] },
};

const articleLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.description,
  url: URL,
  author: { "@type": "Organization", name: "AgentsKit" },
  publisher: { "@type": "Organization", name: "AgentsKit", url: "https://agentskit.co" },
};

export default function Page() {
  return (
    <ArticlePage
      crumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: "Marketing" }]}
      eyebrow="For founders & marketers"
      title={post.title}
      meta={[post.date, post.readingTime, "Copy-paste prompt inside"]}
      jsonLd={[articleLd]}
      related={[
        {
          href: "/blog/claude-code-for-marketers",
          title: "Claude Code for Marketers",
          desc: "Turn Claude into a content pipeline that works on your files, not in a chat window.",
        },
        {
          href: "/blog/10-prompting-techniques-for-claude",
          title: "10 Prompting Techniques for Claude",
          desc: "The techniques that make prompts like the one in this post actually work.",
        },
        {
          href: "/blog/claude-md-best-practices-template",
          title: "CLAUDE.md Best Practices",
          desc: "Teach Claude your product and voice once, and it remembers for every post.",
        },
      ]}
    >
      <p className="intro">
        You built something you&apos;re proud of. Reddit is full of people with the exact problem
        your product solves. So you write a post, hit submit&hellip; and an hour later it&apos;s gone
        — removed by a mod, buried at zero, or worse, your account is shadow-banned and you don&apos;t
        even know it. If that&apos;s happened to you, you&apos;re not doing anything unusually wrong.
        You&apos;re just posting the way Reddit is specifically built to reject.
      </p>

      <h2>The real problem: Reddit hates ads, and your post smells like one</h2>
      <p>
        Reddit isn&apos;t a billboard. It&apos;s thousands of communities that each spent years
        building trust, and they are ruthless about protecting it. Every subreddit has volunteer
        moderators, automod filters, and — most importantly — regular members who can smell a pitch
        from the first sentence. When your post trips any of those tripwires, it gets removed before
        it ever reaches the people you wanted to help.
      </p>
      <p>Here&apos;s what actually gets posts killed:</p>
      <ul>
        <li>
          <strong>You lead with the product.</strong> &quot;Hey everyone, I built [X] that
          does [Y]&quot; reads as an ad in the first six words, and both automod and humans react
          the same way.
        </li>
        <li>
          <strong>Your account has no history.</strong> A three-day-old account with 1 karma
          dropping links is the single clearest bot/spam signal there is. Many subs auto-remove
          posts below a karma or account-age threshold before a human ever sees them.
        </li>
        <li>
          <strong>You ignored the subreddit&apos;s rules.</strong> Lots of subs ban self-promotion
          outright, or only allow it on a specific day or in a specific megathread. Post anywhere
          else and it&apos;s an instant removal — sometimes a ban.
        </li>
        <li>
          <strong>You gave nothing before you asked for something.</strong> Reddit runs on a
          give-first culture. A post that only benefits <em>you</em> — clicks, signups, installs —
          has no reason to exist in the community&apos;s eyes.
        </li>
        <li>
          <strong>It doesn&apos;t sound like a person.</strong> Marketing voice (&quot;revolutionize
          your workflow,&quot; &quot;game-changer,&quot; &quot;seamless&quot;) is a dead giveaway.
          Redditors write like humans venting, joking, and being specific.
        </li>
      </ul>
      <p>
        The fix isn&apos;t to hide your product. It&apos;s to write a post that would be
        <em> genuinely worth reading even if the product didn&apos;t exist</em> — a real story, a
        real lesson, a real question — where your product shows up naturally as one honest detail,
        not the point. That&apos;s hard to do about your own thing, because you&apos;re too close to
        it. Which is exactly where Claude helps.
      </p>

      <h2>The Claude prompt that writes it for you</h2>
      <p>
        Paste the prompt below into Claude. Notice what it does differently from &quot;write me a
        Reddit post&quot;: it <strong>interviews you first</strong>. It asks for your website, your
        account karma, and what you actually want out of the post, then adapts the whole strategy to
        your answers — including telling you honestly when your karma is too low to post a link at
        all. Then it writes the post.
      </p>

      <div className="prompt-card">
        <div className="prompt-head">
          <span className="p-title">prompt — paste into Claude</span>
        </div>
        <pre className="prompt-body">{`You are a Reddit-native growth strategist who has helped
founders mention their products on Reddit without getting
removed, downvoted, or banned. You understand that Reddit
rewards value first and punishes anything that smells like an ad.

Before you write anything, INTERVIEW me. Ask me these questions
one message at a time (wait for my answer before the next), and
adapt your follow-ups to what I say:

1. What's your product, your website, and in one plain sentence,
   what problem does it solve? (No marketing words.)
2. What's your Reddit account karma and roughly how old is the
   account? (Be honest — this changes the strategy.)
3. Which subreddit(s) are you thinking of posting in? If you're
   not sure, tell me your audience and I'll suggest some.
4. What's your goal for this post — feedback, first users,
   traffic, awareness, or genuinely just helping people?
5. Any real story, struggle, or lesson behind why you built this?
   (This is the gold. Even a small one.)
6. Preferred tone: casual, technical, funny, blunt, story-driven?

Once you have my answers, do the following:

A) KARMA + RULES CHECK. Based on my karma and account age, tell
   me honestly whether I can safely post a link now, whether I
   should build karma first (and how), or whether I should post
   with NO link and let people ask. Never encourage me to break a
   subreddit's self-promotion rules — flag when I need to read
   them or use a designated promo thread/day.

B) STRATEGY. In 2-3 lines, tell me the angle you'll use and why
   it fits that subreddit's culture.

C) THE POST. Write a Reddit post that:
   - Leads with value, a story, or a real question — NOT the product.
   - Sounds like a specific human, not a brand. No buzzwords, no
     "revolutionize," no "seamless," no hype.
   - Mentions the product ONCE, naturally, low-key, and only if it
     genuinely fits. If karma/rules make a link risky, leave the
     product out of the body and add a note on how to mention it
     if someone asks.
   - Gives more than it asks for.
   Provide a title (with 2 alternates) and the body, formatted the
   way Redditors actually write (short paragraphs, plain language).

D) SAFETY NOTES. List what could still get this removed in that
   specific sub, and 3 rules of thumb for engaging in the comments
   after posting (reply like a person, don't get defensive, thank
   critics).

Start by asking me question 1 now.`}</pre>
      </div>

      <p>
        Because the prompt makes Claude ask before it writes, you don&apos;t get a generic ad. You
        get a post tuned to <em>your</em> account, <em>your</em> subreddit, and <em>your</em> real
        story — the three things that decide whether it survives.
      </p>

      <h2>Why the karma question matters so much</h2>
      <p>
        Most &quot;how to post on Reddit&quot; advice skips the single most common reason posts
        vanish: the account. This prompt makes it question two on purpose. If you tell Claude
        you&apos;re on a brand-new account with 2 karma, a good strategist doesn&apos;t hand you a
        link-drop — it tells you to spend a week being a normal, helpful member first, and writes you
        a link-free post so you don&apos;t burn the subreddit on day one. That honesty is what keeps
        you out of the shadow-ban zone.
      </p>

      <h2>A quick before / after</h2>
      <p>
        <strong>What gets removed:</strong> &quot;🚀 Introducing [Product] — the all-in-one tool to
        supercharge your workflow. Sign up free at [link]!&quot; Deleted in minutes.
      </p>
      <p>
        <strong>What survives:</strong> &quot;I wasted three months manually tracking this before I
        snapped and built a tiny script for it. Here&apos;s the exact workflow that finally worked
        — happy to share the whole thing.&quot; People ask what you used. <em>Then</em> you mention
        the product, in a comment, because someone invited it. That&apos;s the whole game.
      </p>

      <h2>The mindset to keep</h2>
      <ul>
        <li>
          <strong>Read the sidebar and rules first.</strong> Every time. It takes 60 seconds and
          saves you a ban.
        </li>
        <li>
          <strong>Be a member before you&apos;re a marketer.</strong> Comment helpfully for a while.
          Reddit rewards accounts that give.
        </li>
        <li>
          <strong>One mention, max.</strong> If the product is the point of the post, you&apos;ve
          already lost.
        </li>
        <li>
          <strong>Show up in the comments as a human.</strong> Thank critics, answer questions, drop
          the sales voice entirely.
        </li>
      </ul>

      <div className="callout">
        <p>
          <strong>Want this as a repeatable workflow, not a one-off paste?</strong> Our Marketing
          Kit turns prompts like this into saved Claude Code commands — a{" "}
          <code>/reddit-post</code> you run any time, that already knows your product, your voice,
          and your rules. <a href="/#pricing">See the Marketing Kit →</a>
        </p>
      </div>

      <h2>FAQ</h2>
      <div className="faq" style={{ marginTop: 22 }}>
        <details className="q">
          <summary>
            Is mentioning my product on Reddit against the rules? <span className="plus">+</span>
          </summary>
          <div className="a">
            Not inherently — but it&apos;s tightly controlled. Reddit&apos;s sitewide guideline is
            roughly the &quot;9:1 rule&quot;: for every self-promotional post, you should have far
            more non-promotional activity. On top of that, each subreddit sets its own rules, and
            many restrict or ban self-promotion entirely. Always read the specific sub&apos;s rules;
            the prompt above bakes that check in.
          </div>
        </details>
        <details className="q">
          <summary>
            How much karma do I need before I can post a link? <span className="plus">+</span>
          </summary>
          <div className="a">
            There&apos;s no universal number — each subreddit sets its own minimum, and some don&apos;t
            publish it. As a rule of thumb, a well-established account with a few hundred karma and
            some genuine comment history has far fewer problems than a fresh one. If you&apos;re low,
            spend a week commenting helpfully first. When you tell Claude your karma, it&apos;ll give
            you a realistic call for your situation.
          </div>
        </details>
        <details className="q">
          <summary>
            What if my post still gets removed? <span className="plus">+</span>
          </summary>
          <div className="a">
            Don&apos;t repost the same thing — that&apos;s a fast track to a ban. Check whether it was
            automod (often a karma/age filter) or a human mod. You can politely message the mods to
            ask why; sometimes they&apos;ll point you to the right thread or day. Otherwise, build
            more account history and try a different angle. The removal is feedback, not a verdict.
          </div>
        </details>
        <details className="q">
          <summary>
            Won&apos;t people see through an AI-written post? <span className="plus">+</span>
          </summary>
          <div className="a">
            They&apos;ll see through a lazy one. The reason this prompt interviews you for a real
            story and your actual tone is so the post is grounded in true details only you know —
            that&apos;s what makes it read as human. Always edit the draft in your own voice before
            posting, and never invent a story that didn&apos;t happen. Redditors punish fakes hardest
            of all.
          </div>
        </details>
      </div>
    </ArticlePage>
  );
}
