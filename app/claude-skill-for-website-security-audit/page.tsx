import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import SecurityAuditPage from "./SecurityAuditPage";

const PATH = "/claude-skill-for-website-security-audit";

export const metadata: Metadata = {
  title: "Free Claude Skill for Website Security Audit — Scan Your Site in Minutes",
  description:
    "Download a free Claude skill that audits your website for security issues — missing HTTPS, exposed .env/.git files, leaky headers, hardcoded secrets, and vulnerable dependencies. Get a prioritized fix-it report in minutes.",
  keywords: [
    "claude skill",
    "website security audit",
    "free security scanner",
    "claude code skill",
    "vulnerability scan",
    "security headers",
    "owasp checklist",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: "Free Claude Skill for Website Security Audit",
    description:
      "Scan your own website for the security issues that actually get sites breached — and get a plain-English report with exact fixes. Free download.",
    type: "website",
    url: `https://www.agentary.dev${PATH}`,
    images: [{ url: ogImage("Free Claude Skill for Website Security Audit — Scan Your Site in Minutes"), width: 1200, height: 630, alt: "Free Website Security Audit Claude skill." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Claude Skill for Website Security Audit",
    description:
      "Scan your own website for the security issues that actually get sites breached — free Claude skill with a prioritized fix-it report.",
    images: [ogImage("Free Claude Skill for Website Security Audit — Scan Your Site in Minutes")],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Website Security Audit — Claude Skill",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Claude Code (macOS, Windows, Linux)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "A free Claude skill that audits your own website or codebase for common security issues and produces a prioritized report with exact fixes.",
  publisher: { "@type": "Organization", name: "Agentary", url: "https://www.agentary.dev" },
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SecurityAuditPage />
    </>
  );
}
