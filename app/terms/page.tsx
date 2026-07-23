import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms of Service · Agentary",
  description: "The terms that govern your purchase and use of Agentary.",
};

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="July 6, 2026">
      <p className="intro">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use of Agentary
        (the &quot;Product&quot;), including all agents, skills, commands, templates, and
        documentation included with it. By purchasing, downloading, or using the Product, you agree
        to these Terms. If you do not agree, do not use the Product.
      </p>

      <h2>1. What you&apos;re buying</h2>
      <p>
        Agentary is a curated distribution of AI engineering and marketing tooling for Claude
        Code. Your purchase grants you a license to use the Product; it is not a subscription and
        does not transfer ownership of any underlying software.
      </p>

      <h2>2. License</h2>
      <p>
        Subject to these Terms and payment of the applicable fee, we grant you a worldwide,
        non-exclusive, non-transferable license to install and use the Product in your own projects,
        including commercial projects.
      </p>
      <ul>
        <li>You may use the Product across your own and your clients&apos; projects.</li>
        <li>You may modify the included files for your own use.</li>
        <li>
          You may <strong>not</strong> resell, redistribute, or republish the Product as a competing
          product or as a standalone bundle.
        </li>
        <li>
          Individual bundled components sourced from open-source projects remain governed by their
          own licenses (MIT/Apache-2.0 and others), with attribution preserved in the Product&apos;s
          CREDITS file.
        </li>
      </ul>

      <h2>3. Third-party services</h2>
      <p>
        The Product is designed to run with Claude Code and may interact with third-party services
        (including Anthropic&apos;s Claude and our payment processor, Polar). Your use of those
        services is governed by their own terms. We are not responsible for third-party services and
        do not control their availability, pricing, or behavior.
      </p>
      <div className="callout">
        <p>
          <strong>Unofficial &amp; independent.</strong> Agentary is not affiliated with,
          endorsed by, or sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
          &quot;Anthropic&quot; are trademarks of Anthropic.
        </p>
      </div>

      <h2>4. Payment</h2>
      <p>
        Agentary is sold as a one-time payment via our payment processor. Prices are shown at
        checkout and may change over time; the price you pay is the price displayed at the time of
        purchase. Lifetime updates, where advertised, refer to the version line you purchased.
      </p>

      <h2>5. Refunds</h2>
      <p>
        Agentary is a digital product delivered instantly, so all sales are final and
        purchases are non-refundable. See our <a href="/refund">Refund Policy</a> for full details.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to use the Product to:</p>
      <ul>
        <li>Violate any law or the rights of others.</li>
        <li>Build or distribute malware, spam, or content that infringes intellectual property.</li>
        <li>Attempt to resell or relicense the Product in violation of Section 2.</li>
      </ul>

      <h2>7. Disclaimer of warranties</h2>
      <p>
        The Product is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as
        available&quot;</strong> without warranties of any kind, whether express or implied,
        including fitness for a particular purpose and non-infringement. Output generated with the
        help of the Product should be reviewed by you before use; you are responsible for what you
        ship.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, Agentary and its operators will not be liable for
        any indirect, incidental, special, or consequential damages, or for lost profits or data,
        arising from your use of the Product. Our total liability for any claim will not exceed the
        amount you paid for the Product.
      </p>

      <h2>9. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. Material changes will be reflected by the
        &quot;Last updated&quot; date above. Your continued use of the Product after changes take
        effect constitutes acceptance.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
