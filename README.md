# AgentsKit — Landing Page (Next.js)

The AgentsKit sales landing page as a **Next.js 15 (App Router)** app — same design as the
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
├── layout.tsx     # metadata, fonts (next/font), analytics <Script>s
├── page.tsx       # the landing page (client component; all animations in a useEffect)
└── globals.css    # all styles + design tokens
```

Fonts are loaded with `next/font/google` (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) —
no external `<link>`, no layout shift.

## ⚠️ Before going live — set these

### 1. Dodo Payments checkout links (required)
All three checkout URLs live in one place: `app/lib/plans.ts`. Swap them there and every buy
button on the site follows.

They are plain links to Dodo's hosted checkout — no embed script, no overlay. The `dodo.pe`
short links 302 to a fresh checkout session and **drop any query string**, so you cannot
prefill a discount code or customer details through the URL.

In the Dodo dashboard, per product:
- set the **return URL** to `https://agentskit.co/success`
- configure private-repo delivery (GitHub invite) so buyers get access on purchase
- recreate any discount codes you relied on, including `INDIAN50` (see `app/lib/geoDiscount.ts`)

### 2. Prices
Engineer **$59**, Marketing **$59**, Bundle **$99**. Edit in `app/lib/plans.ts` and in the
`#pricing` section of `app/page.tsx`, and keep them matching what you set in Dodo.

### 3. Legal links
Footer links to `/terms`, `/privacy`, `/refund` — point them at your real pages.

## Deploy

- **Vercel (recommended):** push this folder to a repo and import it on vercel.com, or run
  `npx vercel`. Zero config.
- **Netlify / Cloudflare Pages:** also work with the Next.js preset.

## Merge into your existing agentskit.co site

Since your main site is already Next.js, you can drop this in as a route:
1. Copy `app/page.tsx` → a route in your site (e.g. `app/(marketing)/page.tsx` or `app/kit/page.tsx`).
2. Merge the styles from `app/globals.css` (or scope them to a CSS module to avoid collisions).
3. Add the three `next/font` imports and the analytics `<Script>`s to your layout.
4. Keep the `"use client"` directive on the page component (it uses `useEffect`).

## Notes
- The page is a client component because it runs scroll-reveal, count-up, and the terminal typing
  animation. Metadata stays in `app/layout.tsx` (server) for SEO.
- This is a faithful port of the standalone `index.html` version — identical visual output.
