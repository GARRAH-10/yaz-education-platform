import { unstable_cache } from "next/cache";
import { getSupabasePublic } from "@/lib/supabase/public";
import { UNIVERSITY_ORDER, UNIVERSITY_UI } from "@/data/university-ui";
import { PROGRAMMES, type ProgrammeRecord } from "@/data/programmes";
import { LANGUAGE_INSTITUTES, LANGUAGE_INSTITUTE_BY_SLUG, type LanguageInstitute } from "@/data/language-institutes";
import type { UniversityCatalogItem } from "@/lib/catalog-types";

const universityFallback: UniversityCatalogItem[] = UNIVERSITY_ORDER
  .filter((slug) => slug !== "bright")
  .map((slug) => ({ slug, ...UNIVERSITY_UI[slug] }));

function typeArFromEnglish(value: string | null | undefined) {
  const text = (value ?? "").toLowerCase();
  if (text.includes("public")) return "جامعة حكومية";
  if (text.includes("college")) return "كلية خاصة";
  if (text.includes("language")) return "معهد لغة";
  if (text.includes("not-for-profit")) return "جامعة خاصة غير ربحية";
  return "جامعة خاصة";
}

function mergeUniversityRow(row: any): UniversityCatalogItem {
  const local = universityFallback.find((item) => item.slug === row.slug);
  return {
    slug: row.slug,
    shortName: row.short_name ?? local?.shortName ?? row.name,
    name: row.name ?? local?.name ?? row.slug,
    logo: row.logo_path ?? local?.logo ?? "/yaz-logo.png",
    arabicName: row.arabic_name ?? local?.arabicName ?? row.name,
    typeEn: row.institution_type ?? local?.typeEn ?? "University",
    typeAr: local?.typeAr ?? typeArFromEnglish(row.institution_type),
    city: row.city ?? local?.city ?? "Malaysia",
    campusEn: row.campus ?? local?.campusEn ?? row.city ?? "Malaysia",
    campusAr: local?.campusAr ?? row.campus ?? row.city ?? "ماليزيا",
    summaryEn: row.overview_en ?? local?.summaryEn ?? "Institution profile available through YAZ Education.",
    summaryAr: row.overview_ar ?? local?.summaryAr ?? "ملف المؤسسة متاح عبر YAZ Education.",
    studyAreasEn: row.study_areas_en?.length ? row.study_areas_en : local?.studyAreasEn ?? [],
    studyAreasAr: row.study_areas_ar?.length ? row.study_areas_ar : local?.studyAreasAr ?? [],
    officialUrl: row.official_url ?? local?.officialUrl ?? "#",
    verified: Boolean(row.verified ?? local?.verified),
    verifiedAt: row.verified_at ?? null,
  };
}

async function fetchUniversities(): Promise<UniversityCatalogItem[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return universityFallback;

  const { data, error } = await supabase
    .from("universities")
    .select("slug,name,short_name,arabic_name,city,institution_type,campus,overview_en,overview_ar,study_areas_en,study_areas_ar,official_url,logo_path,verified,verified_at")
    .eq("verified", true)
    .order("name");

  if (error || !data?.length) {
    if (error) console.error("Supabase university read failed; using fallback", error.message);
    return universityFallback;
  }

  return data.map(mergeUniversityRow);
}

async function fetchUniversityBySlug(slug: string): Promise<UniversityCatalogItem | null> {
  const fallback = universityFallback.find((item) => item.slug === slug) ?? null;
  const supabase = getSupabasePublic();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("universities")
    .select("slug,name,short_name,arabic_name,city,institution_type,campus,overview_en,overview_ar,study_areas_en,study_areas_ar,official_url,logo_path,verified,verified_at")
    .eq("slug", slug)
    .eq("verified", true)
    .maybeSingle();

  if (error || !data) return fallback;
  return mergeUniversityRow(data);
}

function inferField(name: string) {
  const text = name.toLowerCase();
  if (text.includes("artificial intelligence")) return "Artificial Intelligence";
  if (text.includes("cyber")) return "Cybersecurity";
  if (text.includes("data")) return "Data Science";
  if (text.includes("software")) return "Software Engineering";
  if (text.includes("engineering")) return "Engineering";
  if (text.includes("business")) return "Business";
  if (text.includes("information technology")) return "Information Technology";
  if (text.includes("computer")) return "Computer Science";
  return "Other";
}

function mapProgrammeRow(row: any): ProgrammeRecord {
  const uni = row.universities ?? {};
  const localUniversity = universityFallback.find((item) => item.slug === uni.slug);
  return {
    slug: row.slug,
    name: row.name,
    universityName: uni.name ?? localUniversity?.name ?? "University",
    universityShortName: uni.short_name ?? localUniversity?.shortName ?? "University",
    universitySlug: uni.slug ?? localUniversity?.slug ?? "",
    universityLogo: uni.logo_path ?? localUniversity?.logo ?? "/yaz-logo.png",
    city: uni.city ?? localUniversity?.city ?? row.campus ?? "Malaysia",
    level: row.level,
    field: row.field ?? inferField(row.name),
    arabicName: row.arabic_name ?? undefined,
    duration: row.duration ?? undefined,
    intakes: row.intakes?.length ? row.intakes : undefined,
    internationalFee: row.international_fee ?? undefined,
    internationalFeeAmount: row.international_fee_amount != null ? Number(row.international_fee_amount) : undefined,
    feeCurrency: row.fee_currency ?? undefined,
    feePeriod: row.fee_period ?? undefined,
    campus: row.campus ?? undefined,
    studyMode: row.study_mode ?? undefined,
    specialisations: row.specialisations?.length ? row.specialisations : undefined,
    academicRequirementsEn: row.academic_requirements_en ?? undefined,
    academicRequirementsAr: row.academic_requirements_ar ?? undefined,
    englishRequirementsEn: row.english_requirements_en ?? undefined,
    englishRequirementsAr: row.english_requirements_ar ?? undefined,
    requiredDocumentsEn: row.required_documents_en?.length ? row.required_documents_en : undefined,
    requiredDocumentsAr: row.required_documents_ar?.length ? row.required_documents_ar : undefined,
    accreditation: row.accreditation ?? undefined,
    scholarshipInfoEn: row.scholarship_info_en ?? undefined,
    scholarshipInfoAr: row.scholarship_info_ar ?? undefined,
    applicationNotesEn: row.application_notes_en ?? undefined,
    applicationNotesAr: row.application_notes_ar ?? undefined,
    sourceUrl: row.source_url ?? localUniversity?.officialUrl ?? "#",
    verifiedAt: row.verified_at ?? new Date().toISOString().slice(0, 10),
  };
}

async function fetchProgrammes(): Promise<ProgrammeRecord[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return PROGRAMMES;

  const { data, error } = await supabase
    .from("programmes")
    .select("slug,name,arabic_name,level,field,duration,campus,study_mode,intakes,international_fee,international_fee_amount,fee_currency,fee_period,specialisations,academic_requirements_en,academic_requirements_ar,english_requirements_en,english_requirements_ar,required_documents_en,required_documents_ar,accreditation,scholarship_info_en,scholarship_info_ar,application_notes_en,application_notes_ar,source_url,verified_at,universities!inner(slug,name,short_name,city,logo_path)")
    .not("verified_at", "is", null)
    .order("name");

  if (error || !data?.length) {
    if (error) console.error("Supabase programme read failed; using fallback", error.message);
    return PROGRAMMES;
  }
  return data.map(mapProgrammeRow);
}

async function fetchProgrammeBySlug(slug: string): Promise<ProgrammeRecord | null> {
  const fallback = PROGRAMMES.find((item) => item.slug === slug) ?? null;
  const supabase = getSupabasePublic();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("programmes")
    .select("slug,name,arabic_name,level,field,duration,campus,study_mode,intakes,international_fee,international_fee_amount,fee_currency,fee_period,specialisations,academic_requirements_en,academic_requirements_ar,english_requirements_en,english_requirements_ar,required_documents_en,required_documents_ar,accreditation,scholarship_info_en,scholarship_info_ar,application_notes_en,application_notes_ar,source_url,verified_at,universities!inner(slug,name,short_name,city,logo_path)")
    .eq("slug", slug)
    .not("verified_at", "is", null)
    .maybeSingle();

  if (error || !data) return fallback;
  return mapProgrammeRow(data);
}

const getUniversitiesCached = unstable_cache(fetchUniversities, ["catalog-universities"], {
  revalidate: 300,
  tags: ["catalog", "universities"],
});

const getUniversityBySlugCached = unstable_cache(fetchUniversityBySlug, ["catalog-university-by-slug"], {
  revalidate: 300,
  tags: ["catalog", "universities"],
});

const getProgrammesCached = unstable_cache(fetchProgrammes, ["catalog-programmes"], {
  revalidate: 300,
  tags: ["catalog", "programmes"],
});

const getProgrammeBySlugCached = unstable_cache(fetchProgrammeBySlug, ["catalog-programme-by-slug"], {
  revalidate: 300,
  tags: ["catalog", "programmes"],
});

export async function getUniversities(): Promise<UniversityCatalogItem[]> {
  return getUniversitiesCached();
}

export async function getUniversityBySlug(slug: string): Promise<UniversityCatalogItem | null> {
  return getUniversityBySlugCached(slug);
}

export async function getProgrammes(): Promise<ProgrammeRecord[]> {
  return getProgrammesCached();
}

export async function getProgrammeBySlug(slug: string): Promise<ProgrammeRecord | null> {
  return getProgrammeBySlugCached(slug);
}

export async function getProgrammesByUniversitySlug(slug: string): Promise<ProgrammeRecord[]> {
  const all = await getProgrammes();
  return all.filter((item) => item.universitySlug === slug);
}

function genericInstitute(row: any): LanguageInstitute {
  const local = LANGUAGE_INSTITUTE_BY_SLUG[row.slug];
  if (local) {
    return {
      ...local,
      name: row.name ?? local.name,
      shortName: row.short_name ?? local.shortName,
      arabicName: row.arabic_name ?? local.arabicName,
      city: row.city ?? local.city,
      locations: row.city ? row.city.split("/").map((item: string) => item.trim()) : local.locations,
      typeEn: row.institution_type ?? local.typeEn,
      summaryEn: row.overview_en ?? local.summaryEn,
      summaryAr: row.overview_ar ?? local.summaryAr,
      coursesEn: row.course_types_en?.length ? row.course_types_en : local.coursesEn,
      coursesAr: row.course_types_ar?.length ? row.course_types_ar : local.coursesAr,
      officialUrl: row.official_url ?? local.officialUrl,
      logo: row.logo_path ?? local.logo,
    };
  }

  const coursesEn = row.course_types_en ?? [];
  const coursesAr = row.course_types_ar ?? [];
  return {
    slug: row.slug,
    name: row.name,
    shortName: row.short_name ?? row.name,
    arabicName: row.arabic_name ?? row.name,
    city: row.city ?? "Kuala Lumpur",
    locations: (row.city ?? "Kuala Lumpur").split("/").map((item: string) => item.trim()),
    typeEn: row.institution_type ?? "English language centre",
    typeAr: "مركز لغة إنجليزية",
    summaryEn: row.overview_en ?? "English-language study options in Malaysia.",
    summaryAr: row.overview_ar ?? "خيارات لدراسة اللغة الإنجليزية في ماليزيا.",
    coursesEn,
    coursesAr,
    focus: ["general"],
    officialUrl: row.official_url ?? "#",
    logo: row.logo_path ?? undefined,
    sourceUrls: row.official_url ? [row.official_url] : [],
    quickFacts: [],
    assessment: [],
    whyChoose: [],
    application: [],
    accommodationEn: "Contact YAZ to verify current accommodation options.",
    accommodationAr: "تواصل مع YAZ للتحقق من خيارات السكن الحالية.",
    supportEn: "Contact YAZ for current enrolment and student-support information.",
    supportAr: "تواصل مع YAZ للحصول على أحدث معلومات التسجيل ودعم الطلاب.",
    faq: [],
  };
}

async function fetchLanguageInstitutes(): Promise<LanguageInstitute[]> {
  const supabase = getSupabasePublic();
  if (!supabase) return LANGUAGE_INSTITUTES;

  const { data, error } = await supabase
    .from("language_institutes")
    .select("slug,name,short_name,arabic_name,city,institution_type,overview_en,overview_ar,course_types_en,course_types_ar,official_url,logo_path,verified,verified_at")
    .eq("verified", true)
    .order("name");

  if (error || !data?.length) {
    if (error) console.error("Supabase language institute read failed; using fallback", error.message);
    return LANGUAGE_INSTITUTES;
  }
  return data.map(genericInstitute);
}

async function fetchLanguageInstituteBySlug(slug: string): Promise<LanguageInstitute | null> {
  const fallback = LANGUAGE_INSTITUTE_BY_SLUG[slug] ?? null;
  const supabase = getSupabasePublic();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("language_institutes")
    .select("slug,name,short_name,arabic_name,city,institution_type,overview_en,overview_ar,course_types_en,course_types_ar,official_url,logo_path,verified,verified_at")
    .eq("slug", slug)
    .eq("verified", true)
    .maybeSingle();

  if (error || !data) return fallback;
  return genericInstitute(data);
}


const getLanguageInstitutesCached = unstable_cache(fetchLanguageInstitutes, ["catalog-language-institutes"], {
  revalidate: 300,
  tags: ["catalog", "language-institutes"],
});

const getLanguageInstituteBySlugCached = unstable_cache(fetchLanguageInstituteBySlug, ["catalog-language-institute-by-slug"], {
  revalidate: 300,
  tags: ["catalog", "language-institutes"],
});

export async function getLanguageInstitutes(): Promise<LanguageInstitute[]> {
  return getLanguageInstitutesCached();
}

export async function getLanguageInstituteBySlug(slug: string): Promise<LanguageInstitute | null> {
  return getLanguageInstituteBySlugCached(slug);
}
