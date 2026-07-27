import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "We'll be right back · AgentsKit",
  description: "We're rolling out some important updates. Checkout is paused for a little while.",
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        background: "var(--paper-2)",
        color: "var(--bone)",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "40ch" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            letterSpacing: ".09em",
            textTransform: "uppercase",
            color: "var(--bone-dim)",
            border: "1px solid var(--line)",
            borderRadius: 999,
            padding: "6px 14px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--ember)",
            }}
          />
          Important updates in progress
        </div>

        <h1
          style={{
            fontSize: "clamp(1.8rem, 5vw, 2.6rem)",
            lineHeight: 1.1,
            margin: "0 0 16px",
            fontWeight: 700,
          }}
        >
          We&apos;re making things better.
        </h1>

        <p
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.6,
            color: "var(--bone-dim)",
            margin: "0 0 32px",
          }}
        >
          We&apos;re rolling out some important updates behind the scenes, so
          checkout is paused for a bit. We&apos;ll be back live in a few hours.
          Thanks for your patience.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "12px 22px",
            borderRadius: 12,
            background: "var(--ink)",
            color: "var(--paper)",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          ← Back to home
        </Link>

        <p
          style={{
            marginTop: 28,
            fontSize: 13,
            color: "var(--bone-faint)",
          }}
        >
          Questions? Email{" "}
          <a href="mailto:epictools.io@gmail.com" style={{ color: "var(--ember)" }}>
            epictools.io@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}
