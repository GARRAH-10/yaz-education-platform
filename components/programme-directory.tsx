"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, Building2, Check, Clock3, ExternalLink, GitCompareArrows, GraduationCap, MapPin, Search, RotateCcw, Trash2, X } from "lucide-react";
import type { Locale } from "@/data/content";
import type { ProgrammeRecord } from "@/data/programmes";
import type { UniversityCatalogItem } from "@/lib/catalog-types";
import { STUDY_FIELD_GROUPS, STUDY_LEVELS, fieldMatches, programmeFieldMatches, queryMatchesStudyTerms, studyFieldLabel } from "@/data/study-fields";

export function ProgrammeDirectory({ locale, programmes, institutions, initialField = "", initialLevel = "", initialQuery = "" }: { locale: Locale; programmes: ProgrammeRecord[]; institutions: UniversityCatalogItem[]; initialField?: string; initialLevel?: string; initialQuery?: string }) {
  const isAr = locale === "ar";
  const [query, setQuery] = useState(initialQuery);
  const [level, setLevel] = useState(initialLevel);
  const [field, setField] = useState(initialField);
  const [university, setUniversity] = useState("");
  const [city, setCity] = useState("");
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [compareNotice, setCompareNotice] = useState("");
  const [comparePickerOpen, setComparePickerOpen] = useState(false);
  const [comparePickerQuery, setComparePickerQuery] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("yaz-programme-compare");
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return;
      const valid = parsed.filter((slug): slug is string => typeof slug === "string" && programmes.some((programme) => programme.slug === slug));
      setCompareSlugs(valid.slice(0, 3));
    } catch {
      // Ignore malformed or unavailable local storage.
    }
  }, [programmes]);

  useEffect(() => {
    try {
      window.localStorage.setItem("yaz-programme-compare", JSON.stringify(compareSlugs));
    } catch {
      // Comparison still works for the current page even if storage is unavailable.
    }
  }, [compareSlugs]);

  const levels = useMemo(() => [...new Set([...STUDY_LEVELS, ...programmes.map((item) => item.level)])], [programmes]);
  const universities = useMemo(() => [...new Set(institutions.map((item) => item.shortName))].sort(), [institutions]);
  const cities = useMemo(() => [...new Set(institutions.flatMap((item) => item.city.split("/").map((city) => city.trim())))].filter(Boolean).sort(), [institutions]);
  const selectedFieldLabel = studyFieldLabel(field, locale);
  const selectedCompareProgrammes = useMemo(
    () => compareSlugs.map((slug) => programmes.find((programme) => programme.slug === slug)).filter((programme): programme is ProgrammeRecord => Boolean(programme)),
    [compareSlugs, programmes],
  );
  const compareHref = `/${locale}/programmes/compare?ids=${encodeURIComponent(compareSlugs.join(","))}`;

  const comparePickerProgrammes = useMemo(() => {
    const q = comparePickerQuery.trim().toLowerCase();
    const firstSelected = selectedCompareProgrammes[0];
    return programmes
      .filter((programme) => !compareSlugs.includes(programme.slug))
      .filter((programme) => {
        if (!q) return true;
        const blob = [programme.name, programme.universityName, programme.universityShortName, programme.field, programme.city, programme.campus ?? "", ...(programme.specialisations ?? [])].join(" ").toLowerCase();
        return blob.includes(q);
      })
      .sort((a, b) => {
        if (!firstSelected) return a.universityShortName.localeCompare(b.universityShortName);
        const score = (programme: ProgrammeRecord) =>
          (programme.field === firstSelected.field ? 4 : 0) +
          (programme.level === firstSelected.level ? 2 : 0) +
          (programme.universityShortName !== firstSelected.universityShortName ? 1 : 0);
        return score(b) - score(a);
      });
  }, [comparePickerQuery, compareSlugs, programmes, selectedCompareProgrammes]);

  const toggleCompare = (slug: string) => {
    setCompareNotice("");
    setCompareSlugs((current) => {
      if (current.includes(slug)) return current.filter((item) => item !== slug);
      if (current.length >= 3) {
        setCompareNotice(isAr ? "يمكنك مقارنة 3 برامج كحد أقصى." : "You can compare up to 3 programmes at a time.");
        return current;
      }
      return [...current, slug];
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programmes.filter((programme) => {
      const searchBlob = [programme.name, programme.universityName, programme.universityShortName, programme.field, programme.city, ...(programme.specialisations ?? [])].join(" ").toLowerCase();
      const programmeFieldBlob = [programme.name, programme.field, ...(programme.specialisations ?? [])].join(" ");
      const fieldMatch = programmeFieldMatches(programmeFieldBlob, field);
      const cityMatch = !city || programme.city.toLowerCase().includes(city.toLowerCase()) || (programme.campus ?? "").toLowerCase().includes(city.toLowerCase());
      return queryMatchesStudyTerms(searchBlob, q)
        && (!level || programme.level === level)
        && fieldMatch
        && (!university || programme.universityShortName === university)
        && cityMatch;
    });
  }, [query, level, field, university, city, programmes]);

  const institutionResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const universitiesWithExactResults = new Set(results.map((programme) => programme.universityShortName));

    return institutions.filter((institution) => {
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

        const fieldMatch = !field || (institution.studyAreasEn ?? []).some((area) => fieldMatches(area, field));
        const universityMatch = !university || institution.shortName === university;
        const cityMatch = !city || institution.city.toLowerCase().includes(city.toLowerCase());
        const queryMatch = queryMatchesStudyTerms(searchBlob, q);

        return queryMatch && fieldMatch && universityMatch && cityMatch;
      })
      .filter((institution) => !universitiesWithExactResults.has(institution.shortName));
  }, [query, field, university, city, results, institutions]);

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
            <FilterSelect label={isAr ? "المرحلة" : "Study level"} value={level} onChange={setLevel} options={levels} allLabel={isAr ? "كل المراحل" : "All levels"} />
            <FieldSelect locale={locale} value={field} onChange={setField} />
            <FilterSelect label={isAr ? "الجامعة" : "University"} value={university} onChange={setUniversity} options={universities} allLabel={isAr ? "كل الجامعات" : "All universities"} />
            <FilterSelect label={isAr ? "الموقع" : "Location"} value={city} onChange={setCity} options={cities} allLabel={isAr ? "كل المواقع" : "All locations"} />
          </div>

          <div className="programme-filter-meta">
            <span>
              {isAr
                ? field
                  ? `${results.length} برنامج موثق في ${selectedFieldLabel} • ${institutionResults.length} جامعة ذات مجالات مرتبطة للاستكشاف`
                  : `${results.length} برنامج موثق • ${institutionResults.length} جامعة إضافية للاستكشاف`
                : field
                  ? `${results.length} verified ${selectedFieldLabel} programme records • ${institutionResults.length} related institutions to explore`
                  : `${results.length} verified programme records • ${institutionResults.length} additional institutions to explore`}
            </span>
            <button type="button" onClick={reset}><RotateCcw size={15} />{isAr ? "إعادة ضبط" : "Reset filters"}</button>
          </div>
          <p className="programme-data-note">{isAr ? "قائمة المجالات شاملة ومستقلة عن عدد سجلات البرامج الموثقة. إذا لم تكن تفاصيل برنامج محدد مدخلة بعد، سنعرض الجامعات المطابقة للمجال بدلاً من اختلاق بيانات برنامج." : "The field list is comprehensive and independent of the number of verified programme records. When a specific programme has not been entered yet, matching institutions are shown instead of inventing programme data."}</p>
        </div>

        {field && results.length === 0 && institutionResults.length > 0 ? (
          <div className="programme-specific-field-notice">
            <BookOpen size={20} />
            <div>
              <strong>{isAr ? `لا توجد حالياً سجلات برامج موثقة مطابقة تماماً لـ ${selectedFieldLabel}` : `No exact verified ${selectedFieldLabel} programme records are stored yet`}</strong>
              <p>{isAr ? `نعرض أدناه جامعات لديها مجالات دراسية مرتبطة. هذا لا يعني تلقائياً أن برنامج ${selectedFieldLabel} متاح لديها بالمستوى المختار؛ يجب التحقق من صفحة الجامعة أو المصدر الرسمي.` : `The institutions below have related study areas. This does not automatically mean that ${selectedFieldLabel} is offered at the selected level; exact availability should be verified on the university profile or official source.`}</p>
            </div>
          </div>
        ) : null}

        {results.length > 0 ? (
          <>
            <div className="programme-section-heading">
              <div>
                <p className="directory-kicker">{isAr ? "تفاصيل موثقة" : "VERIFIED DETAILS"}</p>
                <h2>{isAr ? (field ? `برامج ${selectedFieldLabel} الموثقة` : "برامج تم التحقق من تفاصيلها") : (field ? `Verified ${selectedFieldLabel} programmes` : "Programmes with verified details")}</h2>
              </div>
              <p>{isAr ? "مواعيد القبول والمتطلبات تظهر عندما تكون موثقة من المصدر الرسمي. للحصول على أحدث الرسوم تواصل مع مستشار YAZ." : "Intakes and requirements appear when verified from official sources. Contact a YAZ advisor for the latest tuition fee."}</p>
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

                  <button
                    type="button"
                    className={`programme-compare-toggle ${compareSlugs.includes(programme.slug) ? "programme-compare-toggle-active" : ""}`}
                    aria-pressed={compareSlugs.includes(programme.slug)}
                    onClick={() => toggleCompare(programme.slug)}
                  >
                    {compareSlugs.includes(programme.slug) ? <Check size={16} /> : <GitCompareArrows size={16} />}
                    {compareSlugs.includes(programme.slug)
                      ? (isAr ? "تمت الإضافة للمقارنة" : "Added to compare")
                      : (isAr ? "أضف للمقارنة" : "Add to compare")}
                  </button>

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
                <h2>{isAr ? (field ? `جامعات للاستكشاف في مجال ${selectedFieldLabel}` : "جامعات إضافية مطابقة لبحثك") : (field ? `Institutions to explore for ${selectedFieldLabel}` : "More institutions matching your search")}</h2>
              </div>
              <p>
                {isAr
                  ? field
                    ? `هذه نتائج على مستوى مجال الدراسة. نعرض الجامعات ذات المجالات المرتبطة بـ ${selectedFieldLabel} عندما لا تكون تفاصيل البرنامج المحدد مدخلة بعد.`
                    : level
                      ? "اختيار المرحلة لا يخفي الجامعات التي لم نُكمل بعد إدخال برامجها التفصيلية؛ افتح صفحة الجامعة للتحقق من البرامج المتاحة."
                      : "هذه الجامعات موجودة في قاعدة YAZ، لكن بعض تفاصيل البرامج ما زالت قيد الإضافة."
                  : field
                    ? `These are study-area matches. Institutions with areas related to ${selectedFieldLabel} are shown when the exact programme record has not yet been entered.`
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
                    {field ? <p className="programme-requested-field"><strong>{isAr ? "المجال المطلوب:" : "Requested field:"}</strong> {selectedFieldLabel} <span>• {isAr ? "توفر البرنامج الدقيق يحتاج تحقق" : "exact programme availability to verify"}</span></p> : null}
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

      {selectedCompareProgrammes.length > 0 ? (
        <div className="programme-compare-tray" role="region" aria-label={isAr ? "البرامج المحددة للمقارنة" : "Selected programmes for comparison"}>
          <div className="programme-compare-tray-copy">
            <div className="programme-compare-tray-title">
              <GitCompareArrows size={19} />
              <strong>{isAr ? `${selectedCompareProgrammes.length} من 3 للمقارنة` : `${selectedCompareProgrammes.length} of 3 selected`}</strong>
            </div>
            <div className="programme-compare-chips">
              {selectedCompareProgrammes.map((programme) => (
                <button key={programme.slug} type="button" onClick={() => toggleCompare(programme.slug)} title={isAr ? "إزالة من المقارنة" : "Remove from comparison"}>
                  <span>{programme.universityShortName}: {isAr && programme.arabicName ? programme.arabicName : programme.name}</span>
                  <Trash2 size={13} />
                </button>
              ))}
            </div>
            {compareNotice ? <p className="programme-compare-notice">{compareNotice}</p> : null}
          </div>
          <div className="programme-compare-tray-actions">
            <button type="button" className="programme-compare-clear" onClick={() => { setCompareSlugs([]); setCompareNotice(""); }}>
              {isAr ? "مسح" : "Clear"}
            </button>
            {selectedCompareProgrammes.length < 3 ? (
              <button type="button" className="programme-compare-add" onClick={() => { setComparePickerQuery(""); setComparePickerOpen(true); }}>
                {isAr ? "أضف برنامجاً" : selectedCompareProgrammes.length === 1 ? "Add another programme" : "Add third programme"}
              </button>
            ) : null}
            {selectedCompareProgrammes.length >= 2 ? (
              <Link href={compareHref} className="programme-compare-now">
                {isAr ? "قارن الآن" : "Compare now"}
                <GitCompareArrows size={16} />
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}

      {comparePickerOpen ? (
        <div className="programme-compare-picker-backdrop" role="presentation" onMouseDown={() => setComparePickerOpen(false)}>
          <div className="programme-compare-picker" role="dialog" aria-modal="true" aria-label={isAr ? "اختر برنامجاً للمقارنة" : "Choose a programme to compare"} onMouseDown={(event) => event.stopPropagation()}>
            <div className="programme-compare-picker-head">
              <div>
                <p className="directory-kicker">{isAr ? "المقارنة" : "COMPARE PROGRAMMES"}</p>
                <h2>{isAr ? "اختر البرنامج التالي" : "Choose another programme"}</h2>
                <p>{isAr ? "نعرض البرامج الأقرب للمجال والمرحلة المختارة أولاً، ويمكنك البحث عن أي برنامج آخر." : "Programmes with the same field and study level are shown first. You can also search for any other programme."}</p>
              </div>
              <button type="button" className="programme-compare-picker-close" onClick={() => setComparePickerOpen(false)} aria-label={isAr ? "إغلاق" : "Close"}><X size={20} /></button>
            </div>

            <label className="programme-compare-picker-search">
              <Search size={18} />
              <input value={comparePickerQuery} onChange={(event) => setComparePickerQuery(event.target.value)} placeholder={isAr ? "ابحث باسم البرنامج أو الجامعة أو المجال..." : "Search programme, university or field..."} autoFocus />
            </label>

            <div className="programme-compare-picker-list">
              {comparePickerProgrammes.slice(0, 40).map((programme) => {
                const firstSelected = selectedCompareProgrammes[0];
                const similar = firstSelected && programme.field === firstSelected.field && programme.level === firstSelected.level;
                return (
                  <article key={programme.slug} className="programme-compare-picker-item">
                    <div className="programme-compare-picker-logo"><Image src={programme.universityLogo} alt={programme.universityShortName} fill className="object-contain" sizes="64px" /></div>
                    <div className="programme-compare-picker-copy">
                      <div className="programme-compare-picker-meta">
                        <strong>{programme.universityShortName}</strong>
                        {similar ? <span>{isAr ? "مطابقة قريبة" : "Closest match"}</span> : null}
                      </div>
                      <h3>{isAr && programme.arabicName ? programme.arabicName : programme.name}</h3>
                      <p>{programme.level} · {studyFieldLabel(programme.field, locale)} · {programme.campus ?? programme.city}</p>
                    </div>
                    <button type="button" onClick={() => { toggleCompare(programme.slug); setComparePickerOpen(false); }}>
                      {isAr ? "إضافة" : "Add"}
                    </button>
                  </article>
                );
              })}
              {comparePickerProgrammes.length === 0 ? <p className="programme-compare-picker-empty">{isAr ? "لا توجد برامج مطابقة للبحث." : "No programmes match this search."}</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function FieldSelect({ locale, value, onChange }: { locale: Locale; value: string; onChange: (value: string) => void }) {
  const isAr = locale === "ar";
  return (
    <label className="programme-filter-control">
      <span>{isAr ? "المجال" : "Field"}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{isAr ? "كل المجالات" : "All fields"}</option>
        {STUDY_FIELD_GROUPS.map((group) => (
          <optgroup key={group.group} label={isAr ? group.groupAr : group.group}>
            {group.fields.map((item) => <option key={item.value} value={item.value}>{isAr ? item.labelAr : item.value}</option>)}
          </optgroup>
        ))}
      </select>
    </label>
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
