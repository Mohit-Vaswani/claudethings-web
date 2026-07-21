import { ImageResponse } from "next/og";
import { SITE_DOMAIN, SITE_NAME } from "@/app/lib/site";

// Dynamic Open Graph image generator, branded to match the site (see globals.css tokens).
// Usage: /og?title=<title>&label=<pill>  — wired up via app/lib/og.ts.
export const runtime = "nodejs";

const PAPER = "#f6f2ea"; // page background
const EMBER = "#e04e1b"; // vermilion accent
const TEXT = "#1e1912"; // primary text
const DIM = "#5d564a"; // secondary text
const LINE = "#d9d2c4"; // hairline
const WHITE = "#fdfcf8"; // raised surface

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || SITE_NAME).slice(0, 150);
  const label = (searchParams.get("label") || SITE_NAME).slice(0, 26);

  const len = title.length;
  const fontSize = len > 95 ? 52 : len > 72 ? 60 : len > 46 ? 70 : 82;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background: PAPER,
          padding: "62px 72px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* soft ember glow, top-right */}
        <div
          style={{
            position: "absolute",
            top: -170,
            right: -130,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(224,78,27,0.22), rgba(224,78,27,0) 70%)",
          }}
        />

        {/* header row: wordmark + label pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: TEXT, letterSpacing: -0.5 }}>
            {SITE_NAME}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: EMBER,
              border: `1px solid ${LINE}`,
              background: WHITE,
              borderRadius: 999,
              padding: "10px 22px",
            }}
          >
            {label}
          </div>
        </div>

        {/* title block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: 8,
          }}
        >
          <div style={{ width: 74, height: 8, background: EMBER, borderRadius: 4, marginBottom: 30 }} />
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 800,
              color: TEXT,
              lineHeight: 1.06,
              letterSpacing: -1.5,
              maxWidth: 1010,
            }}
          >
            {title}
          </div>
        </div>

        {/* footer row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${LINE}`,
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, color: EMBER }}>
            {SITE_DOMAIN}
          </div>
          <div style={{ display: "flex", fontSize: 20, fontWeight: 500, color: DIM }}>
            89 agents · 103 skills · 181 slash commands
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
