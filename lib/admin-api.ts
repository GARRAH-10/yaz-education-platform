import { hasAdminSession } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const ENTITY_TABLES = {
  universities: "universities",
  programmes: "programmes",
  "language-institutes": "language_institutes",
} as const;

export type AdminEntity = keyof typeof ENTITY_TABLES;

export async function adminContext() {
  const authorized = await hasAdminSession();
  if (!authorized) return { authorized: false as const, supabase: null };
  return { authorized: true as const, supabase: getSupabaseAdmin() };
}

export function cleanText(value: unknown, max = 4000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function cleanArray(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => cleanText(item, 250)).filter(Boolean).slice(0, 50);
  if (typeof value === "string") return value.split("\n").map((item) => item.trim()).filter(Boolean).slice(0, 50);
  return [];
}

export function cleanBoolean(value: unknown) {
  return value === true || value === "true" || value === 1 || value === "1";
}

export function normalizePayload(entity: AdminEntity, body: Record<string, unknown>) {
  if (entity === "universities") {
    return {
      slug: cleanText(body.slug, 120),
      name: cleanText(body.name, 220),
      short_name: cleanText(body.short_name, 120),
      arabic_name: cleanText(body.arabic_name, 220) || null,
      city: cleanText(body.city, 180) || null,
      institution_type: cleanText(body.institution_type, 180) || null,
      campus: cleanText(body.campus, 300) || null,
      overview_en: cleanText(body.overview_en, 3000) || null,
      overview_ar: cleanText(body.overview_ar, 3000) || null,
      study_areas_en: cleanArray(body.study_areas_en),
      study_areas_ar: cleanArray(body.study_areas_ar),
      official_url: cleanText(body.official_url, 500) || null,
      logo_path: cleanText(body.logo_path, 500) || null,
      verified: cleanBoolean(body.verified),
      verified_at: cleanText(body.verified_at, 20) || null,
      updated_at: new Date().toISOString(),
    };
  }

  if (entity === "language-institutes") {
    return {
      slug: cleanText(body.slug, 120),
      name: cleanText(body.name, 220),
      short_name: cleanText(body.short_name, 120),
      arabic_name: cleanText(body.arabic_name, 220) || null,
      city: cleanText(body.city, 180) || null,
      institution_type: cleanText(body.institution_type, 180) || null,
      overview_en: cleanText(body.overview_en, 3000) || null,
      overview_ar: cleanText(body.overview_ar, 3000) || null,
      course_types_en: cleanArray(body.course_types_en),
      course_types_ar: cleanArray(body.course_types_ar),
      official_url: cleanText(body.official_url, 500) || null,
      logo_path: cleanText(body.logo_path, 500) || null,
      verified: cleanBoolean(body.verified),
      verified_at: cleanText(body.verified_at, 20) || null,
      updated_at: new Date().toISOString(),
    };
  }

  const feeAmountRaw = cleanText(body.international_fee_amount, 50);
  const feeAmount = feeAmountRaw ? Number(feeAmountRaw.replace(/,/g, "")) : null;

  return {
    slug: cleanText(body.slug, 180),
    university_id: cleanText(body.university_id, 80),
    name: cleanText(body.name, 300),
    arabic_name: cleanText(body.arabic_name, 300) || null,
    level: cleanText(body.level, 120),
    field: cleanText(body.field, 180) || null,
    duration: cleanText(body.duration, 120) || null,
    campus: cleanText(body.campus, 250) || null,
    study_mode: cleanText(body.study_mode, 120) || null,
    intakes: cleanArray(body.intakes),
    international_fee: cleanText(body.international_fee, 180) || null,
    international_fee_amount: Number.isFinite(feeAmount) ? feeAmount : null,
    fee_currency: cleanText(body.fee_currency, 20) || "MYR",
    fee_period: cleanText(body.fee_period, 80) || null,
    specialisations: cleanArray(body.specialisations),
    academic_requirements_en: cleanText(body.academic_requirements_en, 5000) || null,
    academic_requirements_ar: cleanText(body.academic_requirements_ar, 5000) || null,
    english_requirements_en: cleanText(body.english_requirements_en, 5000) || null,
    english_requirements_ar: cleanText(body.english_requirements_ar, 5000) || null,
    required_documents_en: cleanArray(body.required_documents_en),
    required_documents_ar: cleanArray(body.required_documents_ar),
    accreditation: cleanText(body.accreditation, 1000) || null,
    scholarship_info_en: cleanText(body.scholarship_info_en, 4000) || null,
    scholarship_info_ar: cleanText(body.scholarship_info_ar, 4000) || null,
    application_notes_en: cleanText(body.application_notes_en, 4000) || null,
    application_notes_ar: cleanText(body.application_notes_ar, 4000) || null,
    source_url: cleanText(body.source_url, 500) || null,
    verified_at: cleanText(body.verified_at, 20) || null,
    updated_at: new Date().toISOString(),
  };
}
