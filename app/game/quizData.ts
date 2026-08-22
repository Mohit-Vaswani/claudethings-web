/**
 * The AgentsKit discount challenge — question bank, scoring, and reward codes.
 *
 * HOW IT'S BUILT
 * Eight categories, three questions each. One question is drawn at random from
 * every category, so every run covers the same reasoning skills at the same
 * difficulty while no two runs are identical. Options are shuffled at draw
 * time too, so "the answer is always B" never becomes a strategy.
 *
 * HONESTY NOTE
 * Grading happens in the browser, and the reward codes below ship in the
 * client bundle, exactly like the India geo code in lib/geoDiscount.ts. Treat
 * all three as public. The real guard rail is Polar: cap the redemption count
 * (and set an expiry) on each code in the dashboard so a leaked code can't be
 * spread indefinitely.
 */

export type Question = {
  /** Stable id — persisted with the attempt so a reload can't reshuffle. */
  id: string;
  category: string;
  prompt: string;
  /** Optional monospace block (sequences, grids) shown under the prompt. */
  figure?: string;
  options: string[];
  /** Index into `options` before shuffling. */
  answer: number;
  /** Shown on the results screen, so a hard question still teaches something. */
  why: string;
};

/** Seconds allowed per question. Runs out = counted wrong, no going back. */
export const SECONDS_PER_QUESTION = 75;

/** One question is drawn from each of these pools, in this order. */
export const QUESTION_POOLS: Question[][] = [
  // ── 1. Number sequences ────────────────────────────────────────────────
  [
    {
      id: "seq-cubes-squares",
      category: "Sequence",
      prompt: "What number continues the sequence?",
      figure: "2,  12,  36,  80,  150,  ?",
      options: ["240", "252", "258", "276"],
      answer: 1,
      why: "Each term is n³ + n²: 1+1, 8+4, 27+9, 64+16, 125+25. Next is 216 + 36 = 252.",
    },
    {
      id: "seq-look-and-say",
      category: "Sequence",
      prompt: "What comes next?",
      figure: "1,  11,  21,  1211,  111221,  ?",
      options: ["122111", "312211", "13112221", "211231"],
      answer: 1,
      why: "Look-and-say: each term reads the one before it. 111221 is 'three 1s, two 2s, one 1' → 312211.",
    },
    {
      id: "seq-alternating-ops",
      category: "Sequence",
      prompt: "What number replaces the question mark?",
      figure: "4,  6,  12,  14,  28,  30,  ?",
      options: ["32", "56", "60", "62"],
      answer: 2,
      why: "The operations alternate +2, ×2, +2, ×2… After 30 comes ×2 = 60.",
    },
  ],

  // ── 2. Codes and number analogies ──────────────────────────────────────
  [
    {
      id: "code-positional-shift",
      category: "Cipher",
      prompt: "In a certain code, CLAUDE is written as DNDYIK. How is AGENT written?",
      options: ["BIHRY", "BIHSY", "BJHRY", "CIGRY"],
      answer: 0,
      why: "Each letter shifts forward by its position: +1, +2, +3, +4, +5. A→B, G→I, E→H, N→R, T→Y.",
    },
    {
      id: "code-row-rule",
      category: "Matrix",
      prompt: "Every row follows the same rule. What replaces the question mark?",
      figure: "2   3   →   7\n4   5   →   21\n6   7   →   ?",
      options: ["41", "43", "45", "49"],
      answer: 1,
      why: "The rule is (a × b) + 1: 6+1 = 7, 20+1 = 21, so 42+1 = 43.",
    },
    {
      id: "code-number-analogy",
      category: "Analogy",
      prompt: "Complete the analogy:  7 : 56  ::  11 : ?",
      options: ["110", "121", "132", "143"],
      answer: 2,
      why: "n maps to n(n+1): 7 × 8 = 56, so 11 × 12 = 132.",
    },
  ],

  // ── 3. Verbal reasoning ────────────────────────────────────────────────
  [
    {
      id: "verbal-odd-one-out",
      category: "Vocabulary",
      prompt: "Which word does NOT belong with the others?",
      options: ["Ephemeral", "Evanescent", "Perpetual", "Transitory"],
      answer: 2,
      why: "The other three all mean short-lived. Perpetual means the opposite: unending.",
    },
    {
      id: "verbal-miasma",
      category: "Analogy",
      prompt: "Cacophony : Sound  ::  Miasma : ?",
      options: ["Air", "Water", "Taste", "Light"],
      answer: 0,
      why: "A cacophony is unpleasant sound; a miasma is unpleasant, polluted air.",
    },
    {
      id: "verbal-apostate",
      category: "Analogy",
      prompt: "Iconoclast : Tradition  ::  Apostate : ?",
      options: ["Faith", "Law", "Custom", "Reason"],
      answer: 0,
      why: "An iconoclast attacks tradition; an apostate abandons faith.",
    },
  ],

  // ── 4. Formal deduction ────────────────────────────────────────────────
  [
    {
      id: "logic-syllogism",
      category: "Deduction",
      prompt:
        "All Zorbs are Blints. Some Blints are Crils. No Cril is a Drell. Which statement MUST be true?",
      options: [
        "Some Zorbs are Crils",
        "No Zorb is a Drell",
        "Some Blints are not Drells",
        "All Crils are Blints",
      ],
      answer: 2,
      why: "The Blints that are Crils cannot be Drells, so at least some Blints are not Drells. Nothing forces the other three.",
    },
    {
      id: "logic-knaves",
      category: "Deduction",
      prompt:
        "Truth-tellers always tell the truth; liars always lie. A says 'B is a liar.' B says 'C is a liar.' C says 'A and B are both liars.' How many liars are there?",
      options: ["1", "2", "3", "Cannot be determined"],
      answer: 1,
      why: "If C were truthful, B would be a liar — but then B's claim that C lies would be true, a contradiction. So C lies, which makes B's statement true (B truthful) and A's statement false (A lies). Liars: A and C.",
    },
    {
      id: "logic-ordering",
      category: "Deduction",
      prompt:
        "Five runners finish a race. Ann beat Ben. Cara finished after Dan but before Ann. Ben beat Eve. Who finished third?",
      options: ["Ann", "Ben", "Cara", "Dan"],
      answer: 0,
      why: "The only consistent order is Dan, Cara, Ann, Ben, Eve — Ann is third.",
    },
  ],

  // ── 5. Probability and counting ────────────────────────────────────────
  [
    {
      id: "prob-socks",
      category: "Probability",
      prompt:
        "A drawer holds 6 black socks and 8 brown socks. You pull two at random in the dark. What is the probability they match?",
      options: ["1/2", "43/91", "45/91", "48/91"],
      answer: 1,
      why: "C(6,2) + C(8,2) = 15 + 28 = 43 matching pairs out of C(14,2) = 91 total pairs.",
    },
    {
      id: "count-balloon",
      category: "Counting",
      prompt: "How many distinct arrangements are there of the letters in BALLOON?",
      options: ["630", "1260", "2520", "5040"],
      answer: 1,
      why: "Seven letters with L and O each repeated twice: 7! / (2! × 2!) = 5040 / 4 = 1260.",
    },
    {
      id: "prob-conditional",
      category: "Probability",
      prompt:
        "A bag holds 3 red and 4 blue balls. Two are drawn without replacement. Given that at least one is red, what is the probability both are red?",
      options: ["1/7", "1/5", "2/7", "1/3"],
      answer: 1,
      why: "P(both red) = 1/7. P(at least one red) = 1 − (4/7 × 3/6) = 5/7. Dividing gives 1/5.",
    },
  ],

  // ── 6. Quantitative traps ──────────────────────────────────────────────
  [
    {
      id: "quant-machines",
      category: "Rate",
      prompt:
        "If 3 machines make 3 widgets in 3 minutes, how long do 100 machines take to make 100 widgets?",
      options: ["1 minute", "3 minutes", "33 minutes", "100 minutes"],
      answer: 1,
      why: "Each machine takes 3 minutes per widget. A hundred machines working in parallel still finish in 3 minutes.",
    },
    {
      id: "quant-ages",
      category: "Algebra",
      prompt:
        "In 6 years, Ann will be twice as old as Ben was 3 years ago. Ann is 4 years older than Ben. How old is Ben now?",
      options: ["13", "16", "19", "22"],
      answer: 1,
      why: "(B + 4) + 6 = 2(B − 3) → B + 10 = 2B − 6 → B = 16.",
    },
    {
      id: "quant-markup",
      category: "Percentages",
      prompt:
        "A price is marked up 40%, then that new price is discounted 30%. Compared with the original, the final price is:",
      options: ["2% lower", "2% higher", "10% higher", "Unchanged"],
      answer: 0,
      why: "1.40 × 0.70 = 0.98, which is 2% below the original price.",
    },
  ],

  // ── 7. Spatial reasoning ───────────────────────────────────────────────
  [
    {
      id: "spatial-painted-cube",
      category: "Spatial",
      prompt:
        "A cube is painted on all six faces, then sliced into 64 identical smaller cubes. How many small cubes have paint on exactly two faces?",
      options: ["8", "12", "24", "36"],
      answer: 2,
      why: "Two painted faces means an edge position. A 4×4×4 cube has 12 edges with 2 non-corner cubes each: 12 × 2 = 24.",
    },
    {
      id: "spatial-clock",
      category: "Spatial",
      prompt: "What is the angle between the hour and minute hands at 3:40?",
      options: ["120°", "125°", "130°", "140°"],
      answer: 2,
      why: "The minute hand is at 240°; the hour hand is at 90° + 20° = 110°. The gap is 130°.",
    },
    {
      id: "spatial-die",
      category: "Spatial",
      prompt:
        "On a standard die, opposite faces sum to 7. You see 3 on top and 5 facing you. Which number can be on the right-hand face?",
      options: ["1", "2", "3", "4"],
      answer: 0,
      why: "Top 3 fixes the bottom at 4; front 5 fixes the back at 2. Only 1 and 6 remain for the sides.",
    },
  ],

  // ── 8. Lateral thinking ────────────────────────────────────────────────
  [
    {
      id: "lateral-days",
      category: "Lateral",
      prompt:
        "The day before two days after the day before tomorrow is Saturday. What day is it today?",
      options: ["Thursday", "Friday", "Saturday", "Sunday"],
      answer: 1,
      why: "'The day before tomorrow' is today. Two days after today, minus one day, is tomorrow — so tomorrow is Saturday and today is Friday.",
    },
    {
      id: "lateral-weighings",
      category: "Lateral",
      prompt:
        "You have 12 balls, one of which is a different weight (you don't know whether heavier or lighter), and a balance scale. What is the minimum number of weighings that always identifies the odd ball AND whether it is heavy or light?",
      options: ["2", "3", "4", "5"],
      answer: 1,
      why: "Three weighings suffice: each has 3 outcomes, so 3 weighings distinguish up to 27 cases — enough for the 24 here (12 balls × heavy/light).",
    },
    {
      id: "lateral-portrait",
      category: "Lateral",
      prompt:
        "A man looks at a portrait and says: 'Brothers and sisters I have none, but that man's father is my father's son.' Who is in the portrait?",
      options: ["His son", "His brother", "His nephew", "Himself"],
      answer: 0,
      why: "With no siblings, 'my father's son' is the speaker himself. So the speaker is the portrait subject's father — the portrait shows his son.",
    },
  ],
];

export const TOTAL_QUESTIONS = QUESTION_POOLS.length;

/** Discount tiers, richest first. `min` is the lowest score that earns it. */
export type Tier = {
  min: number;
  percent: number;
  /** Polar discount code. Public — see the honesty note above. */
  code: string;
  title: string;
  blurb: string;
};

export const TIERS: Tier[] = [
  {
    min: 7,
    percent: 50,
    code: "LPW2YQRI",
    title: "Exceptional",
    blurb: "Top band. Almost nobody clears seven of these under the clock.",
  },
  {
    min: 5,
    percent: 30,
    code: "OWQVCPAY",
    title: "Sharp",
    blurb: "Well above the average run. You reasoned through the hard half.",
  },
  {
    min: 3,
    percent: 10,
    code: "3SZE7VTV",
    title: "Solid",
    blurb: "A respectable score against a deliberately brutal set.",
  },
];

/** Score below the lowest tier and there is no code — one attempt only. */
export function tierForScore(score: number): Tier | null {
  return TIERS.find((t) => score >= t.min) ?? null;
}
