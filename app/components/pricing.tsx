"use client";

/**
 * Shared pieces of the pricing block.
 *
 * The landing page (app/page.tsx) and the discount game (app/game) both sell
 * the same three kits with the same social proof, so the buyer count, the
 * price ladder and the revenue badge live here rather than being kept in sync
 * by hand. The plan cards themselves are driven by app/lib/plans.ts.
 */

/**
 * Early-buyer social proof, rendered in the hero and above the price ladder.
 * Single source of truth — bump as sales come in.
 */
export const PROOF = { buyers: 15, window: "2 weeks" };

export function ProofPill() {
  return (
    <span className="nx-proof">
      <span className="dot" aria-hidden="true" />
      <span>
        <b>{PROOF.buyers} builders</b> are already shipping with AgentsKit - all in the last{" "}
        {PROOF.window}.
      </span>
    </span>
  );
}

/**
 * Third-party revenue badge — TrustMRR verifies the Polar numbers and serves
 * the SVG, so it stays a plain <img> (no next/image remote host config, no
 * layout shift: width/height match the served artwork).
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
        src="https://trustmrr.com/api/embed/claudethings?format=svg&theme=light"
        alt="TrustMRR verified revenue badge"
        width={220}
        height={90}
        loading="lazy"
      />
    </a>
  );
}

/**
 * Bundle price ladder — the price rises as launch spots fill.
 * `fade` opts into the landing page's scroll-reveal; pages without the
 * IntersectionObserver (like /game) leave it off or nothing ever appears.
 */
export function PriceLadder({ fade = false }: { fade?: boolean }) {
  return (
    <div className={`nx-ladder${fade ? " nx-fade" : ""}`} aria-label="Bundle pricing steps">
      <div className="nx-ladder-track" aria-hidden="true" />
      <div className="nx-ladder-step is-past">
        <span className="node" />
        <div className="step-price">
          <s>$89</s>
        </div>
        <div className="step-note">only for first 20</div>
      </div>
      <div className="nx-ladder-step">
        <span className="node" />
        <div className="step-price">$99</div>
        <div className="step-note">
          next <b>20</b> users
        </div>
      </div>
      <div className="nx-ladder-step is-next">
        <span className="node" />
        <div className="step-price">$139</div>
        <div className="step-note">remaining users</div>
      </div>
    </div>
  );
}
