import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { getUniversities, getLanguageInstitutes, getProgrammes } from "@/lib/catalog";

const locales = ["en", "ar"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  const [universities, institutes, programmes] = await Promise.all([
    getUniversities(),
    getLanguageInstitutes(),
    getProgrammes(),
  ]);

  for (const locale of locales) {
    const root = `${base}/${locale}`;
    entries.push(
      { url: root, lastModified: now, changeFrequency: "weekly", priority: 1 },
      { url: `${root}/universities`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${root}/programmes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
      { url: `${root}/language-institutes`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    );

    for (const university of universities) {
      entries.push({
        url: `${root}/universities/${university.slug}`,
        lastModified: university.verifiedAt ? new Date(university.verifiedAt) : now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
    for (const institute of institutes) {
      entries.push({ url: `${root}/language-institutes/${institute.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.75 });
    }
    for (const programme of programmes) {
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
