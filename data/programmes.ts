import { VERIFIED_AT, VERIFIED_UNIVERSITIES } from "@/data/verified-universities";
import { UNIVERSITY_ORDER, UNIVERSITY_UI } from "@/data/university-ui";

export type ProgrammeRecord = {
  slug: string;
  name: string;
  universityName: string;
  universityShortName: string;
  universitySlug: string;
  universityLogo: string;
  city: string;
  level: string;
  field: string;
  arabicName?: string;
  duration?: string;
  intakes?: string[];
  internationalFee?: string;
  internationalFeeAmount?: number;
  feeCurrency?: string;
  feePeriod?: string;
  campus?: string;
  studyMode?: string;
  specialisations?: string[];
  academicRequirementsEn?: string;
  academicRequirementsAr?: string;
  englishRequirementsEn?: string;
  englishRequirementsAr?: string;
  requiredDocumentsEn?: string[];
  requiredDocumentsAr?: string[];
  accreditation?: string;
  scholarshipInfoEn?: string;
  scholarshipInfoAr?: string;
  applicationNotesEn?: string;
  applicationNotesAr?: string;
  sourceUrl: string;
  verifiedAt: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\(honours\)|\(hons\)|honours|with honours/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

function findUniversitySlug(shortName: string, fullName: string) {
  const entries = Object.entries(UNIVERSITY_UI);
  const match = entries.find(([, value]) => value.shortName === shortName || value.name === fullName);
  return match?.[0] ?? slugify(shortName);
}

function inferField(name: string) {
  const text = name.toLowerCase();
  if (text.includes("artificial intelligence")) return "Artificial Intelligence";
  if (text.includes("cyber")) return "Cybersecurity";
  if (text.includes("data science")) return "Data Science";
  if (text.includes("software engineering")) return "Software Engineering";
  if (text.includes("computer engineering")) return "Engineering";
  if (text.includes("information technology")) return "Information Technology";
  if (text.includes("business administration")) return "Business";
  if (text.includes("computer science")) return "Computer Science";
  return "Other";
}

export const PROGRAMMES: ProgrammeRecord[] = VERIFIED_UNIVERSITIES.flatMap((university) => {
  const universitySlug = findUniversitySlug(university.shortName, university.name);
  const ui = (UNIVERSITY_UI as Record<string, any>)[universitySlug];

  return university.programmes.map((programme, index) => ({
    slug: `${universitySlug}-${slugify(programme.name)}-${index + 1}`,
    name: programme.name,
    universityName: university.name,
    universityShortName: university.shortName,
    universitySlug,
    universityLogo: ui?.logo ?? "/yaz-logo.png",
    city: university.city,
    level: programme.level,
    field: inferField(programme.name),
    duration: programme.duration,
    intakes: programme.intakes,
    internationalFee: programme.internationalFee,
    campus: programme.campus,
    specialisations: programme.specialisations,
    sourceUrl: programme.sourceUrl,
    verifiedAt: VERIFIED_AT,
  }));
});

export const PROGRAMME_BY_SLUG = Object.fromEntries(PROGRAMMES.map((programme) => [programme.slug, programme]));

const ALL_INSTITUTIONS = UNIVERSITY_ORDER
  .filter((slug) => slug !== "bright")
  .map((slug) => UNIVERSITY_UI[slug]);

const STANDARD_LEVELS = [
  "Foundation",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Professional / Pre-University",
];

export const PROGRAMME_LEVELS = [
  ...STANDARD_LEVELS,
  ...[...new Set(PROGRAMMES.map((programme) => programme.level))].filter((level) => !STANDARD_LEVELS.includes(level)),
];

export const PROGRAMME_FIELDS = [...new Set([
  ...PROGRAMMES.map((programme) => programme.field),
  ...ALL_INSTITUTIONS.flatMap((institution) => institution.studyAreasEn ?? []),
])].sort();

export const PROGRAMME_UNIVERSITIES = ALL_INSTITUTIONS
  .map((institution) => institution.shortName)
  .sort();

export const PROGRAMME_CITIES = [...new Set(ALL_INSTITUTIONS.flatMap((institution) =>
  institution.city.split("/").map((city) => city.trim())
))].sort();
