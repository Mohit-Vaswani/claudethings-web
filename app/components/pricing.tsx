"use client";

/**
 * Shared pieces of the pricing block.
 *
 * The buyer count, the price ladder and the revenue badge live here so the
 * social proof has a single source of truth across the pages that sell the
 * kits. The plan cards themselves are driven by app/lib/plans.ts.
 */

/**
 * The launch ladder — the one number to maintain is `sold`.
 *
 * The bundle price steps up every time a tier's seats fill. Everything the
 * pricing block says about scarcity (seats left, the fill meter, the next
 * price, the card ribbon) is derived from `sold` and `TIERS`, so the urgency
 * on the page is always the real pricing policy and never a decorative
 * countdown. Bump `sold` as sales come in and the whole block re-reads.
 */
export const LAUNCH = {
  /** Real buyers so far. Bump this as sales come in. */
  sold: 18,
  /** How long those sales took, for the proof pill. */
  window: "2 weeks",
};

/** Bundle price steps. Seats fill in order; the last tier is the ceiling. */
export const TIERS: { price: number; seats: number | null }[] = [
  { price: 79, seats: 20 },
  { price: 99, seats: 20 },
  { price: 139, seats: null },
];

export type LadderState = {
  /** Index of the tier currently on sale. */
  index: number;
  price: number;
  /** Seats already taken inside the current tier. */
  taken: number;
  /** Total seats in the current tier (null on the final, uncapped tier). */
  seats: number | null;
  /** Seats left before the price steps up (null on the final tier). */
  left: number | null;
  /** What the price becomes once this tier fills (null on the final tier). */
  nextPrice: number | null;
  /** Fill percentage of the current tier, 0-100. */
  pct: number;
};

/**
 * Walk the tiers and work out which one is live, how full it is and what the
 * price jumps to next. Pure, so the hero and the pricing block can both ask.
 */
export function ladderState(sold: number = LAUNCH.sold): LadderState {
  let remaining = sold;
  for (let i = 0; i < TIERS.length; i++) {
    const { price, seats } = TIERS[i];
    // Final, uncapped tier: everyone from here on pays list.
    if (seats === null) {
      return { index: i, price, taken: remaining, seats: null, left: null, nextPrice: null, pct: 100 };
    }
    if (remaining < seats) {
      return {
        index: i,
        price,
        taken: remaining,
        seats,
        left: seats - remaining,
        nextPrice: TIERS[i + 1]?.price ?? null,
        pct: Math.round((remaining / seats) * 100),
      };
    }
    remaining -= seats;
  }
  const last = TIERS[TIERS.length - 1];
  return { index: TIERS.length - 1, price: last.price, taken: remaining, seats: null, left: null, nextPrice: null, pct: 100 };
}

/**
 * Early-buyer social proof, rendered in the hero and above the price ladder.
 */
export function ProofPill() {
  const { left, price } = ladderState();
  return (
    <span className="nx-proof">
      <span className="dot" aria-hidden="true" />
      <span>
        <b>{LAUNCH.sold} builders</b> are already shipping with AgentsKit - all in the last{" "}
        {LAUNCH.window}.
        {left !== null && (
          <>
            {" "}
            <b className="hot">Only {left} seats left at ${price}.</b>
          </>
        )}
      </span>
    </span>
  );
}

/**
 * Third-party revenue badge — TrustMRR verifies the revenue numbers and serves
 * the SVG, so it stays a plain <img> (no next/image remote host config, no
 * layout shift: width/height match the served artwork).
 *
 * The TrustMRR connection reads the Polar account directly, so it tracks the
 * same processor the buy buttons point at.
 */
export function TrustMrrBadge() {
  return (
    <a
      className="nx-trustmrr"
      href="https://trustmrr.com/startup/claudethings"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://trustmrr.com/api/embed/claudethings?format=svg&theme=dark"
        alt="TrustMRR verified revenue badge"
        width={220}
        height={90}
        loading="lazy"
      />
    </a>
  );
}

/**
 * Bundle price ladder — the price rises as launch seats fill.
 *
 * Three parts, all driven by `ladderState()`: a headline that names the exact
 * cost of waiting, a fill meter for the tier that is currently selling, and
 * the step rail showing where the price has been and where it goes next.
 *
 * `fade` opts into the landing page's scroll-reveal; pages without the
 * IntersectionObserver leave it off or nothing ever appears.
 */
export function PriceLadder({ fade = false }: { fade?: boolean }) {
  const st = ladderState();

  return (
    <div className={`nx-ladder${fade ? " nx-fade" : ""}`} aria-label="Bundle pricing steps">
      {/* the cost of waiting, stated in one line */}
      <div className="nx-ladder-hd">
        <span className="dot" aria-hidden="true" />
        {st.left !== null && st.nextPrice !== null ? (
          <span>
            <b>{st.left} seats left</b> at ${st.price} — after that the bundle is{" "}
            <b>${st.nextPrice}</b>.
          </span>
        ) : (
          <span>
            The bundle is at its <b>list price of ${st.price}</b>. All launch seats are gone.
          </span>
        )}
      </div>

      {/* how full the tier that is currently selling is */}
      {st.seats !== null && (
        <div className="nx-ladder-meter">
          <div
            className="bar"
            role="progressbar"
            aria-valuenow={st.taken}
            aria-valuemin={0}
            aria-valuemax={st.seats}
            aria-label={`${st.taken} of ${st.seats} seats claimed at $${st.price}`}
          >
            <i style={{ width: `${st.pct}%` }}>
              <em />
            </i>
          </div>
          <div className="meter-note">
            <span>
              <b>{st.taken}</b> of {st.seats} claimed at ${st.price}
            </span>
            <span>Price steps up every {st.seats} sales</span>
          </div>
        </div>
      )}

      {/* the rail: where the price has been, is, and goes */}
      <div className="nx-ladder-steps">
        <div className="nx-ladder-track" aria-hidden="true" />
        {TIERS.map((t, i) => {
          const state = i < st.index ? "is-past" : i === st.index ? "is-now" : "is-next";
          const jump = i > 0 ? t.price - TIERS[i - 1].price : 0;
          return (
            <div className={`nx-ladder-step ${state}`} key={t.price}>
              <span className="node" />
              <div className="step-price">
                {state === "is-past" ? <s>${t.price}</s> : <>${t.price}</>}
                {jump > 0 && <span className="jump">+${jump}</span>}
              </div>
              <div className="step-note">
                {state === "is-past" && "gone"}
                {state === "is-now" && (
                  <>
                    buying now · <b>{st.left ?? 0} left</b>
                  </>
                )}
                {state === "is-next" &&
                  (t.seats === null ? "everyone after" : `next ${t.seats} buyers`)}
              </div>
              {state === "is-now" && <span className="step-flag">You are here</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
