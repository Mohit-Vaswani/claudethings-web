import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Refund Policy · AgentsKit",
  description:
    "AgentsKit comes with a 14-day money-back guarantee, no questions asked. Here's how it works and how to request a refund.",
};

export default function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="August 14, 2026">
      <p className="intro">
        Every AgentsKit purchase is covered by a 14-day money-back guarantee. Use it on real work,
        and if it doesn&apos;t earn its keep, email us within 14 days of your purchase and
        we&apos;ll refund you in full.
      </p>

      <div className="callout">
        <p>
          <strong>14 days, full refund, no questions asked.</strong> No form to fill in, no
          justification to write, no back-and-forth where we try to talk you out of it. One email
          is enough.
        </p>
      </div>

      <h2>1. Why we can offer this</h2>
      <p>
        Nothing in AgentsKit is filler. The agents, skills, and commands inside it were built and
        rebuilt against real production work before they ever shipped as a product, which is the
        only reason we&apos;re comfortable letting you decide after you&apos;ve seen it. If it
        doesn&apos;t hold up on your codebase, we&apos;d rather give the money back than keep it.
      </p>

      <h2>2. How to request a refund</h2>
      <p>
        Email <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> from the address
        you bought with, or include your order ID. Ask for a refund and that&apos;s it. We usually
        reply within a day, and the money goes back the same way it came in. Depending on your bank
        or card issuer, it can take a few more days to land on your statement.
      </p>

      <h2>3. What&apos;s covered</h2>
      <p>
        The guarantee runs for 14 days from the date of purchase and covers the amount you actually
        paid, including any discount you applied. It covers every kit we sell: Engineer, Marketing,
        and the Complete Bundle. When a refund is issued, access to the private repository ends,
        and the license to use what you downloaded ends with it.
      </p>

      <h2>4. Fair use of the guarantee</h2>
      <p>
        This is meant for people deciding whether AgentsKit is right for them, not as a way to take
        the repository for free. We reserve the right to decline refunds where a purchase is
        clearly abusive, such as repeat buy-and-refund cycles on the same account, or where the
        product has been redistributed in breach of our{" "}
        <a href="/terms">Terms of Service</a>.
      </p>

      <h2>5. Billing problems</h2>
      <p>
        Charged twice, charged the wrong amount, or paid and never got repository access? That sits
        outside the guarantee window entirely. Email{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a> with your order details
        and we&apos;ll fix it, whenever it happens.
      </p>

      <h2>6. Still deciding?</h2>
      <p>
        You don&apos;t have to buy to find out. The free tools and prompts on this site are built
        the same way as the paid kits, and the What&apos;s inside page lists the full contents. If
        you want a straight answer about whether AgentsKit fits what you&apos;re working on, email
        us before you buy and ask.
      </p>
    </LegalLayout>
  );
}
