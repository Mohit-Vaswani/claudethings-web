import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy · Agentary",
  description:
    "Agentary is a digital product delivered instantly, so all sales are final. Here's why, and what we do to make sure you buy with confidence.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="July 10, 2026">
      <p className="intro">
        Agentary is a digital product. The moment you check out, everything is yours: the
        private repository and every file in it, delivered in full. There&apos;s nothing to ship
        back, which is why all sales are final.
      </p>

      <div className="callout">
        <p>
          <strong>All sales are final.</strong> You get instant, complete access at checkout, so a
          purchase can&apos;t be undone once it&apos;s delivered. What we can do is make sure you
          know exactly what you&apos;re buying before you pay, and fix anything that goes wrong
          with the transaction itself.
        </p>
      </div>

      <h2>1. Why we don&apos;t offer refunds</h2>
      <p>
        With a physical product, a refund means sending the item back. With a digital product,
        there&apos;s no way to return what you&apos;ve already downloaded. Once you have the
        repository, you have it for good, and that&apos;s true whether or not money changes hands
        afterward. Rather than pretend otherwise, we&apos;re upfront about it: the trade is
        one-time and final, and we put our effort into making sure you know what you&apos;re
        getting before you commit.
      </p>

      <h2>2. Know exactly what you&apos;re buying</h2>
      <p>
        Nothing inside Agentary is a mystery box. The full contents are listed on the
        What&apos;s inside page, the kits are described individually, and the FAQ covers the
        questions people actually ask before buying. If you want a feel for how we build things,
        try the free tools and prompts on this site first. They&apos;re made the same way as the
        paid product, so they&apos;re an honest preview of what you&apos;d be paying for.
      </p>

      <h2>3. If something goes wrong with your purchase</h2>
      <p>
        A final-sale policy covers the product, not billing mistakes. If you were charged twice,
        charged the wrong amount, or paid and can&apos;t access the repository, that&apos;s on us
        to fix. Email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> with your order details
        and we&apos;ll sort it out, usually within a day.
      </p>

      <h2>4. Not sure yet? Ask first</h2>
      <p>
        If you&apos;re on the fence, email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> before you buy and tell
        us what you&apos;re working on. You&apos;ll get a straight answer. If Agentary
        isn&apos;t a fit for you, we&apos;d rather say so before you pay than after.
      </p>
    </LegalLayout>
  );
}
