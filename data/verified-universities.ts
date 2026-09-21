export const VERIFIED_AT = "2026-09-21";

export type VerifiedProgram = {
  name: string;
  level: string;
  duration?: string;
  intakes?: string[];
  internationalFee?: string;
  campus?: string;
  specialisations?: string[];
  sourceUrl: string;
};

export type VerifiedUniversity = {
  name: string;
  shortName: string;
  city: string;
  officialUrl: string;
  programmes: VerifiedProgram[];
};

// Seed data verified against official university webpages on VERIFIED_AT.
// Keep this file deliberately small and auditable. Add/edit records only after checking an official source.
export const VERIFIED_UNIVERSITIES: VerifiedUniversity[] = [
  {
    name: "Asia Pacific University of Technology & Innovation",
    shortName: "APU",
    city: "Kuala Lumpur",
    officialUrl: "https://www.apu.edu.my/",
    programmes: [
      {
        name: "Bachelor of Science (Honours) in Computer Science",
        level: "Bachelor's",
        internationalFee: "RM108,500 total (official 2026 page; excludes deposits/miscellaneous fees and applicable SST)",
        sourceUrl: "https://www.apu.edu.my/course/bsc-hons-in-computer-science"
      },
      {
        name: "Bachelor of Computer Science (Hons) (Artificial Intelligence)",
        level: "Bachelor's",
        duration: "3 years",
        intakes: ["28 September 2026", "24 November 2026"],
        sourceUrl: "https://www.apu.edu.my/course/bsc-hons-in-computer-science-ai"
      },
      {
        name: "Bachelor of Computer Engineering with Honours",
        level: "Bachelor's",
        duration: "4 years",
        intakes: ["28 September 2026", "24 November 2026"],
        internationalFee: "RM137,200 total (official 2026 page; excludes deposits/miscellaneous fees and applicable SST)",
        sourceUrl: "https://www.apu.edu.my/course/bachelor-of-computer-engineering"
      }
    ]
  },
  {
    name: "Taylor's University",
    shortName: "Taylor's",
    city: "Subang Jaya",
    officialUrl: "https://university.taylors.edu.my/",
    programmes: [
      {
        name: "Bachelor of Computer Science (Honours)",
        level: "Bachelor's",
        duration: "3 years",
        intakes: ["February", "April", "September"],
        internationalFee: "USD 40,049 (official 2026 page; fees may be revised and applicable service tax is separate)",
        specialisations: ["Data Science", "Cyber Security", "Mobile Computing", "Artificial Intelligence"],
        sourceUrl: "https://university.taylors.edu.my/en/study/explore-all-programmes/computer-science/undergraduate/bachelor-of-computer-science.html"
      },
      {
        name: "Bachelor of Software Engineering (Honours)",
        level: "Bachelor's",
        duration: "3 years",
        intakes: ["February", "April", "September"],
        internationalFee: "USD 40,049 (official 2026 page; fees may be revised and applicable service tax is separate)",
        sourceUrl: "https://university.taylors.edu.my/en/study/explore-all-programmes/computer-science/undergraduate/bachelor-of-software-engineering.html"
      },
      {
        name: "Bachelor of Information Technology (Honours)",
        level: "Bachelor's",
        duration: "3 years",
        intakes: ["February", "April", "September"],
        internationalFee: "USD 40,049 (official 2026 page; fees may be revised and applicable service tax is separate)",
        sourceUrl: "https://university.taylors.edu.my/en/study/explore-all-programmes/computer-science/undergraduate/bachelor-of-information-technology.html"
      }
    ]
  },
  {
    name: "UCSI University",
    shortName: "UCSI",
    city: "Kuala Lumpur",
    officialUrl: "https://www.ucsiuniversity.edu.my/",
    programmes: [
      {
        name: "Bachelor of Computer Science (Honours)",
        level: "Bachelor's",
        campus: "Kuala Lumpur",
        sourceUrl: "https://www.ucsiuniversity.edu.my/programmes/Institute-of-Computer-Science-and-Digital-Innovation"
      },
      {
        name: "Bachelor of Computer Science in Artificial Intelligence with Honours",
        level: "Bachelor's",
        campus: "Kuala Lumpur",
        sourceUrl: "https://www.ucsiuniversity.edu.my/programmes/Institute-of-Computer-Science-and-Digital-Innovation"
      },
      {
        name: "Bachelor of Computer Science in Cyber Security with Honours",
        level: "Bachelor's",
        campus: "Kuala Lumpur",
        sourceUrl: "https://www.ucsiuniversity.edu.my/programmes/Institute-of-Computer-Science-and-Digital-Innovation"
      },
      {
        name: "Bachelor of Computer Science in Data Science with Honours",
        level: "Bachelor's",
        campus: "Kuala Lumpur",
        sourceUrl: "https://www.ucsiuniversity.edu.my/programmes/Institute-of-Computer-Science-and-Digital-Innovation"
      },
      {
        name: "Bachelor of Arts (Hons) in Business Administration",
        level: "Bachelor's",
        duration: "3 years",
        intakes: ["January", "May", "September"],
        campus: "Kuala Lumpur",
        sourceUrl: "https://www.ucsiuniversity.edu.my/programmes/bachelor-arts-hons-business-administration"
      }
    ]
  },
  {
    name: "Multimedia University",
    shortName: "MMU",
    city: "Cyberjaya / Melaka",
    officialUrl: "https://www.mmu.edu.my/",
    programmes: [
      {
        name: "Bachelor of Computer Science (Honours)",
        level: "Bachelor's",
        duration: "3 years",
        specialisations: ["Software Engineering", "Game Development", "Data Science", "Cybersecurity"],
        campus: "Cyberjaya",
        sourceUrl: "https://www.mmu.edu.my/cyberjaya/undergraduate/information-technology/bachelor-of-computer-science-hons/"
      }
    ]
  },
  {
    name: "Sunway University",
    shortName: "Sunway",
    city: "Bandar Sunway",
    officialUrl: "https://sunwayuniversity.edu.my/",
    programmes: [
      {
        name: "Bachelor of Science (Honours) in Computer Science",
        level: "Bachelor's",
        sourceUrl: "https://sunwayuniversity.edu.my/faculty-of-engineering-and-technology/courses/bachelor-of-science-honours-computer-science"
      }
    ]
  }
];
