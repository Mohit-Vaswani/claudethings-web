import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Legal · AgentsKit",
  description: "Legal information for AgentsKit — terms of service, privacy policy, and refund policy.",
};

export default function LegalPage() {
  return (
    <LegalLayout title="Legal" updated="July 6, 2026">
      <p className="intro">
        The documents below govern your purchase and use of AgentsKit. By buying or using the
        product you agree to them. If anything is unclear, email us at{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> and we&apos;ll help.
      </p>

      <div className="legal-index">
        <a href="/terms">
          <h3>Terms of Service</h3>
          <p>The rules for buying, licensing, and using AgentsKit.</p>
          <span className="arrow">Read Terms →</span>
        </a>
        <a href="/privacy">
          <h3>Privacy Policy</h3>
          <p>What data we collect, how we use it, and your choices.</p>
          <span className="arrow">Read Privacy →</span>
        </a>
        <a href="/refund">
          <h3>Refund Policy</h3>
          <p>Why AgentsKit sales are final, and how to reach us.</p>
          <span className="arrow">Read Refunds →</span>
        </a>
        <a href="/disclaimer">
          <h3>Disclaimer</h3>
          <p>Educational content, no professional advice, and the limits of what we promise.</p>
          <span className="arrow">Read Disclaimer →</span>
        </a>
      </div>

      <div className="callout">
        <p>
          <strong>Unofficial &amp; independent.</strong> AgentsKit is not affiliated with,
          endorsed by, or sponsored by Anthropic. &quot;Claude,&quot; &quot;Claude Code,&quot; and
          &quot;Anthropic&quot; are trademarks of Anthropic.
        </p>
      </div>
    </LegalLayout>
  );
}
