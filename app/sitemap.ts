import type { MetadataRoute } from "next";
import { TOOLS } from "./tools/toolsData";
import { TOOL_GUIDES } from "./tools/guidesData";
import { COLLECTIONS } from "./prompts/promptsData";
import { POSTS } from "./blog/blogData";
import { USE_CASES } from "./use-cases/useCasesData";
import { COMPARISONS } from "./comparisons/comparisonsData";

const BASE = "https://claudethings.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Every content section is derived from its registry, so new entries in the
  // data files appear in the sitemap automatically.
  const toolPages: MetadataRoute.Sitemap = TOOLS.filter((t) => t.indexable).map((t) => ({
    url: `${BASE}${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = TOOL_GUIDES.map((g) => ({
    url: `${BASE}/tools/${g.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const promptPages: MetadataRoute.Sitemap = COLLECTIONS.map((c) => ({
    url: `${BASE}/prompts/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const useCasePages: MetadataRoute.Sitemap = USE_CASES.map((u) => ({
    url: `${BASE}/use-cases/${u.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const comparisonPages: MetadataRoute.Sitemap = COMPARISONS.map((c) => ({
    url: `${BASE}/comparisons/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/prompts`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/use-cases`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/comparisons`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...promptPages,
    ...blogPages,
    ...useCasePages,
    ...comparisonPages,
    ...toolPages,
    ...guidePages,
    { url: `${BASE}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
