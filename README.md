# ClaudeThings — Landing Page (Next.js)

The ClaudeThings sales landing page as a **Next.js 15 (App Router)** app — same design as the
standalone HTML version, ready to deploy on Vercel or merge into your existing Next.js site.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Project structure

```
app/
├── layout.tsx     # metadata, fonts (next/font), Polar checkout <Script>
├── page.tsx       # the landing page (client component; all animations in a useEffect)
└── globals.css    # all styles + design tokens
```

Fonts are loaded with `next/font/google` (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) —
no external `<link>`, no layout shift.

## ⚠️ Before going live — set these

### 1. Polar checkout links (required)
In `app/page.tsx`, search for `REPLACE_` and swap in your real Polar checkout URLs:
- `REPLACE_ENGINEER_LINK`, `REPLACE_MARKETING_LINK`, `REPLACE_BUNDLE_LINK`

The Polar embed script is already loaded in `app/layout.tsx`, so any link with
`data-polar-checkout` opens an inline checkout overlay. In each Polar product, enable the
**GitHub Repository Access** benefit pointing at your private `claudethings-kit` repo for
automatic delivery on purchase.

### 2. Prices
Defaults: Engineer **$89**, Marketing **$89**, Bundle **$129**. Edit in the `#pricing` section of
`app/page.tsx` to match what you set in Polar.

### 3. Legal links
Footer links to `/terms`, `/privacy`, `/refund` — point them at your real pages.

## Deploy

- **Vercel (recommended):** push this folder to a repo and import it on vercel.com, or run
  `npx vercel`. Zero config.
- **Netlify / Cloudflare Pages:** also work with the Next.js preset.

## Merge into your existing claudethings.com site

Since your main site is already Next.js, you can drop this in as a route:
1. Copy `app/page.tsx` → a route in your site (e.g. `app/(marketing)/page.tsx` or `app/kit/page.tsx`).
2. Merge the styles from `app/globals.css` (or scope them to a CSS module to avoid collisions).
3. Add the three `next/font` imports and the Polar `<Script>` to your layout.
4. Keep the `"use client"` directive on the page component (it uses `useEffect`).

## Notes
- The page is a client component because it runs scroll-reveal, count-up, and the terminal typing
  animation. Metadata stays in `app/layout.tsx` (server) for SEO.
- This is a faithful port of the standalone `index.html` version — identical visual output.
