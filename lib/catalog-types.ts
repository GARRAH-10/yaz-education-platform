import type { ProgrammeRecord } from "@/data/programmes";
import type { LanguageInstitute } from "@/data/language-institutes";

export type UniversityCatalogItem = {
  slug: string;
  shortName: string;
  name: string;
  logo: string;
  arabicName: string;
  typeEn: string;
  typeAr: string;
  city: string;
  campusEn: string;
  campusAr: string;
  summaryEn: string;
  summaryAr: string;
  studyAreasEn: readonly string[];
  studyAreasAr: readonly string[];
  officialUrl: string;
  verified: boolean;
  verifiedAt?: string | null;
};

export type ProgrammeCatalogItem = ProgrammeRecord;
export type LanguageInstituteCatalogItem = LanguageInstitute;
