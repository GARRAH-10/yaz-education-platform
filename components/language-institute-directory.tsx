"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, ExternalLink, Languages, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { LanguageInstitute } from "@/data/language-institutes";
import type { Locale } from "@/data/content";

type Focus = "all" | "general" | "academic" | "ielts" | "business" | "junior" | "online";

const focusOptions: Array<{ key: Focus; en: string; ar: string }> = [
  { key: "all", en: "All programmes", ar: "كل البرامج" },
  { key: "general", en: "General English", ar: "الإنجليزية العامة" },
  { key: "academic", en: "Academic / Pathway", ar: "الأكاديمية / مسار الجامعة" },
  { key: "ielts", en: "IELTS / Test Prep", ar: "IELTS / التحضير للاختبارات" },
  { key: "business", en: "Business / Workplace", ar: "الأعمال / مكان العمل" },
  { key: "junior", en: "Junior / Camps", ar: "الناشئون / المعسكرات" },
  { key: "online", en: "Online", ar: "أونلاين" },
];

export function LanguageInstituteDirectory({ locale, institutes }: { locale: Locale; institutes: LanguageInstitute[] }) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("all");
  const [focus, setFocus] = useState<Focus>("all");

  const locations = useMemo(() => {
    const all = new Set<string>();
    institutes.forEach((item) => item.locations.forEach((place) => all.add(place)));
    return Array.from(all).sort();
  }, [institutes]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return institutes.filter((item) => {
      const text = [item.name, item.shortName, item.arabicName, item.city, ...item.coursesEn, ...item.coursesAr].join(" ").toLowerCase();
      const matchesQuery = !q || text.includes(q);
      const matchesLocation = location === "all" || item.locations.includes(location);
      const matchesFocus = focus === "all" || item.focus.includes(focus);
      return matchesQuery && matchesLocation && matchesFocus;
    });
  }, [query, location, focus, institutes]);

  const clear = () => {
    setQuery("");
    setLocation("all");
    setFocus("all");
  };

  return (
    <section className="language-directory-section">
      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="language-filter-panel">
          <div className="language-search-field">
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isAr ? "ابحث باسم المعهد أو البرنامج..." : "Search institute or programme..."}
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button> : null}
          </div>

          <label>
            <span>{isAr ? "الموقع" : "Location"}</span>
            <select value={location} onChange={(event) => setLocation(event.target.value)}>
              <option value="all">{isAr ? "كل المواقع" : "All locations"}</option>
              {locations.map((place) => <option key={place} value={place}>{place}</option>)}
            </select>
          </label>

          <label>
            <span>{isAr ? "نوع البرنامج" : "Programme type"}</span>
            <select value={focus} onChange={(event) => setFocus(event.target.value as Focus)}>
              {focusOptions.map((item) => <option key={item.key} value={item.key}>{isAr ? item.ar : item.en}</option>)}
            </select>
          </label>
        </div>

        <div className="language-results-head">
          <div>
            <p className="directory-kicker">{isAr ? "نتائج البحث" : "SEARCH RESULTS"}</p>
            <h2>{isAr ? `${results.length} معاهد متاحة` : `${results.length} institutes available`}</h2>
          </div>
          {(query || location !== "all" || focus !== "all") ? (
            <button type="button" onClick={clear} className="directory-reset">{isAr ? "إعادة الضبط" : "Reset filters"}</button>
          ) : null}
        </div>

        {results.length ? (
          <div className="language-card-grid">
            {results.map((institute) => (
              <article key={institute.slug} className="language-card">
                <div className="language-card-brand">
                  {institute.logo ? (
                    <div className="relative h-20 w-full">
                      <Image src={institute.logo} alt={institute.name} fill className="object-contain" sizes="260px" />
                    </div>
                  ) : (
                    <div className="language-wordmark" aria-hidden="true">{institute.shortName}</div>
                  )}
                </div>
                <div className="language-card-body">
                  <div className="language-card-meta"><MapPin size={16} /><span>{institute.city}</span></div>
                  <div className="language-type-pill"><Languages size={15} />{isAr ? institute.typeAr : institute.typeEn}</div>
                  <h3>{isAr ? institute.arabicName : institute.name}</h3>
                  <p>{isAr ? institute.summaryAr : institute.summaryEn}</p>
                  <div className="language-course-chips">
                    {(isAr ? institute.coursesAr : institute.coursesEn).slice(0, 4).map((course) => <span key={course}>{course}</span>)}
                  </div>
                </div>
                <div className="language-card-actions">
                  <Link href={`/${locale}/language-institutes/${institute.slug}`}>
                    {isAr ? "عرض الملف" : "View profile"}<ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
                  </Link>
                  <a href={institute.officialUrl} target="_blank" rel="noreferrer" aria-label={`${institute.name} official website`}>
                    <ExternalLink size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="directory-empty-state">
            <BookOpenText size={34} />
            <h3>{isAr ? "لا توجد نتائج مطابقة" : "No matching institutes"}</h3>
            <p>{isAr ? "جرّب تغيير الموقع أو نوع البرنامج أو عبارة البحث." : "Try changing the location, programme type or search phrase."}</p>
            <button type="button" onClick={clear}>{isAr ? "عرض كل المعاهد" : "Show all institutes"}</button>
          </div>
        )}
      </div>
    </section>
  );
}
