import type { Metadata } from "next";
import LegalLayout from "../components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy · AgentsKit",
  description: "How AgentsKit collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="July 6, 2026">
      <p className="intro">
        This Privacy Policy explains what information we collect when you visit our site or purchase
        AgentsKit (the &quot;Product&quot;), how we use it, and the choices you have. We keep data
        collection to the minimum needed to run the business.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Purchase details.</strong> When you buy the Product, our payment processor
          collects your name, email, and payment information to complete the transaction.
        </li>
        <li>
          <strong>Support messages.</strong> If you email us, we receive your email address and the
          contents of your message.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Basic analytics.</strong> Standard, aggregated visit data (such as page views and
          referrers) may be collected to understand how the site is used.
        </li>
      </ul>

      <h2>2. Payment processing</h2>
      <p>
        Payments are handled by our payment processor (Polar). We do not store your full card
        details on our servers. The processor&apos;s handling of your payment data is governed by its
        own privacy policy.
      </p>

      <h2>3. How we use your information</h2>
      <ul>
        <li>To deliver the Product and provide lifetime updates where advertised.</li>
        <li>To respond to support requests and process refunds.</li>
        <li>To operate, secure, and improve the site.</li>
        <li>To comply with legal and tax obligations.</li>
      </ul>

      <h2>4. What we don&apos;t do</h2>
      <p>
        We do not sell your personal information. We do not share it with third parties except the
        service providers needed to run the business (such as our payment processor and email
        provider), or where required by law.
      </p>

      <h2>5. Data retention</h2>
      <p>
        We keep purchase and support records for as long as needed to provide the Product, meet legal
        and accounting requirements, and resolve disputes. You can ask us to delete data that we are
        not required to retain.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, or delete your
        personal data, or to object to certain processing. To exercise any of these rights, email us
        at <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>.
      </p>

      <h2>7. Cookies</h2>
      <p>
        The site uses only the cookies necessary for it to function and for basic analytics. You can
        control cookies through your browser settings.
      </p>

      <h2>8. Changes to this policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Material changes will be reflected by the
        &quot;Last updated&quot; date above.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about privacy or your data? Email us at{" "}
        <a href="mailto:epictools.io@gmail.com">epictools.io@gmail.com</a>.
      </p>
    </LegalLayout>
  );
}
