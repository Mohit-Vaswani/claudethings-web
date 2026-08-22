"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GEO_DISCOUNT, useGeoDiscount, withDiscount } from "@/app/lib/geoDiscount";
import { PLANS } from "@/app/lib/plans";
import { PriceLadder, ProofPill, TrustMrrBadge } from "@/app/components/pricing";
import {
  QUESTION_POOLS,
  SECONDS_PER_QUESTION,
  TIERS,
  TOTAL_QUESTIONS,
  tierForScore,
  type Question,
  type Tier,
} from "./quizData";
import "../home.css";
import "./game.css";

/**
 * The discount challenge.
 *
 * ONE ATTEMPT. The attempt is written to localStorage the moment the first
 * question renders, and the running score is written after every answer, so
 * reloading mid-run doesn't hand out a second try — it just finalises the
 * attempt with whatever was earned up to that point.
 *
 * This is a client-side honour system: someone who clears their storage gets
 * another go, and the codes are in the bundle either way. Cap redemptions on
 * each code in Polar if that matters.
 */

const STORAGE_KEY = "agentskit_game_v1";

type Attempt = {
  v: 1;
  status: "in_progress" | "done";
  /** Question ids in the order they were drawn. */
  ids: string[];
  /** Correct answers so far. */
  score: number;
  /** How many questions have been resolved (answered or timed out). */
  resolved: number;
  at: number;
};

function shuffle<T>(items: T[]): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A question with its options shuffled and the answer index remapped. */
type DrawnQuestion = Question & { shuffled: string[]; correct: number };

function draw(): DrawnQuestion[] {
  return QUESTION_POOLS.map((pool) => {
    const q = pool[Math.floor(Math.random() * pool.length)];
    const correctText = q.options[q.answer];
    const shuffled = shuffle(q.options);
    return { ...q, shuffled, correct: shuffled.indexOf(correctText) };
  });
}

function readAttempt(): Attempt | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Attempt;
    return parsed && parsed.v === 1 ? parsed : null;
  } catch {
    return null;
  }
}

function writeAttempt(attempt: Attempt) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
  } catch {
    /* private mode, quota — the game still runs, it just won't lock */
  }
}

export default function GamePage() {
  const indiaOffer = useGeoDiscount();

  // "boot" until localStorage has been read: the page is statically rendered,
  // so the saved attempt can't be known during the first paint.
  const [phase, setPhase] = useState<"boot" | "intro" | "playing" | "result">("boot");
  const [questions, setQuestions] = useState<DrawnQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS_PER_QUESTION);
  /** Set when the attempt was restored from storage rather than played now. */
  const [restored, setRestored] = useState(false);
  const [copied, setCopied] = useState(false);

  const attemptRef = useRef<Attempt | null>(null);
  /** Highest question index already scored — see resolveQuestion. */
  const resolvedRef = useRef(-1);
  const stageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const saved = readAttempt();
    if (!saved) {
      setPhase("intro");
      return;
    }
    // A saved run in either state is spent. An abandoned one is finalised with
    // the score it had reached, so a refresh can't be used as a mulligan.
    if (saved.status === "in_progress") {
      writeAttempt({ ...saved, status: "done" });
    }
    attemptRef.current = { ...saved, status: "done" };
    setScore(saved.score);
    setRestored(true);
    setPhase("result");
  }, []);

  const start = useCallback(() => {
    const drawn = draw();
    setQuestions(drawn);
    setPicks(Array(drawn.length).fill(null));
    setIndex(0);
    setScore(0);
    setSecondsLeft(SECONDS_PER_QUESTION);
    const attempt: Attempt = {
      v: 1,
      status: "in_progress",
      ids: drawn.map((q) => q.id),
      score: 0,
      resolved: 0,
      at: Date.now(),
    };
    attemptRef.current = attempt;
    resolvedRef.current = -1;
    writeAttempt(attempt);
    setPhase("playing");
  }, []);

  /**
   * Records one answer (or a timeout, when `choice` is null) and moves on.
   * `resolvedRef` holds the last index already scored, so a click landing in
   * the same tick as the timer expiring can't score the question twice.
   */
  const resolveQuestion = useCallback(
    (choice: number | null) => {
      if (phase !== "playing" || resolvedRef.current >= index) return;
      resolvedRef.current = index;

      const question = questions[index];
      const correct = choice !== null && choice === question.correct;
      const nextScore = score + (correct ? 1 : 0);
      const last = index === questions.length - 1;

      setPicks((prev) => {
        const next = prev.slice();
        next[index] = choice;
        return next;
      });
      setScore(nextScore);

      const attempt: Attempt = {
        v: 1,
        status: last ? "done" : "in_progress",
        ids: questions.map((q) => q.id),
        score: nextScore,
        resolved: index + 1,
        at: attemptRef.current?.at ?? Date.now(),
      };
      attemptRef.current = attempt;
      writeAttempt(attempt);

      if (last) {
        setPhase("result");
        return;
      }
      setIndex(index + 1);
      setSecondsLeft(SECONDS_PER_QUESTION);
    },
    [phase, index, questions, score]
  );

  // Per-question countdown. Running out counts as a wrong answer.
  useEffect(() => {
    if (phase !== "playing") return;
    const tick = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(tick);
  }, [phase, index]);

  useEffect(() => {
    if (phase === "playing" && secondsLeft === 0) resolveQuestion(null);
  }, [phase, secondsLeft, resolveQuestion]);

  /**
   * Each phase swaps a tall block for a shorter one, so without this the
   * question (or the result) can land off-screen behind the previous scroll
   * position. Only fires on a phase change, never between questions.
   */
  useEffect(() => {
    if (phase !== "playing" && phase !== "result") return;
    stageRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [phase]);

  const tier = useMemo<Tier | null>(() => tierForScore(score), [score]);

  /**
   * India already has a standing 50% code. If the game awards less than that,
   * an Indian visitor should still get the better of the two — nobody should
   * lose money by playing.
   */
  const bestOffer = useMemo(() => {
    if (indiaOffer && (!tier || tier.percent < GEO_DISCOUNT.percent)) {
      return { code: GEO_DISCOUNT.code, percent: GEO_DISCOUNT.percent, fromGeo: true };
    }
    return tier ? { code: tier.code, percent: tier.percent, fromGeo: false } : null;
  }, [indiaOffer, tier]);

  const copyCode = useCallback(() => {
    if (!bestOffer) return;
    navigator.clipboard?.writeText(bestOffer.code).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      },
      () => setCopied(false)
    );
  }, [bestOffer]);

  const question = questions[index];
  const timePct = Math.max(0, (secondsLeft / SECONDS_PER_QUESTION) * 100);

  return (
    <div className="nx-page gm-page">
      <div className="nx-frame" aria-hidden="true"></div>

      <nav className="nx-nav scrolled">
        <div className="nx-nav-inner">
          <a className="nx-logo" href="/">
            AgentsKit
          </a>
          <div className="nx-nav-links">
            <a href="/">Home</a>
            <a href="/tools">Free tools</a>
            <a href="#game-pricing">Pricing</a>
          </div>
        </div>
      </nav>

      <header className="gm-hero">
        <div className="nx-wrap">
          <div className="nx-center">
            <div className="nx-label">The discount challenge</div>
            <h1 className="nx-h1 gm-h1">
              Eight puzzles. <em>One attempt.</em> Up to 50% off.
            </h1>
            <p className="nx-lead gm-lead">
              A short reasoning test — sequences, ciphers, deduction, probability, spatial and
              lateral puzzles. Score well and you leave with a working discount code for AgentsKit.
              There is no second try, so give each question your full attention.
            </p>
          </div>
        </div>
      </header>

      <section className="nx-sec gm-stage-sec" ref={stageRef}>
        <div className="nx-wrap">
          {/* ── BOOT ── */}
          {phase === "boot" && (
            <div className="gm-stage gm-boot" aria-live="polite">
              <span className="gm-spinner" aria-hidden="true" />
              <p>Checking whether you&apos;ve already played…</p>
            </div>
          )}

          {/* ── INTRO ── */}
          {phase === "intro" && (
            <div className="gm-stage">
              <div className="gm-rules">
                <h2>How it works</h2>
                <ol>
                  <li>
                    <b>{TOTAL_QUESTIONS} questions</b>, one from each reasoning category. They are
                    drawn at random, so your set is not the same as anyone else&apos;s.
                  </li>
                  <li>
                    <b>{SECONDS_PER_QUESTION} seconds each.</b> The clock does not stop, and a
                    timeout counts as a wrong answer.
                  </li>
                  <li>
                    <b>No going back</b> and no changing an answer once it&apos;s in.
                  </li>
                  <li>
                    <b>One attempt, ever.</b> Reloading the page mid-run ends the run and locks in
                    whatever you had scored.
                  </li>
                </ol>
              </div>

              <div className="gm-tiers">
                <div className="gm-tier-head">What your score is worth</div>
                {TIERS.map((t) => (
                  <div className="gm-tier" key={t.percent}>
                    <span className="pct">{t.percent}%</span>
                    <span className="req">
                      {t.min} of {TOTAL_QUESTIONS} correct
                      {t.min === TIERS[0].min ? " or better" : ""}
                    </span>
                    <span className="name">{t.title}</span>
                  </div>
                ))}
                <div className="gm-tier is-none">
                  <span className="pct">—</span>
                  <span className="req">
                    under {TIERS[TIERS.length - 1].min} of {TOTAL_QUESTIONS}
                  </span>
                  <span className="name">No code</span>
                </div>
              </div>

              <button
                className="nx-btn nx-btn-primary nx-btn-lg gm-start"
                onClick={start}
                data-fast-goal="game_start"
              >
                Start the challenge <span className="ar">↗</span>
              </button>
              <p className="nx-micro gm-fine">
                [ The timer starts the moment you press it ]
              </p>
            </div>
          )}

          {/* ── PLAYING ── */}
          {phase === "playing" && question && (
            <div className="gm-stage">
              <div className="gm-qbar">
                <div className="gm-qcount">
                  Question <b>{index + 1}</b> / {TOTAL_QUESTIONS}
                </div>
                <div className="gm-cat">{question.category}</div>
                <div className={`gm-clock${secondsLeft <= 10 ? " is-low" : ""}`}>
                  {secondsLeft}s
                </div>
              </div>
              <div className="gm-timer" aria-hidden="true">
                <span style={{ width: `${timePct}%` }} />
              </div>

              <div className="gm-card">
                <p className="gm-prompt">{question.prompt}</p>
                {question.figure && <pre className="gm-figure">{question.figure}</pre>}
                <div className="gm-options">
                  {question.shuffled.map((opt, i) => (
                    <button
                      key={opt}
                      className="gm-option"
                      onClick={() => resolveQuestion(i)}
                      type="button"
                    >
                      <span className="key">{String.fromCharCode(65 + i)}</span>
                      <span className="txt">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="gm-dots" aria-hidden="true">
                {questions.map((q, i) => (
                  <span
                    key={q.id}
                    className={i < index ? "is-done" : i === index ? "is-now" : ""}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ── */}
          {phase === "result" && (
            <div className="gm-stage">
              <div className={`gm-result${bestOffer ? " is-win" : " is-loss"}`}>
                <div className="gm-score">
                  <b>{score}</b>
                  <span>/ {TOTAL_QUESTIONS} correct</span>
                </div>

                {bestOffer ? (
                  <>
                    <h2 className="gm-verdict">
                      {bestOffer.fromGeo ? "India pricing applies" : tier?.title} —{" "}
                      {bestOffer.percent}% off
                    </h2>
                    <p className="gm-verdict-sub">
                      {bestOffer.fromGeo
                        ? `Your score earned ${tier ? `${tier.percent}%` : "no code"}, but India's standing ${GEO_DISCOUNT.percent}% offer is better, so that's the code you get.`
                        : tier?.blurb}
                    </p>

                    <div className="gm-code">
                      <span className="gm-code-label">Your code</span>
                      <code>{bestOffer.code}</code>
                      <button className="gm-copy" onClick={copyCode} type="button">
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <p className="gm-code-how">
                      Pick a kit below — the code is pre-filled in Polar&apos;s discount box at
                      checkout. Press <b>Apply</b> to take {bestOffer.percent}% off.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="gm-verdict">
                      Below the cut-off — no code this time
                    </h2>
                    <p className="gm-verdict-sub">
                      {TIERS[TIERS.length - 1].min} correct was the bar for the {TIERS[TIERS.length - 1].percent}%
                      code. The set is deliberately brutal, and the attempt was one-time-only. The
                      launch pricing below stands on its own.
                    </p>
                  </>
                )}

                {restored && (
                  <p className="gm-restored">
                    You&apos;ve already played on this device — this is your saved result.
                  </p>
                )}
              </div>

              {/* Answer review, only for a run played in this session */}
              {!restored && questions.length > 0 && (
                <details className="gm-review">
                  <summary>Review all {TOTAL_QUESTIONS} answers</summary>
                  <ol>
                    {questions.map((q, i) => {
                      const pick = picks[i];
                      const right = pick !== null && pick === q.correct;
                      return (
                        <li key={q.id} className={right ? "is-right" : "is-wrong"}>
                          <div className="rq">{q.prompt}</div>
                          {q.figure && <pre className="gm-figure sm">{q.figure}</pre>}
                          <div className="ra">
                            <b>{right ? "Correct" : "Missed"}</b>
                            {pick === null
                              ? " — ran out of time."
                              : ` — you chose “${q.shuffled[pick]}”.`}{" "}
                            The answer is <b>{q.shuffled[q.correct]}</b>. {q.why}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </details>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="nx-hatch" aria-hidden="true"></div>

      {/* ── PRICING ── */}
      <section id="game-pricing" className="nx-sec">
        <div className="nx-wrap">
          <div className="nx-center">
            <div className="nx-label">Pricing</div>
            <h2 className="nx-h2">
              {bestOffer ? `Apply ${bestOffer.code} to any kit` : "Less than an hour of a freelancer"}
            </h2>
            <p className="nx-lead">
              One payment, lifetime access, every future update included. Delivered instantly as
              private-repo access the moment you check out. No subscription, no seats.
            </p>
          </div>

          {bestOffer && (
            <div className="nx-geo gm-code-note" role="note">
              <span className="flag" aria-hidden="true">
                🎯
              </span>
              <div className="copy">
                <b>{bestOffer.percent}% off is yours.</b> <code>{bestOffer.code}</code> is waiting
                in the discount box at checkout — hit <b>Apply</b> to take{" "}
                {bestOffer.percent}% off.
              </div>
            </div>
          )}

          <div className="nx-proof-center">
            <ProofPill />
          </div>

          {/* PRICE LADDER, bundle price rises as spots fill */}
          <PriceLadder />

          <div className="nx-price-grid">
            {PLANS.map((plan) => {
              const discounted = bestOffer
                ? Math.round(plan.price * (1 - bestOffer.percent / 100))
                : null;
              return (
                <div className={`nx-plan${plan.featured ? " featured" : ""}`} key={plan.id}>
                  <div className="nx-plan-head">
                    <div>
                      <h3>{plan.name}</h3>
                      <div className="who">{plan.who}</div>
                    </div>
                    {plan.featured && <div className="pill">Launch Price</div>}
                  </div>
                  <div className="nx-plan-buy">
                    <div className="amt">
                      <span className="cur">$</span>
                      <span className="big">{discounted ?? plan.price}</span>
                      {discounted !== null ? (
                        <span className="was">${plan.price}</span>
                      ) : plan.was ? (
                        <span className="was">${plan.was}</span>
                      ) : null}
                    </div>
                    <div className="once">one-time · lifetime updates</div>
                    <a
                      className={`nx-btn ${plan.featured ? "nx-btn-primary" : "nx-btn-ghost"}`}
                      href={withDiscount(plan.checkoutUrl, Boolean(bestOffer), bestOffer?.code)}
                      data-polar-checkout=""
                      data-polar-checkout-theme="dark"
                      data-fast-goal="initiate_checkout"
                      data-fast-goal-plan={plan.id}
                      data-fast-goal-price={String(plan.price)}
                      data-fast-goal-location="game"
                      data-fast-goal-game-offer={bestOffer?.code}
                    >
                      {plan.cta} <span className="ar">↗</span>
                    </a>
                  </div>
                  <ul>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <span className="ck">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="nx-guarantee" role="note">
            <span className="seal" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path
                  d="M12 2.6 4.2 5.6v6c0 4.4 3.1 8.3 7.8 9.8 4.7-1.5 7.8-5.4 7.8-9.8v-6L12 2.6Z"
                  strokeLinejoin="round"
                />
                <path d="m8.6 11.9 2.4 2.4 4.4-4.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <div className="copy">
              <b>14-Day Money-Back Guarantee</b>
              <span>No questions asked</span>
            </div>
          </div>
          <div className="nx-plan-foot">
            [ Secure checkout via Polar · instant private-repo access after purchase ]
          </div>
          <p className="nx-plan-note">This is the launch price. Prices will increase soon.</p>
          <div className="nx-plan-proof">
            <TrustMrrBadge />
          </div>
        </div>
      </section>

      <footer className="nx-footer">
        <div className="nx-wrap">
          <div className="nx-disclaimer">
            <b>About this challenge.</b> One attempt per browser. Discount codes are single-tier
            and may be withdrawn or capped at any time. AgentsKit is not affiliated with, endorsed
            by, or sponsored by Anthropic.
            <br />
            <br />
            <a href="/">← Back to agentskit.co</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
