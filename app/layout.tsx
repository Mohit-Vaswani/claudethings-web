import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClaudeThings — Your AI Engineering & Marketing Team for Claude Code",
  description:
    "89 specialized agents, 104 skills, and 191 slash commands you drop into any project with one command. Built for Claude Code. Ship code and growth faster.",
  openGraph: {
    title: "ClaudeThings — Your AI Engineering & Marketing Team",
    description:
      "89 agents · 104 skills · 191 slash commands. One command. Any stack. Built for Claude Code.",
    type: "website",
    url: "https://claudethings.com",
  },
  metadataBase: new URL("https://claudethings.com"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        {/* Polar checkout embed — powers the data-polar-checkout buttons */}
        <Script
          src="https://cdn.jsdelivr.net/npm/@polar-sh/checkout@0.1/dist/embed.global.js"
          strategy="afterInteractive"
          data-auto-init=""
        />
      </body>
    </html>
  );
}
