/**
 * Registry + content model for the /prompts section.
 *
 * Each collection lives in ./collections/<short-name>.ts and is routed at
 * /prompts/<slug> by app/prompts/[slug]/page.tsx. The /prompts index and the
 * sitemap both read COLLECTIONS, so adding a collection here publishes it
 * everywhere automatically.
 */

export interface PromptItem {
  /** Short handle shown in the card header, e.g. "The dataset profiler". */
  title: string;
  /** The copy-paste prompt text. [Bracketed] parts are user placeholders. */
  prompt: string;
  /** One-liner explaining why the prompt works. */
  note?: string;
}

export interface PromptCollection {
  /** URL slug under /prompts/, e.g. "claude-prompts-for-data-analysis". */
  slug: string;
  /** Short category label, e.g. "Data analysis". */
  label: string;
  icon: string;
  /** On-page H1. */
  title: string;
  /** <title> tag. */
  metaTitle: string;
  /** Meta description + index-card copy. */
  description: string;
  /** Intro paragraphs. */
  intro: string[];
  /** "How to use these prompts" bullets. */
  howToUse: string[];
  prompts: PromptItem[];
  /** Practical tips shown after the prompts. */
  tips: { title: string; body: string }[];
  faq: { q: string; a: string }[];
}

import { dataAnalysis } from "./collections/data-analysis";
import { writing } from "./collections/writing";
import { business } from "./collections/business";
import { coding } from "./collections/coding";
import { marketing } from "./collections/marketing";

export const COLLECTIONS: PromptCollection[] = [
  dataAnalysis,
  writing,
  business,
  coding,
  marketing,
];

export function getCollection(slug: string): PromptCollection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}
