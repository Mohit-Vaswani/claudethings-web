import type { MetadataRoute } from "next";
import { TOOLS } from "./tools/toolsData";

const BASE = "https://claudethings.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Individual tool pages are derived from the registry, so new tools added to
  // toolsData.ts appear in the sitemap automatically.
  const toolPages: MetadataRoute.Sitemap = TOOLS.filter((t) => t.indexable).map((t) => ({
    url: `${BASE}${t.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...toolPages,
    { url: `${BASE}/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/refund`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
