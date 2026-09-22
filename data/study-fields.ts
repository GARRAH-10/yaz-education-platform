export type StudyFieldGroup = {
  group: string;
  groupAr: string;
  fields: { value: string; labelAr: string; aliases?: string[] }[];
};

export const STUDY_FIELD_GROUPS: StudyFieldGroup[] = [
  {
    group: "Engineering",
    groupAr: "الهندسة",
    fields: [
      { value: "Civil Engineering", labelAr: "الهندسة المدنية", aliases: ["civil"] },
      { value: "Mechanical Engineering", labelAr: "الهندسة الميكانيكية", aliases: ["mechanical", "mechanic", "mechanick"] },
      { value: "Electrical & Electronic Engineering", labelAr: "الهندسة الكهربائية والإلكترونية", aliases: ["electrical", "electronic", "electronics", "eee"] },
      { value: "Mechatronics Engineering", labelAr: "هندسة الميكاترونكس", aliases: ["mechatronics", "mechatronic", "mecatronics"] },
      { value: "Chemical Engineering", labelAr: "الهندسة الكيميائية", aliases: ["chemical"] },
      { value: "Petroleum Engineering", labelAr: "هندسة البترول", aliases: ["petroleum", "oil and gas"] },
      { value: "Aerospace Engineering", labelAr: "هندسة الطيران والفضاء", aliases: ["aerospace", "aeronautical"] },
      { value: "Biomedical Engineering", labelAr: "الهندسة الطبية الحيوية", aliases: ["biomedical"] },
      { value: "Industrial & Manufacturing Engineering", labelAr: "الهندسة الصناعية والتصنيع", aliases: ["industrial", "manufacturing"] },
      { value: "Environmental Engineering", labelAr: "الهندسة البيئية", aliases: ["environmental"] },
      { value: "Engineering", labelAr: "الهندسة - عام", aliases: ["engineering"] },
    ],
  },
  {
    group: "Computing & Digital Technology",
    groupAr: "الحوسبة والتقنية الرقمية",
    fields: [
      { value: "Computer Science", labelAr: "علوم الحاسب", aliases: ["computer", "computing", "cs", "comp sci"] },
      { value: "Software Engineering", labelAr: "هندسة البرمجيات", aliases: ["software", "se", "swe", "software eng"] },
      { value: "Artificial Intelligence", labelAr: "الذكاء الاصطناعي", aliases: ["ai", "machine learning"] },
      { value: "Cybersecurity", labelAr: "الأمن السيبراني", aliases: ["cyber", "cyber security", "cybersec"] },
      { value: "Data Science", labelAr: "علم البيانات", aliases: ["data analytics", "analytics"] },
      { value: "Information Technology", labelAr: "تقنية المعلومات", aliases: ["it"] },
      { value: "Information Systems", labelAr: "نظم المعلومات", aliases: ["information system"] },
      { value: "Game Development", labelAr: "تطوير الألعاب", aliases: ["game"] },
    ],
  },
  {
    group: "Business & Management",
    groupAr: "الأعمال والإدارة",
    fields: [
      { value: "Business Administration", labelAr: "إدارة الأعمال", aliases: ["business", "management", "business management"] },
      { value: "Business Analytics", labelAr: "تحليلات الأعمال", aliases: ["business analytics", "business intelligence"] },
      { value: "Digital Business", labelAr: "الأعمال الرقمية", aliases: ["digital business", "e-business", "digital enterprise"] },
      { value: "Accounting", labelAr: "المحاسبة", aliases: ["accountancy"] },
      { value: "Accounting & Finance", labelAr: "المحاسبة والمالية", aliases: ["accounting and finance", "accounting finance"] },
      { value: "Finance", labelAr: "المالية", aliases: ["finance", "investment"] },
      { value: "Banking & Finance", labelAr: "المصارف والمالية", aliases: ["banking", "banking and finance"] },
      { value: "Financial Economics", labelAr: "الاقتصاد المالي", aliases: ["finance and economics", "financial economics"] },
      { value: "Economics", labelAr: "الاقتصاد" },
      { value: "Marketing", labelAr: "التسويق" },
      { value: "Digital Marketing", labelAr: "التسويق الرقمي", aliases: ["digital marketing"] },
      { value: "Human Resource Management", labelAr: "إدارة الموارد البشرية", aliases: ["hr", "human resources", "human capital"] },
      { value: "Supply Chain & Logistics", labelAr: "سلاسل الإمداد والخدمات اللوجستية", aliases: ["supply chain", "logistics", "logistic management"] },
      { value: "Entrepreneurship", labelAr: "ريادة الأعمال" },
      { value: "International Business", labelAr: "الأعمال الدولية" },
      { value: "FinTech", labelAr: "التقنية المالية", aliases: ["financial technology", "fintech"] },
      { value: "Actuarial Studies", labelAr: "الدراسات الاكتوارية", aliases: ["actuarial", "actuarial science"] },
    ],
  },
  {
    group: "Medicine & Health Sciences",
    groupAr: "الطب والعلوم الصحية",
    fields: [
      { value: "Medicine", labelAr: "الطب" },
      { value: "Dentistry", labelAr: "طب الأسنان" },
      { value: "Pharmacy", labelAr: "الصيدلة" },
      { value: "Pharmaceutical Science", labelAr: "العلوم الصيدلانية", aliases: ["pharmaceutical sciences"] },
      { value: "Nursing", labelAr: "التمريض" },
      { value: "Optometry", labelAr: "البصريات", aliases: ["optometry"] },
      { value: "Biomedical Science", labelAr: "العلوم الطبية الحيوية" },
      { value: "Biomedicine", labelAr: "الطب الحيوي", aliases: ["biomedicine"] },
      { value: "Medical Biotechnology", labelAr: "التقنية الحيوية الطبية", aliases: ["medical biotechnology"] },
      { value: "Physiotherapy", labelAr: "العلاج الطبيعي" },
      { value: "Public Health", labelAr: "الصحة العامة" },
      { value: "Health Sciences", labelAr: "العلوم الصحية" },
    ],
  },
  {
    group: "Architecture & Built Environment",
    groupAr: "العمارة والبيئة المبنية",
    fields: [
      { value: "Architecture", labelAr: "العمارة" },
      { value: "Quantity Surveying", labelAr: "حصر الكميات" },
      { value: "Construction Management", labelAr: "إدارة التشييد" },
      { value: "Urban Planning", labelAr: "التخطيط الحضري" },
      { value: "Landscape Architecture", labelAr: "عمارة المناظر الطبيعية", aliases: ["landscape architecture"] },
      { value: "Interior Architecture", labelAr: "العمارة الداخلية" },
      { value: "Geomatics & Geoinformatics", labelAr: "الجيوماتكس والمعلومات الجغرافية", aliases: ["geomatics", "geoinformatics"] },
      { value: "Real Estate", labelAr: "العقارات", aliases: ["real estate"] },
      { value: "Land Administration & Development", labelAr: "إدارة وتطوير الأراضي", aliases: ["land administration", "land development"] },
      { value: "Sustainable Digital Construction", labelAr: "إدارة التشييد الرقمي المستدام", aliases: ["digital construction", "sustainable construction"] },
      { value: "Built Environment", labelAr: "البيئة المبنية" },
    ],
  },
  {
    group: "Science",
    groupAr: "العلوم",
    fields: [
      { value: "Biotechnology", labelAr: "التقنية الحيوية" },
      { value: "Biology", labelAr: "الأحياء" },
      { value: "Chemistry", labelAr: "الكيمياء" },
      { value: "Physics", labelAr: "الفيزياء" },
      { value: "Mathematics", labelAr: "الرياضيات" },
      { value: "Environmental Science", labelAr: "العلوم البيئية" },
      { value: "Food Science", labelAr: "علوم الأغذية" },
      { value: "Science", labelAr: "العلوم - عام" },
    ],
  },
  {
    group: "Law, Social Sciences & Education",
    groupAr: "القانون والعلوم الاجتماعية والتربية",
    fields: [
      { value: "Law", labelAr: "القانون" },
      { value: "Psychology", labelAr: "علم النفس" },
      { value: "Education", labelAr: "التربية والتعليم" },
      { value: "Communication & Media", labelAr: "الإعلام والاتصال", aliases: ["communication", "media"] },
      { value: "Strategic Communication", labelAr: "الاتصال الاستراتيجي", aliases: ["strategic communication"] },
      { value: "International Relations", labelAr: "العلاقات الدولية" },
      { value: "Sociology", labelAr: "علم الاجتماع" },
      { value: "Social Sciences", labelAr: "العلوم الاجتماعية" },
      { value: "Islamic Studies", labelAr: "الدراسات الإسلامية" },
    ],
  },
  {
    group: "Design, Creative Arts & Hospitality",
    groupAr: "التصميم والفنون والضيافة",
    fields: [
      { value: "Graphic Design", labelAr: "التصميم الجرافيكي" },
      { value: "Advertising & Branding", labelAr: "الإعلان والعلامات التجارية", aliases: ["advertising", "branding"] },
      { value: "Design Communication", labelAr: "اتصال التصميم", aliases: ["design communication"] },
      { value: "Multimedia & Animation", labelAr: "الوسائط المتعددة والرسوم المتحركة", aliases: ["multimedia", "animation"] },
      { value: "Animation", labelAr: "الرسوم المتحركة", aliases: ["animation"] },
      { value: "Immersive Media Design", labelAr: "تصميم الوسائط الغامرة", aliases: ["immersive media", "vr", "ar"] },
      { value: "Visual Effects", labelAr: "المؤثرات البصرية", aliases: ["vfx", "visual effects"] },
      { value: "Digital Film Production", labelAr: "إنتاج الأفلام الرقمية", aliases: ["film", "digital film", "cinematic arts"] },
      { value: "Fashion Design", labelAr: "تصميم الأزياء" },
      { value: "Music", labelAr: "الموسيقى" },
      { value: "Hospitality Management", labelAr: "إدارة الضيافة", aliases: ["hospitality"] },
      { value: "Tourism Management", labelAr: "إدارة السياحة", aliases: ["tourism"] },
      { value: "Culinary Arts", labelAr: "فنون الطهي", aliases: ["culinary"] },
      { value: "Design & Creative Arts", labelAr: "التصميم والفنون الإبداعية", aliases: ["design", "creative arts"] },
    ],
  },
  {
    group: "Pre-University & Professional",
    groupAr: "ما قبل الجامعة والمسارات المهنية",
    fields: [
      { value: "Foundation", labelAr: "التأسيسي" },
      { value: "Diploma", labelAr: "الدبلوم" },
      { value: "A Level", labelAr: "A Level" },
      { value: "SACE", labelAr: "SACE" },
      { value: "Professional Accounting", labelAr: "المحاسبة المهنية" },
    ],
  },
];

export const STUDY_FIELDS = STUDY_FIELD_GROUPS.flatMap((group) => group.fields.map((field) => field.value));

export const STUDY_LEVELS = [
  "Foundation",
  "Diploma",
  "Bachelor's",
  "Master's",
  "PhD",
  "Professional / Pre-University",
];

const FIELD_PARENT: Record<string, string[]> = {
  "Civil Engineering": ["Engineering", "Engineering & Technology"],
  "Mechanical Engineering": ["Engineering", "Engineering & Technology"],
  "Electrical & Electronic Engineering": ["Engineering", "Engineering & Technology"],
  "Mechatronics Engineering": ["Engineering", "Engineering & Technology"],
  "Chemical Engineering": ["Engineering", "Engineering & Technology"],
  "Petroleum Engineering": ["Engineering", "Engineering & Technology"],
  "Aerospace Engineering": ["Engineering", "Engineering & Technology"],
  "Biomedical Engineering": ["Engineering", "Engineering & Technology", "Health Sciences"],
  "Industrial & Manufacturing Engineering": ["Engineering", "Engineering & Technology"],
  "Environmental Engineering": ["Engineering", "Engineering & Technology"],
  "Software Engineering": ["Computing", "Computing & IT", "Information Technology", "Computer Science"],
  "Artificial Intelligence": ["Computing", "Computing & IT", "Computer Science", "Artificial Intelligence & Data"],
  Cybersecurity: ["Computing", "Computing & IT", "Computer Science", "Cybersecurity"],
  "Data Science": ["Computing", "Computing & IT", "Computer Science", "Artificial Intelligence & Data"],
  "Information Technology": ["Computing", "Computing & IT", "Information Technology"],
  "Information Systems": ["Computing", "Computing & IT", "Information Technology"],
  "Game Development": ["Computing", "Computing & IT", "Creative Multimedia"],
  "Business Administration": ["Business", "Economics & Management", "Management"],
  "Business Analytics": ["Business", "Management", "Business Analytics", "Computing & IT"],
  "Digital Business": ["Business", "Management", "Business & FinTech", "Digital Business"],
  Accounting: ["Business", "Economics & Management", "Professional Accounting"],
  "Accounting & Finance": ["Business", "Economics & Management", "Professional Accounting", "Finance"],
  Finance: ["Business", "Economics & Management", "Business & FinTech"],
  "Banking & Finance": ["Business", "Economics & Management", "Business & FinTech", "Finance"],
  "Financial Economics": ["Business", "Economics & Management", "Economics", "Finance"],
  Economics: ["Business", "Economics & Management"],
  Marketing: ["Business", "Management"],
  "Digital Marketing": ["Business", "Management", "Marketing", "Digital Marketing & Media"],
  "Human Resource Management": ["Business", "Management"],
  "Supply Chain & Logistics": ["Business", "Management", "Supply Chain", "Logistics"],
  Entrepreneurship: ["Business", "Management"],
  "International Business": ["Business", "Management"],
  FinTech: ["Business", "Business & FinTech", "Computing & IT"],
  "Actuarial Studies": ["Business", "Finance", "Mathematics", "Science"],
  Medicine: ["Health Sciences", "Medicine & Health Sciences"],
  Dentistry: ["Health Sciences", "Medicine & Health Sciences"],
  Pharmacy: ["Health Sciences", "Medicine & Health Sciences"],
  "Pharmaceutical Science": ["Health Sciences", "Medicine & Health Sciences", "Science"],
  Nursing: ["Health Sciences", "Medicine & Health Sciences"],
  Optometry: ["Health Sciences", "Medicine & Health Sciences"],
  "Biomedical Science": ["Health Sciences", "Medicine & Health Sciences", "Science"],
  Biomedicine: ["Health Sciences", "Medicine & Health Sciences", "Science"],
  "Medical Biotechnology": ["Health Sciences", "Medicine & Health Sciences", "Science", "Biotechnology"],
  Physiotherapy: ["Health Sciences", "Medicine & Health Sciences"],
  "Public Health": ["Health Sciences", "Medicine & Health Sciences"],
  "Health Sciences": ["Medicine & Health Sciences"],
  Architecture: ["Architecture & Design", "Built Environment", "Design"],
  "Quantity Surveying": ["Built Environment"],
  "Construction Management": ["Built Environment", "Management"],
  "Urban Planning": ["Built Environment"],
  "Landscape Architecture": ["Architecture & Design", "Built Environment", "Design"],
  "Interior Architecture": ["Architecture & Design", "Built Environment", "Design"],
  "Geomatics & Geoinformatics": ["Built Environment", "Engineering", "Science"],
  "Real Estate": ["Built Environment", "Business"],
  "Land Administration & Development": ["Built Environment"],
  "Sustainable Digital Construction": ["Built Environment", "Construction Management", "Architecture & Design"],
  Biotechnology: ["Science", "Health Sciences"],
  Biology: ["Science"],
  Chemistry: ["Science"],
  Physics: ["Science"],
  Mathematics: ["Science"],
  "Environmental Science": ["Science"],
  "Food Science": ["Science"],
  "Communication & Media": ["Communication", "Creative Multimedia", "Design & Media"],
  "Strategic Communication": ["Communication", "Communication & Media", "Design & Media"],
  Psychology: ["Social Sciences", "Health Sciences"],
  "International Relations": ["Social Sciences", "Islamic Studies & Human Sciences"],
  Sociology: ["Social Sciences", "Islamic Studies & Human Sciences"],
  "Islamic Studies": ["Islamic Studies & Human Sciences"],
  "Graphic Design": ["Design", "Architecture & Design", "Design & Media"],
  "Advertising & Branding": ["Design", "Design & Media", "Communication", "Creative Multimedia"],
  "Design Communication": ["Design", "Design & Media", "Communication"],
  "Multimedia & Animation": ["Creative Multimedia", "Design & Media"],
  Animation: ["Creative Multimedia", "Design & Media"],
  "Immersive Media Design": ["Creative Multimedia", "Design & Media"],
  "Visual Effects": ["Creative Multimedia", "Design & Media"],
  "Digital Film Production": ["Creative Multimedia", "Design & Media", "Communication"],
  "Fashion Design": ["Design", "Design & Media"],
  Music: ["Music & Arts", "Arts"],
  "Hospitality Management": ["Hospitality", "Hospitality & Tourism"],
  "Tourism Management": ["Hospitality", "Hospitality & Tourism"],
  "Culinary Arts": ["Hospitality", "Hospitality & Tourism"],
  "Design & Creative Arts": ["Design", "Arts", "Music & Arts", "Design & Media", "Creative Multimedia"],
};

const ALIASES = new Map<string, string>();
for (const group of STUDY_FIELD_GROUPS) {
  for (const field of group.fields) {
    ALIASES.set(field.value.toLowerCase(), field.value);
    for (const alias of field.aliases ?? []) ALIASES.set(alias.toLowerCase(), field.value);
  }
}

export function canonicalField(input: string) {
  const q = input.trim().toLowerCase();
  return ALIASES.get(q) ?? input.trim();
}

export function exactFieldSearchTerms(field: string) {
  const canonical = canonicalField(field);
  const entry = STUDY_FIELD_GROUPS.flatMap((group) => group.fields).find((item) => item.value === canonical);
  return [...new Set([canonical, ...(entry?.aliases ?? [])])];
}

export function fieldSearchTerms(field: string) {
  const canonical = canonicalField(field);
  return [...new Set([...exactFieldSearchTerms(canonical), ...(FIELD_PARENT[canonical] ?? [])])];
}

/**
 * Exact matching for verified programme records.
 * A specific selection such as Civil Engineering must never return a generic
 * Engineering, Computer Engineering, or Software Engineering record.
 */
export function programmeFieldMatches(candidateBlob: string, selected: string) {
  if (!selected) return true;
  const haystack = candidateBlob.toLowerCase();
  const canonical = canonicalField(selected);

  // Generic umbrella fields are intentionally broad.
  if (canonical === "Engineering") return haystack.includes("engineering");

  return exactFieldSearchTerms(canonical).some((term) => {
    const needle = term.toLowerCase();
    return needle.length >= 3 && haystack.includes(needle);
  });
}

/**
 * Broader matching for institution discovery. Universities may only have a
 * high-level study area (for example Engineering) stored, so a Civil
 * Engineering search can still surface them as related institutions.
 */
export function fieldMatches(candidate: string, selected: string) {
  if (!selected) return true;
  const haystack = candidate.toLowerCase();
  return fieldSearchTerms(selected).some((term) => {
    const needle = term.toLowerCase();
    return haystack.includes(needle) || needle.includes(haystack);
  });
}

export function studyFieldLabel(field: string, locale: "en" | "ar") {
  if (!field) return "";
  const canonical = canonicalField(field);
  const entry = STUDY_FIELD_GROUPS.flatMap((group) => group.fields).find((item) => item.value === canonical);
  return locale === "ar" ? (entry?.labelAr ?? canonical) : canonical;
}

export function queryMatchesStudyTerms(blob: string, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (blob.toLowerCase().includes(q)) return true;
  const canonical = canonicalField(q);
  if (canonical.toLowerCase() === q) return false;
  return exactFieldSearchTerms(canonical).some((term) => blob.toLowerCase().includes(term.toLowerCase()));
}
