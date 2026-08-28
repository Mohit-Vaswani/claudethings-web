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
├── layout.tsx     # metadata, fonts (next/font), analytics + Polar checkout <Script>s
├── page.tsx       # the landing page (client component; all animations in a useEffect)
└── globals.css    # all styles + design tokens
```

Fonts are loaded with `next/font/google` (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono) —
no external `<link>`, no layout shift.

## ⚠️ Before going live — set these

### 1. Polar checkout links (required)
All three checkout URLs live in one place: `app/lib/plans.ts`. Swap them there and every buy
button on the site follows.

They are Polar **Checkout Links** (`buy.polar.sh/polar_cl_...`). The Polar embed script is
loaded in `app/layout.tsx`, so any link carrying `data-polar-checkout` opens an inline
checkout overlay — enable **"Embeddable checkout"** on each Polar product or the overlay
falls back to a full page load. Unlike a short link, the query string survives, so
`withDiscount()` in `app/lib/geoDiscount.ts` can prefill a discount code.

In the Polar dashboard, per product:
- set the **success URL** to `https://agentskit.co/success?checkout_id={CHECKOUT_ID}` —
  the `{CHECKOUT_ID}` placeholder is what DataFast reads to attribute the sale
- attach the **GitHub Repository Access** benefit so buyers get the private-repo invite.
  The benefit stores the org/repo as a *string*: after the Agentary → `agentskit` rename it
  must be re-pointed at the new org, or new purchases deliver nothing
- create the discount codes you rely on, including `INDIAN50` (see `app/lib/geoDiscount.ts`)

### 2. Prices
Engineer **$49**, Marketing **$49**, Bundle **$79**. All three live in `app/lib/plans.ts` —
the `#pricing` cards in `app/page.tsx` read from it, so edit one place and keep it matching
what you set in Polar.

### 2b. The launch ladder
The bundle price steps up as launch seats fill, and the scarcity copy on the page (seats
left, the fill meter, the card ribbon, the closing note) is all derived from **one number**:
`LAUNCH.sold` in `app/components/pricing.tsx`. Bump it as sales come in and the whole
pricing block re-reads. The steps themselves are `TIERS` in the same file — currently
$79 for the first 20 buyers, $99 for the next 20, $139 after that. When a tier fills, also
raise `price` in `app/lib/plans.ts` and the product price in Polar so the checkout matches.

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
3. Add the three `next/font` imports and the analytics + Polar `<Script>`s to your layout.
4. Keep the `"use client"` directive on the page component (it uses `useEffect`).

## Notes
- The page is a client component because it runs scroll-reveal, count-up, and the terminal typing
  animation. Metadata stays in `app/layout.tsx` (server) for SEO.
- This is a faithful port of the standalone `index.html` version — identical visual output.
