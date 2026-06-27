import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// All three are variable fonts — omit `weight` so next/font bundles the full axis.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});
const body = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
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
