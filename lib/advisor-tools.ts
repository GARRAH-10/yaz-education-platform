import type { ProgrammeRecord } from "@/data/programmes";
import type { UniversityCatalogItem } from "@/lib/catalog-types";
import {
  canonicalField,
  fieldMatches,
  programmeFieldMatches,
} from "@/data/study-fields";

export type AdvisorToolMatchType = "exact" | "specialisation" | "related";

export type AdvisorToolProgramme = {
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
  matchType: AdvisorToolMatchType;
};

export type ProgrammeSearchArgs = {
  field?: string | null;
  level?: string | null;
  university?: string | null;
  location?: string | null;
  query?: string | null;
  limit?: number | null;
};

export type UniversitySearchArgs = {
  query?: string | null;
  studyArea?: string | null;
  city?: string | null;
  limit?: number | null;
};

const normalize = (value: string | null | undefined) =>
  (value ?? "")
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u0600-\u06ff&+\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const words = (value: string | null | undefined) =>
  normalize(value)
    .split(" ")
    .filter((token) => token.length >= 3 && ![
      "the", "and", "for", "with", "programme", "program", "university", "study", "want", "about", "what", "which", "malaysia",
    ].includes(token));

function universityMatches(programme: ProgrammeRecord, requested: string) {
  const needle = normalize(requested);
  if (!needle) return true;
  const candidates = [
    programme.universityShortName,
    programme.universityName,
    programme.universitySlug,
  ].map(normalize);
  return candidates.some((candidate) => candidate === needle || candidate.includes(needle) || needle.includes(candidate));
}

function locationMatches(programme: ProgrammeRecord, requested: string) {
  const needle = normalize(requested);
  if (!needle) return true;
  return normalize([programme.city, programme.campus ?? ""].join(" ")).includes(needle);
}

function levelMatches(programme: ProgrammeRecord, requested: string) {
  const needle = normalize(requested);
  if (!needle) return true;
  const level = normalize(programme.level);
  const aliases: Record<string, string[]> = {
    bachelor: ["bachelor", "bachelor's", "undergraduate", "degree", "بكالوريوس"],
    master: ["master", "master's", "masters", "postgraduate", "ماجستير"],
    phd: ["phd", "doctorate", "doctoral", "دكتوراه"],
    diploma: ["diploma", "دبلوم"],
    foundation: ["foundation", "pre university", "pre-university", "تأسيسي"],
  };
  if (level.includes(needle) || needle.includes(level)) return true;
  return Object.values(aliases).some((group) =>
    group.some((term) => needle.includes(normalize(term))) && group.some((term) => level.includes(normalize(term))),
  );
}

function matchTypeForField(programme: ProgrammeRecord, requestedField: string): AdvisorToolMatchType | null {
  if (!requestedField) return "exact";
  const canonical = canonicalField(requestedField);
  const programmeCore = [programme.name, programme.field].join(" ");
  if (canonicalField(programme.field) === canonical || programmeFieldMatches(programmeCore, canonical)) return "exact";

  const specialisationBlob = (programme.specialisations ?? []).join(" ");
  if (specialisationBlob && programmeFieldMatches(specialisationBlob, canonical)) return "specialisation";

  const broaderBlob = [programme.name, programme.field, ...(programme.specialisations ?? [])].join(" ");
  if (fieldMatches(broaderBlob, canonical)) return "related";
  return null;
}

function compactProgramme(
  programme: ProgrammeRecord,
  locale: "en" | "ar",
  matchType: AdvisorToolMatchType,
): AdvisorToolProgramme {
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
    matchType,
  };
}

export function searchAdvisorProgrammes(
  programmes: ProgrammeRecord[],
  args: ProgrammeSearchArgs,
  locale: "en" | "ar",
) {
  const field = args.field?.trim() ?? "";
  const level = args.level?.trim() ?? "";
  const university = args.university?.trim() ?? "";
  const location = args.location?.trim() ?? "";
  const query = args.query?.trim() ?? "";
  const limit = Math.max(1, Math.min(Number(args.limit) || 6, 8));
  const queryTokens = words(query);

  const candidates = programmes
    .map((programme) => {
      if (level && !levelMatches(programme, level)) return null;
      if (university && !universityMatches(programme, university)) return null;
      if (location && !locationMatches(programme, location)) return null;

      const matchType = field ? matchTypeForField(programme, field) : "exact";
      if (!matchType) return null;

      const blob = normalize([
        programme.name,
        programme.field,
        programme.universityName,
        programme.universityShortName,
        programme.city,
        programme.campus ?? "",
        programme.level,
        ...(programme.specialisations ?? []),
      ].join(" "));

      const queryHits = queryTokens.filter((token) => blob.includes(token)).length;
      if (queryTokens.length && queryHits === 0 && !field && !university && !location && !level) return null;

      const matchRank = matchType === "exact" ? 30 : matchType === "specialisation" ? 20 : 5;
      const score = matchRank + queryHits * 2 + (programme.verifiedAt ? 1 : 0);
      return { programme, matchType, score };
    })
    .filter((item): item is { programme: ProgrammeRecord; matchType: AdvisorToolMatchType; score: number } => Boolean(item));

  // Prefer exact programmes and pathways. Only surface broad related options when
  // the requested filters have no exact/pathway record in the current catalogue.
  const hasStrongMatch = candidates.some((item) => item.matchType !== "related");
  const filtered = hasStrongMatch ? candidates.filter((item) => item.matchType !== "related") : candidates;

  const matches = filtered
    .sort((a, b) => b.score - a.score || a.programme.universityShortName.localeCompare(b.programme.universityShortName))
    .slice(0, limit)
    .map((item) => compactProgramme(item.programme, locale, item.matchType));

  return {
    count: matches.length,
    requested: {
      field: field || null,
      level: level || null,
      university: university || null,
      location: location || null,
      query: query || null,
    },
    matches,
    note: matches.length
      ? "These are verified YAZ catalogue records. matchType=related means the programme is only broadly related; do not present it as an exact requested programme."
      : "No verified YAZ catalogue programme matched these filters. This does not prove that the university does not offer it; say only that it is not currently verified in the YAZ database.",
  };
}

export function searchAdvisorUniversities(
  universities: UniversityCatalogItem[],
  args: UniversitySearchArgs,
  locale: "en" | "ar",
) {
  const query = normalize(args.query);
  const city = normalize(args.city);
  const studyArea = args.studyArea?.trim() ?? "";
  const limit = Math.max(1, Math.min(Number(args.limit) || 6, 8));
  const queryTokens = words(args.query);

  const items = universities
    .map((university) => {
      if (city && !normalize([university.city, university.campusEn].join(" ")).includes(city)) return null;
      if (studyArea) {
        const studyBlob = university.studyAreasEn.join(" ");
        if (!fieldMatches(studyBlob, studyArea)) return null;
      }

      const blob = normalize([
        university.name,
        university.shortName,
        university.arabicName,
        university.city,
        university.campusEn,
        university.summaryEn,
        ...university.studyAreasEn,
      ].join(" "));
      const queryHits = queryTokens.filter((token) => blob.includes(token)).length;
      if (query && queryTokens.length && queryHits === 0 && !normalize(university.name).includes(query) && !normalize(university.shortName).includes(query)) return null;
      return { university, score: queryHits + (university.verified ? 2 : 0) };
    })
    .filter((item): item is { university: UniversityCatalogItem; score: number } => Boolean(item))
    .sort((a, b) => b.score - a.score || a.university.name.localeCompare(b.university.name))
    .slice(0, limit)
    .map(({ university }) => ({
      slug: university.slug,
      shortName: university.shortName,
      name: university.name,
      arabicName: university.arabicName,
      type: locale === "ar" ? university.typeAr : university.typeEn,
      city: university.city,
      campus: locale === "ar" ? university.campusAr : university.campusEn,
      summary: locale === "ar" ? university.summaryAr : university.summaryEn,
      studyAreas: locale === "ar" ? university.studyAreasAr : university.studyAreasEn,
      officialUrl: university.officialUrl,
      verifiedAt: university.verifiedAt ?? null,
    }));

  return {
    count: items.length,
    universities: items,
    note: items.length
      ? "These are verified YAZ university records."
      : "No verified YAZ university record matched these filters.",
  };
}
