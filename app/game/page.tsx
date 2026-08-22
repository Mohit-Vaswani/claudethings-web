import type { Metadata } from "next";
import { ogImage } from "@/app/lib/og";
import { SITE_URL } from "@/app/lib/site";
import GamePage from "./GamePage";

const PATH = "/game";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Play for up to 50% off AgentsKit";
const DESC =
  "Eight hard reasoning puzzles, 75 seconds each, one attempt. Score well and unlock a 10%, 30% or 50% discount code for AgentsKit.";

export const metadata: Metadata = {
  title: `${TITLE} · The Discount Challenge`,
  description: DESC,
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    type: "website",
    url: URL,
    images: [
      {
        url: ogImage("Play a game. Win up to 50% off AgentsKit."),
        width: 1200,
        height: 630,
        alt: "The AgentsKit discount challenge.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
    images: [ogImage("Play a game. Win up to 50% off AgentsKit.")],
  },
};

export default function Page() {
  return <GamePage />;
}
