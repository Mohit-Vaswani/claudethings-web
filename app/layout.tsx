import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import { SITE_DOMAIN, SITE_URL } from "@/app/lib/site";
import type { ReactNode } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agentary — Your AI Engineering & Marketing Team for Claude Code",
  description:
    "Agentary is an add-on for Claude Code: 89 specialized agents, 103 skills, and 181 slash commands you install into any project with one command. Ship code and growth faster.",
  openGraph: {
    title: "Agentary — Your AI Engineering & Marketing Team",
    description:
      "89 agents · 103 skills · 181 slash commands. One command. Any stack. Built for Claude Code.",
    type: "website",
    url: SITE_URL,
    images: [
      {
        url: ogImage("Agentary — Your AI Engineering & Marketing Team for Claude Code"),
        width: 1200,
        height: 630,
        alt: "Agentary — Your AI Engineering & Marketing Team in one command.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agentary — Your AI Engineering & Marketing Team",
    description:
      "89 agents · 103 skills · 181 slash commands. One command. Any stack. Built for Claude Code.",
    images: [ogImage("Agentary — Your AI Engineering & Marketing Team for Claude Code")],
  },
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* DataFast goal queue — buffers window.datafast() calls made before the script loads */}
        <Script id="datafast-queue" strategy="beforeInteractive">
          {`window.datafast = window.datafast || function() {
            window.datafast.q = window.datafast.q || [];
            window.datafast.q.push(arguments);
          };`}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* DataFast analytics */}
        <Script
          src="https://datafa.st/js/script.js"
          data-website-id="dfid_2KgXjGdUBXKPy7nxWR30T"
          data-domain={SITE_DOMAIN}
          strategy="afterInteractive"
        />
        {/* Google Analytics (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KNHJ5C1QYJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KNHJ5C1QYJ');
          `}
        </Script>
        {/* Polar checkout embed — powers the data-polar-checkout buttons */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js"
          strategy="afterInteractive"
          data-auto-init=""
        />
        {/* Vercel Web Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
