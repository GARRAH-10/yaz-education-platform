"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ExternalLink, Filter, MapPin, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { UniversityCatalogItem } from "@/lib/catalog-types";
import type { Locale } from "@/data/content";

type TypeFilter = "all" | "public" | "private" | "college";
type StudyFilter = "all" | "engineering" | "computing" | "business" | "health" | "science" | "arts" | "law" | "hospitality" | "education";

const STUDY_FILTERS: Array<{ key: StudyFilter; en: string; ar: string; terms: string[] }> = [
  { key: "all", en: "All study areas", ar: "جميع المجالات", terms: [] },
  { key: "engineering", en: "Engineering", ar: "الهندسة", terms: ["engineering", "manufacturing", "electronics", "built environment", "architecture"] },
  { key: "computing", en: "Computing & IT", ar: "الحوسبة وتقنية المعلومات", terms: ["comput", "information technology", "artificial intelligence", "data", "cybersecurity", "digital", "fintech"] },
  { key: "business", en: "Business & Management", ar: "الأعمال والإدارة", terms: ["business", "management", "economics", "accounting", "technopreneurship"] },
  { key: "health", en: "Health & Medical", ar: "الطب والعلوم الصحية", terms: ["health", "medical", "medicine", "pharmacy", "nursing", "dentistry", "biomedical"] },
  { key: "science", en: "Science", ar: "العلوم", terms: ["science", "natural sciences", "applied sciences"] },
  { key: "arts", en: "Arts, Design & Media", ar: "الفنون والتصميم والإعلام", terms: ["arts", "design", "media", "communication", "music", "creative"] },
  { key: "law", en: "Law", ar: "القانون", terms: ["law"] },
  { key: "hospitality", en: "Hospitality & Tourism", ar: "الضيافة والسياحة", terms: ["hospitality", "tourism", "culinary"] },
  { key: "education", en: "Education & Humanities", ar: "التربية والعلوم الإنسانية", terms: ["education", "humanities", "human sciences", "islamic studies", "social sciences"] },
];

function categoryFor(typeEn: string): TypeFilter {
  const value = typeEn.toLowerCase();
  if (value.includes("public")) return "public";
  if (value.includes("college")) return "college";
  return "private";
}

export function UniversityDirectory({ locale, items }: { locale: Locale; items: UniversityCatalogItem[] }) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("all");
  const [location, setLocation] = useState("all");
  const [study, setStudy] = useState<StudyFilter>("all");

  const locations = useMemo(() => {
    const values = new Set<string>();
    items.forEach((item) => {
      item.city.split("/").map((place) => place.trim()).filter(Boolean).forEach((place) => values.add(place));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [items]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const studyTerms = STUDY_FILTERS.find((item) => item.key === study)?.terms ?? [];

    return items.filter((item) => {
      const searchable = [item.shortName, item.name, item.arabicName, item.city, item.typeEn, item.typeAr, item.summaryEn, item.summaryAr, ...item.studyAreasEn, ...item.studyAreasAr]
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesType = type === "all" || categoryFor(item.typeEn) === type;
      const matchesLocation = location === "all" || item.city.toLowerCase().includes(location.toLowerCase());
      const areaText = item.studyAreasEn.join(" ").toLowerCase();
      const matchesStudy = study === "all" || studyTerms.some((term) => areaText.includes(term));
      return matchesQuery && matchesType && matchesLocation && matchesStudy;
    });
  }, [query, type, location, study, items]);

  const hasFilters = query || type !== "all" || location !== "all" || study !== "all";
  const reset = () => {
    setQuery("");
    setType("all");
    setLocation("all");
    setStudy("all");
  };

  return (
    <section className="directory-section" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <div className="directory-toolbar">
          <div className="directory-search-wrap">
            <Search size={19} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isAr ? "ابحث باسم الجامعة أو المجال..." : "Search by university or study area..."}
              aria-label={isAr ? "البحث في الجامعات" : "Search universities"}
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label={isAr ? "مسح البحث" : "Clear search"}><X size={17} /></button> : null}
          </div>

          <div className="directory-filter-grid">
            <label>
              <span><Building2 size={15} /> {isAr ? "نوع المؤسسة" : "Institution type"}</span>
              <select value={type} onChange={(event) => setType(event.target.value as TypeFilter)}>
                <option value="all">{isAr ? "الكل" : "All types"}</option>
                <option value="public">{isAr ? "حكومية" : "Public"}</option>
                <option value="private">{isAr ? "خاصة" : "Private"}</option>
                <option value="college">{isAr ? "كلية" : "College"}</option>
              </select>
            </label>

            <label>
              <span><MapPin size={15} /> {isAr ? "الموقع" : "Location"}</span>
              <select value={location} onChange={(event) => setLocation(event.target.value)}>
                <option value="all">{isAr ? "كل المواقع" : "All locations"}</option>
                {locations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>

            <label>
              <span><Filter size={15} /> {isAr ? "مجال الدراسة" : "Study area"}</span>
              <select value={study} onChange={(event) => setStudy(event.target.value as StudyFilter)}>
                {STUDY_FILTERS.map((item) => <option key={item.key} value={item.key}>{isAr ? item.ar : item.en}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="directory-results-head">
          <div>
            <strong>{filtered.length}</strong>
            <span>{isAr ? " مؤسسة مطابقة" : filtered.length === 1 ? " institution found" : " institutions found"}</span>
          </div>
          {hasFilters ? <button type="button" onClick={reset}>{isAr ? "إعادة ضبط الفلاتر" : "Reset filters"}</button> : null}
        </div>

        {filtered.length ? (
          <div className="directory-grid">
            {filtered.map((item) => {
              const areas = isAr ? item.studyAreasAr : item.studyAreasEn;
              return (
                <article key={item.slug} className="directory-card">
                  <div className="directory-card-top">
                    <div className="directory-logo-wrap">
                      <Image src={item.logo} alt={`${item.name} logo`} fill className="object-contain" sizes="110px" />
                    </div>
                    <span className="directory-type-pill">{isAr ? item.typeAr : item.typeEn}</span>
                  </div>
                  <div className="directory-card-copy">
                    <p className="directory-location"><MapPin size={15} /> {item.city}, Malaysia</p>
                    <h2>{isAr ? item.arabicName : item.name}</h2>
                    <p className="directory-summary">{isAr ? item.summaryAr : item.summaryEn}</p>
                    <div className="directory-area-tags">
                      {areas.slice(0, 4).map((area) => <span key={area}>{area}</span>)}
                    </div>
                  </div>
                  <div className="directory-card-actions">
                    <Link href={`/${locale}/universities/${item.slug}`} className="directory-profile-link">
                      {isAr ? "عرض ملف الجامعة" : "View university"}
                      <ArrowRight size={16} className={isAr ? "rotate-180" : ""} />
                    </Link>
                    <a href={item.officialUrl} target="_blank" rel="noreferrer" className="directory-official-link" aria-label={`${item.name} official website`}>
                      {isAr ? "الموقع الرسمي" : "Official site"} <ExternalLink size={14} />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="directory-empty">
            <Search size={28} />
            <h2>{isAr ? "لم نجد نتائج مطابقة" : "No matching institutions"}</h2>
            <p>{isAr ? "جرّب تغيير البحث أو إزالة بعض الفلاتر." : "Try a broader search or remove one of the filters."}</p>
            <button type="button" onClick={reset}>{isAr ? "عرض جميع الجامعات" : "Show all institutions"}</button>
          </div>
        )}
      </div>
    </section>
  );
}
