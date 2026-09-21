"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookOpen, Building2, Clock3, ExternalLink, GraduationCap, MapPin, Search, RotateCcw } from "lucide-react";
import type { Locale } from "@/data/content";
import { PROGRAMMES, PROGRAMME_CITIES, PROGRAMME_FIELDS, PROGRAMME_LEVELS, PROGRAMME_UNIVERSITIES } from "@/data/programmes";
import { UNIVERSITY_ORDER, UNIVERSITY_UI } from "@/data/university-ui";

export function ProgrammeDirectory({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [university, setUniversity] = useState("");
  const [city, setCity] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PROGRAMMES.filter((programme) => {
      const searchBlob = [programme.name, programme.universityName, programme.universityShortName, programme.field, programme.city, ...(programme.specialisations ?? [])].join(" ").toLowerCase();
      const fieldMatch = !field || programme.field.toLowerCase().includes(field.toLowerCase()) || field.toLowerCase().includes(programme.field.toLowerCase());
      const cityMatch = !city || programme.city.toLowerCase().includes(city.toLowerCase()) || (programme.campus ?? "").toLowerCase().includes(city.toLowerCase());
      return (!q || searchBlob.includes(q))
        && (!level || programme.level === level)
        && fieldMatch
        && (!university || programme.universityShortName === university)
        && cityMatch;
    });
  }, [query, level, field, university, city]);

  const institutionResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const universitiesWithExactResults = new Set(results.map((programme) => programme.universityShortName));

    return UNIVERSITY_ORDER
      .filter((slug) => slug !== "bright")
      .map((slug) => ({ slug, ...UNIVERSITY_UI[slug] }))
      .filter((institution) => {
        const searchBlob = [
          institution.name,
          institution.shortName,
          institution.arabicName,
          institution.city,
          institution.summaryEn,
          institution.summaryAr,
          ...(institution.studyAreasEn ?? []),
          ...(institution.studyAreasAr ?? []),
        ].join(" ").toLowerCase();

        const fieldMatch = !field || (institution.studyAreasEn ?? []).some((area) => {
          const a = area.toLowerCase();
          const f = field.toLowerCase();
          return a.includes(f) || f.includes(a);
        });
        const universityMatch = !university || institution.shortName === university;
        const cityMatch = !city || institution.city.toLowerCase().includes(city.toLowerCase());
        const queryMatch = !q || searchBlob.includes(q);

        return queryMatch && fieldMatch && universityMatch && cityMatch;
      })
      .filter((institution) => !universitiesWithExactResults.has(institution.shortName));
  }, [query, field, university, city, results]);

  const reset = () => {
    setQuery("");
    setLevel("");
    setField("");
    setUniversity("");
    setCity("");
  };

  return (
    <section className="programme-directory" dir={isAr ? "rtl" : "ltr"}>
      <div className="programme-directory-hero">
        <div className="mx-auto max-w-[1280px] px-5 pb-12 pt-36 md:px-8 lg:px-12 lg:pb-16 lg:pt-40">
          <p className="directory-kicker">{isAr ? "اكتشف البرامج" : "PROGRAMME DISCOVERY"}</p>
          <h1>{isAr ? "ابحث عن البرنامج أو الجامعة المناسبة في ماليزيا" : "Find the Right Programme or University in Malaysia"}</h1>
          <p>
            {isAr
              ? "يمكنك الآن البحث في جميع الجامعات والمواقع والمراحل الدراسية الموجودة في منصة YAZ. نعرض تفاصيل البرامج الدقيقة عندما تكون موثقة، ونبقي بقية الجامعات متاحة للاستكشاف بدلاً من إخفائها."
              : "Browse all universities, locations and study levels available in YAZ. Exact programme details are shown where verified, while the rest of the institutions remain discoverable instead of being hidden."}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-8 lg:px-12 lg:py-14">
        <div className="programme-filter-panel">
          <label className="programme-search-box">
            <Search size={19} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={isAr ? "ابحث: UTM، الهندسة، علوم الحاسب، ماجستير..." : "Search: UTM, Engineering, Computer Science, Master's..."} />
          </label>

          <div className="programme-filter-grid">
            <FilterSelect label={isAr ? "المرحلة" : "Study level"} value={level} onChange={setLevel} options={PROGRAMME_LEVELS} allLabel={isAr ? "كل المراحل" : "All levels"} />
            <FilterSelect label={isAr ? "المجال" : "Field"} value={field} onChange={setField} options={PROGRAMME_FIELDS} allLabel={isAr ? "كل المجالات" : "All fields"} />
            <FilterSelect label={isAr ? "الجامعة" : "University"} value={university} onChange={setUniversity} options={PROGRAMME_UNIVERSITIES} allLabel={isAr ? "كل الجامعات" : "All universities"} />
            <FilterSelect label={isAr ? "الموقع" : "Location"} value={city} onChange={setCity} options={PROGRAMME_CITIES} allLabel={isAr ? "كل المواقع" : "All locations"} />
          </div>

          <div className="programme-filter-meta">
            <span>
              {isAr
                ? `${results.length} برنامج موثق • ${institutionResults.length} جامعة إضافية للاستكشاف`
                : `${results.length} verified programmes • ${institutionResults.length} additional institutions to explore`}
            </span>
            <button type="button" onClick={reset}><RotateCcw size={15} />{isAr ? "إعادة ضبط" : "Reset filters"}</button>
          </div>
        </div>

        {results.length > 0 ? (
          <>
            <div className="programme-section-heading">
              <div>
                <p className="directory-kicker">{isAr ? "تفاصيل موثقة" : "VERIFIED DETAILS"}</p>
                <h2>{isAr ? "برامج تم التحقق من تفاصيلها" : "Programmes with verified details"}</h2>
              </div>
              <p>{isAr ? "الرسوم والمواعيد والمتطلبات تظهر فقط عندما تكون موثقة من المصدر الرسمي." : "Fees, intakes and requirements appear only when they have been verified from official sources."}</p>
            </div>

            <div className="programme-card-grid">
              {results.map((programme) => (
                <article key={programme.slug} className="programme-card">
                  <div className="programme-card-top">
                    <div className="programme-card-logo"><Image src={programme.universityLogo} alt={programme.universityShortName} fill className="object-contain" sizes="90px" /></div>
                    <div>
                      <p>{programme.universityShortName}</p>
                      <h2>{programme.name}</h2>
                    </div>
                  </div>

                  <div className="programme-card-meta">
                    <span><GraduationCap size={16} />{programme.level}</span>
                    <span><BookOpen size={16} />{programme.field}</span>
                    <span><MapPin size={16} />{programme.campus ?? programme.city}</span>
                    {programme.duration && <span><Clock3 size={16} />{programme.duration}</span>}
                  </div>

                  {programme.specialisations?.length ? (
                    <div className="programme-specialisation-row">
                      {programme.specialisations.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
                    </div>
                  ) : null}

                  <div className="programme-card-footer">
                    <Link href={`/${locale}/programmes/${programme.slug}`}>{isAr ? "عرض تفاصيل البرنامج" : "View programme details"}</Link>
                    <Link href={`/${locale}/universities/${programme.universitySlug}`} className="programme-university-link"><Building2 size={15} />{isAr ? "صفحة الجامعة" : "University profile"}</Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}

        {institutionResults.length > 0 ? (
          <div className="programme-institution-section">
            <div className="programme-section-heading">
              <div>
                <p className="directory-kicker">{isAr ? "استكشف المزيد" : "EXPLORE MORE"}</p>
                <h2>{isAr ? "جامعات إضافية مطابقة لبحثك" : "More institutions matching your search"}</h2>
              </div>
              <p>
                {isAr
                  ? level
                    ? "اختيار المرحلة لا يخفي الجامعات التي لم نُكمل بعد إدخال برامجها التفصيلية؛ افتح صفحة الجامعة للتحقق من البرامج المتاحة."
                    : "هذه الجامعات موجودة في قاعدة YAZ، لكن بعض تفاصيل البرامج ما زالت قيد الإضافة."
                  : level
                    ? "Choosing a study level does not hide institutions whose programme-level dataset is still being completed; open the university profile to check available study options."
                    : "These institutions are already in YAZ, while some programme-level details are still being added."}
              </p>
            </div>

            <div className="directory-grid programme-institution-grid">
              {institutionResults.map((institution) => (
                <article key={institution.slug} className="directory-card">
                  <div className="directory-card-top">
                    <div className="directory-logo-wrap">
                      <Image src={institution.logo} alt={institution.shortName} fill className="object-contain" sizes="118px" />
                    </div>
                    <span className="directory-type-pill">{isAr ? institution.typeAr : institution.typeEn}</span>
                  </div>
                  <div className="directory-card-copy">
                    <p className="directory-location"><MapPin size={15} />{institution.city}</p>
                    <h2>{isAr ? institution.arabicName : institution.name}</h2>
                    <p className="directory-summary">{isAr ? institution.summaryAr : institution.summaryEn}</p>
                    <div className="directory-area-tags">
                      {(isAr ? institution.studyAreasAr : institution.studyAreasEn).slice(0, 5).map((area) => <span key={area}>{area}</span>)}
                    </div>
                  </div>
                  <div className="directory-card-actions">
                    <Link className="directory-profile-link" href={`/${locale}/universities/${institution.slug}`}>
                      <Building2 size={15} />{isAr ? "عرض صفحة الجامعة" : "View university profile"}
                    </Link>
                    <a className="directory-official-link" href={institution.officialUrl} target="_blank" rel="noreferrer">
                      <ExternalLink size={14} />{isAr ? "الموقع الرسمي" : "Official site"}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}

        {results.length === 0 && institutionResults.length === 0 ? (
          <div className="programme-empty-state">
            <Search size={28} />
            <h2>{isAr ? "لا توجد نتائج مطابقة" : "No matching results"}</h2>
            <p>{isAr ? "جرّب تغيير كلمات البحث أو إزالة أحد الفلاتر." : "Try another search term or remove one of the filters."}</p>
            <button type="button" onClick={reset}>{isAr ? "عرض كل الخيارات" : "Show all options"}</button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FilterSelect({ label, value, onChange, options, allLabel }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string }) {
  return (
    <label className="programme-filter-control">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}
