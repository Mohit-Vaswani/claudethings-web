import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy · ClaudeThings",
  description: "ClaudeThings' 14-day money-back guarantee and how to request a refund.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="July 6, 2026">
      <p className="intro">
        We want you to be happy with ClaudeThings. If it&apos;s not the right fit, we offer a
        straightforward money-back guarantee.
      </p>

      <div className="callout">
        <p>
          <strong>14-day money-back guarantee.</strong> If you&apos;re not satisfied for any reason
          within 14 days of your purchase, email us and we&apos;ll issue a full refund — no
          hoops.
        </p>
      </div>

      <h2>1. Eligibility</h2>
      <ul>
        <li>Requests made within 14 days of the original purchase date are eligible.</li>
        <li>You do not need to provide a reason, though feedback helps us improve.</li>
        <li>
          Refunds apply to the price you paid for the Product through our payment processor.
        </li>
      </ul>

      <h2>2. How to request a refund</h2>
      <p>
        Email us at <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> from the
        address you used at checkout, or include your order/receipt details. We&apos;ll confirm and
        process the refund.
      </p>

      <h2>3. How refunds are issued</h2>
      <p>
        Approved refunds are returned to your original payment method. Depending on your bank or card
        issuer, it may take a few business days for the funds to appear after we process the refund.
      </p>

      <h2>4. After a refund</h2>
      <p>
        Once a refund is issued, your license to use the Product ends and you should remove the
        Product from your projects. Open-source components bundled with the Product remain governed by
        their own licenses.
      </p>

      <h2>5. Questions</h2>
      <p>
        Not sure if you qualify, or having trouble? Just email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> and we&apos;ll sort it
        out.
      </p>
    </LegalLayout>
  );
}
