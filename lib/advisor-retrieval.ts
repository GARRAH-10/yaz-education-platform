import type { ProgrammeRecord } from "@/data/programmes";
import type { UniversityCatalogItem } from "@/lib/catalog-types";
import {
  STUDY_FIELD_GROUPS,
  canonicalField,
  programmeFieldMatches,
} from "@/data/study-fields";

export type AdvisorIntent = {
  field?: string;
  level?: string;
  university?: string;
  city?: string;
  mentionsBudget: boolean;
};

export type AdvisorMatch = {
  slug: string;
  name: string;
  universityName: string;
  universityShortName: string;
  universitySlug: string;
  universityLogo: string;
  field: string;
  level: string;
  city: string;
  campus?: string;
  duration?: string;
  studyMode?: string;
  intakes?: string[];
  englishRequirements?: string;
  academicRequirements?: string;
  accreditation?: string;
  sourceUrl: string;
  verifiedAt: string;
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u0600-\u06ff&+\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const FIELD_ENTRIES = STUDY_FIELD_GROUPS.flatMap((group) =>
  group.fields.map((field) => ({
    value: field.value,
    terms: [field.value, field.labelAr, ...(field.aliases ?? [])]
      .map(normalize)
      .filter(Boolean),
  })),
);

const LEVEL_TERMS: Array<{ level: string; terms: string[] }> = [
  { level: "Foundation", terms: ["foundation", "pre university", "pre-university", "تأسيسي", "سنة تأسيسية"] },
  { level: "Diploma", terms: ["diploma", "دبلوم"] },
  { level: "Bachelor's", terms: ["bachelor", "bachelor's", "undergraduate", "degree", "بكالوريوس", "ثانوية", "high school", "secondary school"] },
  { level: "Master's", terms: ["master", "master's", "masters", "postgraduate", "ماجستير"] },
  { level: "PhD", terms: ["phd", "doctorate", "doctoral", "دكتوراه"] },
];

function findField(text: string) {
  const normalized = normalize(text);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  const ranked = FIELD_ENTRIES
    .flatMap((entry) => entry.terms.map((term) => ({ value: entry.value, term })))
    .filter((entry) => {
      if (entry.term.length < 2) return false;
      // Short aliases such as SE, CS, IT and AI must match a complete token.
      // Using substring matching here would make "se" match words such as "please".
      if (!entry.term.includes(" ") && entry.term.length <= 3) return tokens.has(entry.term);
      return normalized.includes(entry.term);
    })
    .sort((a, b) => b.term.length - a.term.length);

  return ranked[0]?.value;
}

function findLevel(text: string) {
  const normalized = normalize(text);
  for (const entry of LEVEL_TERMS) {
    if (entry.terms.some((term) => normalized.includes(normalize(term)))) return entry.level;
  }
  return undefined;
}

function findUniversity(text: string, universities: UniversityCatalogItem[]) {
  const normalized = normalize(text);
  const matches = universities
    .flatMap((university) => [
      { value: university.shortName, term: normalize(university.shortName) },
      { value: university.shortName, term: normalize(university.name) },
      { value: university.shortName, term: normalize(university.arabicName) },
    ])
    .filter((entry) => entry.term.length >= 2 && normalized.includes(entry.term))
    .sort((a, b) => b.term.length - a.term.length);
  return matches[0]?.value;
}

function findCity(text: string, programmes: ProgrammeRecord[], universities: UniversityCatalogItem[]) {
  const normalized = normalize(text);
  const cities = [...new Set([
    ...programmes.flatMap((item) => [item.city, item.campus ?? ""]),
    ...universities.flatMap((item) => item.city.split("/").map((city) => city.trim())),
  ])]
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  return cities.find((city) => normalized.includes(normalize(city)));
}

export function parseAdvisorIntent(
  text: string,
  programmes: ProgrammeRecord[],
  universities: UniversityCatalogItem[],
): AdvisorIntent {
  const normalized = normalize(text);
  return {
    field: findField(text),
    level: findLevel(text),
    university: findUniversity(text, universities),
    city: findCity(text, programmes, universities),
    mentionsBudget: ["budget", "fee", "fees", "tuition", "cost", "price", "ميزانية", "رسوم", "تكلفة"].some((term) => normalized.includes(term)),
  };
}

function tokenise(text: string) {
  return normalize(text)
    .split(" ")
    .filter((token) => token.length >= 3 && !["want", "study", "find", "programme", "program", "university", "malaysia", "please", "about", "with", "that", "this"].includes(token));
}

function toMatch(programme: ProgrammeRecord, locale: "en" | "ar"): AdvisorMatch {
  return {
    slug: programme.slug,
    name: programme.name,
    universityName: programme.universityName,
    universityShortName: programme.universityShortName,
    universitySlug: programme.universitySlug,
    universityLogo: programme.universityLogo,
    field: programme.field,
    level: programme.level,
    city: programme.city,
    campus: programme.campus,
    duration: programme.duration,
    studyMode: programme.studyMode,
    intakes: programme.intakes,
    englishRequirements: locale === "ar" ? programme.englishRequirementsAr : programme.englishRequirementsEn,
    academicRequirements: locale === "ar" ? programme.academicRequirementsAr : programme.academicRequirementsEn,
    accreditation: programme.accreditation,
    sourceUrl: programme.sourceUrl,
    verifiedAt: programme.verifiedAt,
  };
}

export function findAdvisorMatches(
  message: string,
  intent: AdvisorIntent,
  programmes: ProgrammeRecord[],
  locale: "en" | "ar",
  limit = 5,
): AdvisorMatch[] {
  const tokens = tokenise(message);
  const scored = programmes
    .map((programme) => {
      const fieldBlob = [programme.name, programme.field, ...(programme.specialisations ?? [])].join(" ");
      if (intent.field && !programmeFieldMatches(fieldBlob, canonicalField(intent.field))) return null;
      if (intent.level && programme.level !== intent.level) return null;
      if (intent.university && programme.universityShortName !== intent.university) return null;
      if (intent.city) {
        const place = normalize([programme.city, programme.campus ?? ""].join(" "));
        if (!place.includes(normalize(intent.city))) return null;
      }

      const blob = normalize([
        programme.name,
        programme.universityName,
        programme.universityShortName,
        programme.field,
        programme.city,
        programme.campus ?? "",
        programme.level,
        ...(programme.specialisations ?? []),
      ].join(" "));

      let score = 0;
      let queryHits = 0;
      if (intent.field) score += 12;
      if (intent.level) score += 6;
      if (intent.university) score += 7;
      if (intent.city) score += 4;
      for (const token of tokens) {
        if (blob.includes(token)) {
          score += 1;
          queryHits += 1;
        }
      }
      if (!intent.field && !intent.level && !intent.university && !intent.city && queryHits === 0) return null;
      if (programme.verifiedAt) score += 1;

      return { programme, score };
    })
    .filter((item): item is { programme: ProgrammeRecord; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score || a.programme.universityShortName.localeCompare(b.programme.universityShortName));

  // If the user has not supplied any structured preference, avoid pretending that
  // the first records in the database are personal recommendations.
  if (!intent.field && !intent.level && !intent.university && !intent.city && tokens.length === 0) return [];

  return scored.slice(0, limit).map(({ programme }) => toMatch(programme, locale));
}

export function deterministicAdvisorAnswer(
  locale: "en" | "ar",
  intent: AdvisorIntent,
  matches: AdvisorMatch[],
) {
  const isAr = locale === "ar";

  if (matches.length) {
    const field = intent.field ? ` ${intent.field}` : "";
    if (isAr) {
      return `وجدت ${matches.length} خيارات موثقة${field ? ` مرتبطة بـ${field}` : ""} في قاعدة بيانات YAZ. راجع البطاقات أدناه للمقارنة بين الجامعة والموقع والمدة ومواعيد القبول المتاحة. الرسوم لا تُعرض كأرقام ثابتة لأنها قد تتغير حسب الدفعة؛ يمكن لمستشار YAZ تأكيد أحدث رسوم رسمية.`;
    }
    return `I found ${matches.length} verified${field} option${matches.length === 1 ? "" : "s"} in the YAZ database. Review the cards below to compare university, location, duration and available intake information. Exact tuition is not shown because it can change by intake; a YAZ advisor can confirm the latest official fee.`;
  }

  if (intent.field || intent.level || intent.university || intent.city) {
    return isAr
      ? "لم أجد برنامجاً موثقاً يطابق جميع هذه الشروط حالياً. جرّب توسيع الموقع أو المرحلة، أو تحدث مع مستشار YAZ للتحقق من الخيارات التي لم تُضاف بعد إلى قاعدة البيانات."
      : "I couldn't find a verified programme matching all of those conditions yet. Try broadening the location or study level, or speak with a YAZ advisor to check options that have not yet been added to the database.";
  }

  return isAr
    ? "الذكاء الاصطناعي العام غير متاح مؤقتاً. لا يزال بإمكاني البحث في بيانات YAZ الموثقة عن الجامعات والبرامج، أو يمكنك إعادة المحاولة بعد قليل لسؤال عام."
    : "General AI is temporarily unavailable. I can still search the verified YAZ database for universities and programmes, or you can try the general question again shortly.";
}
