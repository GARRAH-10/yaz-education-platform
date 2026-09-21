"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { content, type Locale } from "@/data/content";
import { UNIVERSITY_UI, type UniversitySlug } from "@/data/university-ui";

const logoInstitutions: Array<{ slug: UniversitySlug; name: string; logo: string }> = [
  { slug: "bright", name: "Bright Language Center", logo: "/universities/bright.png" },
  { slug: "apu", name: "Asia Pacific University (APU)", logo: "/universities/apu.png" },
  { slug: "mmu", name: "Multimedia University (MMU)", logo: "/universities/mmu.png" },
  { slug: "utm", name: "Universiti Teknologi Malaysia (UTM)", logo: "/universities/utm.png" },
  { slug: "taylors-college", name: "Taylor's College", logo: "/universities/taylors-college.png" },
  { slug: "taylors", name: "Taylor's University", logo: "/universities/taylors.png" },
  { slug: "iium", name: "International Islamic University Malaysia (IIUM)", logo: "/universities/iium.png" },
  { slug: "utem", name: "Universiti Teknikal Malaysia Melaka (UTeM)", logo: "/universities/utem.png" },
  { slug: "segi", name: "SEGi University", logo: "/universities/segi.png" },
  { slug: "usm", name: "Universiti Sains Malaysia (USM)", logo: "/universities/usm.png" },
  { slug: "ucsi", name: "UCSI University", logo: "/universities/ucsi.png" },
  { slug: "sunway", name: "Sunway University", logo: "/universities/sunway.png" },
  { slug: "inti", name: "INTI International University", logo: "/universities/inti.png" },
  { slug: "help", name: "HELP University", logo: "/universities/help.png" },
  { slug: "cyberjaya", name: "University of Cyberjaya", logo: "/universities/cyberjaya.png" },
  { slug: "city", name: "City University Malaysia", logo: "/universities/city.png" },
];

const PAGE_SIZE = 5;

export function UniversityStrip({ locale }: { locale: Locale }) {
  const t = content[locale];
  const isAr = locale === "ar";
  const track = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pageCount = Math.ceil(logoInstitutions.length / PAGE_SIZE);

  const goToPage = (nextPage: number) => {
    const bounded = Math.max(0, Math.min(pageCount - 1, nextPage));
    const nodes = track.current?.querySelectorAll<HTMLElement>("[data-logo-card]");
    const target = nodes?.[bounded * PAGE_SIZE];
    target?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setPage(bounded);
  };

  return (
    <section id="universities" className="university-showcase university-showcase-v11" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1440px] px-5 py-16 md:px-8 lg:px-12 lg:py-20">
        <div className="university-showcase-head university-showcase-head-v11">
          <p className="university-kicker">{isAr ? "جامعات ومعاهد في ماليزيا" : "UNIVERSITIES & LANGUAGE CENTRES"}</p>
          <h2>{isAr ? "اختر المؤسسة التي تريد معرفة المزيد عنها" : "Choose an institution to explore"}</h2>
          <p className="university-head-copy">
            {isAr
              ? "اضغط على أي شعار لفتح ملف المؤسسة. الملفات الموثقة تعرض معلومات البرامج والقبول، بينما الملفات الأخرى يتم استكمال بياناتها تدريجياً."
              : "Select any logo to open its profile. Verified profiles show programme and admission information, while the remaining profiles are being expanded progressively."}
          </p>
        </div>

        <div className="university-logo-band university-logo-band-v11" aria-label={t.logosTitle}>
          <button type="button" className="university-arrow" onClick={() => goToPage(page - 1)} aria-label="Previous institutions" disabled={page === 0}>
            <ChevronLeft size={22} className={isAr ? "rotate-180" : ""} />
          </button>

          <div className="university-logo-track university-logo-track-v11" ref={track}>
            {logoInstitutions.map((institution) => {
              const ui = UNIVERSITY_UI[institution.slug];
              return (
                <Link
                  key={institution.slug}
                  href={`/${locale}/universities/${institution.slug}`}
                  data-logo-card
                  className="university-logo-card university-logo-card-v11"
                  title={institution.name}
                >
                  <div className="university-logo-image-wrap university-logo-image-wrap-v11">
                    <Image src={institution.logo} alt={`${institution.name} logo`} fill className="university-logo-image" sizes="220px" />
                  </div>
                  <div className="university-logo-card-caption">
                    <span>{isAr ? ui.arabicName : ui.name}</span>
                    <small>{ui.verified ? (isAr ? "ملف موثق" : "Verified profile") : (isAr ? "الملف قيد الاستكمال" : "Profile in progress")}</small>
                  </div>
                </Link>
              );
            })}
          </div>

          <button type="button" className="university-arrow" onClick={() => goToPage(page + 1)} aria-label="Next institutions" disabled={page === pageCount - 1}>
            <ChevronRight size={22} className={isAr ? "rotate-180" : ""} />
          </button>
        </div>

        <div className="university-dots" aria-label="Institution carousel pages">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              type="button"
              className={`university-dot ${page === index ? "university-dot-active" : ""}`}
              aria-label={`Go to institutions page ${index + 1}`}
              aria-current={page === index ? "true" : undefined}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>

        <div className="university-directory-cta">
          <div>
            <strong>{isAr ? "استكشف جميع الجامعات والكليات" : "Explore all universities & colleges"}</strong>
            <span>{isAr ? "ابحث حسب الاسم والموقع ونوع المؤسسة ومجال الدراسة." : "Search by name, location, institution type and study area."}</span>
          </div>
          <Link href={`/${locale}/universities`} className="university-directory-cta-btn">
            {isAr ? "فتح دليل الجامعات" : "Open university directory"}
            <ArrowRight size={17} className={isAr ? "rotate-180" : ""} />
          </Link>
        </div>

        <div className="university-section-note university-section-note-v11">
          <span className="university-note-dot" />
          {isAr
            ? "عرض أي مؤسسة هنا لا يعني وجود شراكة رسمية إلا إذا أعلنت YAZ ذلك صراحةً."
            : "An institution being shown here does not imply a formal partnership unless YAZ explicitly states one."}
        </div>
      </div>
    </section>
  );
}
