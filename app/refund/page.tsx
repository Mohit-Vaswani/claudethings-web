import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy · ClaudeThings",
  description:
    "ClaudeThings is a digital product delivered instantly, so all sales are final.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="July 10, 2026">
      <p className="intro">
        ClaudeThings is a digital product that&apos;s delivered to you in full the moment your
        purchase is complete. Because of that, all sales are final.
      </p>

      <div className="callout">
        <p>
          <strong>All sales are final.</strong> Since ClaudeThings is a digital product delivered
          instantly and in its entirety at checkout, we&apos;re unable to offer refunds once a
          purchase has been made.
        </p>
      </div>

      <h2>1. Why refunds aren&apos;t offered</h2>
      <p>
        The moment you check out, you receive immediate access to the complete Product — including
        the private repository and every included file. Because a digital product can&apos;t be
        &quot;returned&quot; once it has been delivered, purchases are non-refundable.
      </p>

      <h2>2. Before you buy</h2>
      <p>
        We want you to buy with confidence, so please review everything on this site — what&apos;s
        included, the details, and the FAQ — before completing your purchase. If anything is
        unclear, reach out first and we&apos;ll gladly answer your questions.
      </p>

      <h2>3. A problem with your purchase?</h2>
      <p>
        If you were charged incorrectly, bought by mistake (for example, a duplicate charge), or
        can&apos;t access what you paid for, email us at{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> and we&apos;ll make it
        right.
      </p>

      <h2>4. Questions</h2>
      <p>
        Have a question before buying? Just email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> and we&apos;ll help you
        decide whether ClaudeThings is right for you.
      </p>
    </LegalLayout>
  );
}
