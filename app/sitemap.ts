import type { MetadataRoute } from "next";
import { UNIVERSITY_UI } from "@/data/university-ui";
import { LANGUAGE_INSTITUTES } from "@/data/language-institutes";
import { PROGRAMMES } from "@/data/programmes";
import { getSiteUrl } from "@/lib/seo";

const locales = ["en", "ar"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const root = `${base}/${locale}`;

    entries.push(
      { url: root, lastModified: now, changeFrequency: "weekly", priority: 1 },
      { url: `${root}/universities`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${root}/programmes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${root}/language-institutes`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    );

    for (const slug of Object.keys(UNIVERSITY_UI)) {
      if (slug === "bright") continue;
      entries.push({
        url: `${root}/universities/${slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }

    for (const institute of LANGUAGE_INSTITUTES) {
      entries.push({
        url: `${root}/language-institutes/${institute.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const programme of PROGRAMMES) {
      entries.push({
        url: `${root}/programmes/${programme.slug}`,
        lastModified: programme.verifiedAt ? new Date(programme.verifiedAt) : now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
