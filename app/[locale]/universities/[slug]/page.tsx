import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  FileText,
  GraduationCap,
  Globe2,
  MapPin,
} from "lucide-react";
import { Header } from "@/components/header";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { JsonLd } from "@/components/json-ld";
import { VERIFIED_AT } from "@/data/verified-universities";
import { UNIVERSITY_UI } from "@/data/university-ui";
import { getUniversityBySlug, getProgrammesByUniversitySlug } from "@/lib/catalog";
import type { Locale } from "@/data/content";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";


export function generateStaticParams() {
  return (["en", "ar"] as const).flatMap((locale) =>
    Object.keys(UNIVERSITY_UI)
      .filter((slug) => slug !== "bright")
      .map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const safeLocale = locale as Locale;
  const ui = await getUniversityBySlug(slug);
  if (!ui) return {};
  const title = safeLocale === "ar"
    ? `${ui.arabicName} في ماليزيا – التخصصات والقبول`
    : `${ui.name} Malaysia – Study Areas, Admission & Campus`;
  const description = safeLocale === "ar" ? ui.summaryAr : ui.summaryEn;
  return buildMetadata({ locale: safeLocale, path: `/universities/${slug}`, title, description });
}

export default async function UniversityPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();

  const safeLocale = locale as Locale;
  const safeSlug = slug;
  const isAr = safeLocale === "ar";
  const [ui, verifiedProgrammes] = await Promise.all([
    getUniversityBySlug(slug),
    getProgrammesByUniversitySlug(slug),
  ]);
  if (!ui) notFound();
  const studyAreas = isAr ? ui.studyAreasAr : ui.studyAreasEn;
  const websiteHost = ui.officialUrl.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];

  const profilePath = `/${safeLocale}/universities/${safeSlug}`;
  const universityJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    "@id": `${absoluteUrl(profilePath)}#institution`,
    name: ui.name,
    alternateName: [ui.shortName, ui.arabicName],
    url: absoluteUrl(profilePath),
    sameAs: ui.officialUrl ? [ui.officialUrl] : undefined,
    description: isAr ? ui.summaryAr : ui.summaryEn,
    address: {
      "@type": "PostalAddress",
      addressLocality: ui.city,
      addressCountry: "MY",
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
    { name: isAr ? "الجامعات" : "Universities", path: `/${safeLocale}/universities` },
    { name: isAr ? ui.arabicName : ui.name, path: profilePath },
  ]);

  const stats = [
    {
      label: isAr ? "الموقع" : "Location",
      value: ui.city || (isAr ? "قيد التحقق" : "Being verified"),
      icon: MapPin,
    },
    {
      label: isAr ? "النوع" : "Type",
      value: isAr ? ui.typeAr : ui.typeEn,
      icon: Building2,
    },
    {
      label: isAr ? "الحرم / الموقع الرئيسي" : "Main campus",
      value: isAr ? ui.campusAr : ui.campusEn,
      icon: GraduationCap,
    },
    {
      label: isAr ? "الموقع الرسمي" : "Official website",
      value: websiteHost,
      icon: Globe2,
    },
  ];

  const applySteps = isAr
    ? [
        ["1", "اختر الجامعة والتخصص", "حدّد المسار الذي يناسب مؤهلك وهدفك الدراسي."],
        ["2", "أرسل بياناتك إلى YAZ", "نراجع مؤهلك والمعلومات الأساسية قبل بدء إجراءات التقديم."],
        ["3", "تجهيز ورفع الطلب", "يتم تجهيز المستندات المطلوبة حسب متطلبات الجامعة والتخصص."],
        ["4", "متابعة القبول والإجراءات", "نتابع معك الخطوات التالية بعد صدور نتيجة الطلب."],
      ]
    : [
        ["1", "Choose university & programme", "Shortlist the option that fits your qualification and study goals."],
        ["2", "Send your details to YAZ", "We review your qualification and the core information before application."],
        ["3", "Prepare & submit the application", "Required documents are prepared according to the programme requirements."],
        ["4", "Follow the admission process", "We guide you through the next steps after the university decision."],
      ];

  return (
    <main className="university-profile-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={[universityJsonLd, breadcrumb]} />
      <section className="profile-hero">
        <div className="profile-hero-bg" aria-hidden="true" />
        <Header locale={safeLocale} />

        <div className="profile-hero-inner mx-auto max-w-[1440px] px-5 pb-12 pt-32 md:px-8 lg:px-12 lg:pb-16 lg:pt-36">
          <Link href={`/${safeLocale}/universities`} className="profile-breadcrumb">
            {isAr ? <ArrowRight size={17} /> : <ArrowLeft size={17} />}
            {isAr ? "الجامعات" : "Universities"}
          </Link>

          <div className="profile-hero-grid">
            <div className="profile-identity">
              <div className="profile-logo-card">
                <Image src={ui.logo} alt={`${ui.name} logo`} fill className="object-contain" sizes="160px" priority />
              </div>
              <div className="profile-title-block">
                <div className="profile-status-pill">
                  <BadgeCheck size={15} />
                  {ui.verified ? (isAr ? "بيانات موثقة" : "Verified profile") : (isAr ? "الملف قيد الاستكمال" : "Profile in progress")}
                </div>
                <h1>{isAr ? ui.arabicName : ui.name}</h1>
                <div className="profile-tag-row">
                  {ui.city ? <span><MapPin size={15} /> {ui.city}, Malaysia</span> : null}
                  <span><Building2 size={15} /> {isAr ? ui.typeAr : ui.typeEn}</span>
                </div>
              </div>
            </div>

            <div className="profile-hero-actions">
              <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer" className="profile-primary-action">
                {isAr ? "احصل على استشارة مجانية" : "Get Free Consultation"}
                {isAr ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </a>
              {ui.officialUrl ? (
                <a href={ui.officialUrl} target="_blank" rel="noreferrer" className="profile-secondary-action">
                  {isAr ? "الموقع الرسمي" : "Official Website"}
                  <ExternalLink size={17} />
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="profile-stats-wrap">
        <div className="profile-stats mx-auto max-w-[1280px]">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="profile-stat">
                <Icon size={20} />
                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <nav className="profile-tabs-wrap" aria-label={isAr ? "أقسام ملف الجامعة" : "University profile sections"}>
        <div className="profile-tabs mx-auto max-w-[1280px]">
          <a href="#overview">{isAr ? "نظرة عامة" : "Overview"}</a>
          <a href="#programmes">{verifiedProgrammes.length ? (isAr ? "البرامج" : "Programmes") : (isAr ? "مجالات الدراسة" : "Study Areas")}</a>
          <a href="#apply">{isAr ? "كيفية التقديم" : "How to Apply"}</a>
          <a href="#campus">{isAr ? "الحرم والسكن" : "Campus & Accommodation"}</a>
          <a href="#faq">{isAr ? "الأسئلة الشائعة" : "FAQ"}</a>
        </div>
      </nav>

      <div className="profile-content mx-auto max-w-[1280px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
        <section id="overview" className="profile-section profile-overview-section">
          <div className="profile-section-heading">
            <p>{isAr ? "نبذة" : "OVERVIEW"}</p>
            <h2>{isAr ? `عن ${ui.arabicName}` : `About ${ui.name}`}</h2>
          </div>
          <div className="profile-overview-grid">
            <article className="profile-overview-card">
              <p>{isAr ? ui.summaryAr : ui.summaryEn}</p>
              <div className="profile-study-areas">
                <strong>{isAr ? "أبرز مجالات الدراسة" : "Highlighted study areas"}</strong>
                <div>
                  {studyAreas.map((area) => <span key={area}>{area}</span>)}
                </div>
              </div>
              {ui.verified ? (
                <div className="profile-verified-note">
                  <BadgeCheck size={18} />
                  <span>{isAr ? `تمت مراجعة بيانات الملف بتاريخ ${ui.verifiedAt ?? VERIFIED_AT}.` : `Profile data reviewed on ${ui.verifiedAt ?? VERIFIED_AT}.`}</span>
                </div>
              ) : (
                <div className="profile-progress-note">
                  <FileText size={18} />
                  <span>{isAr ? "لن نعرض رسوماً أو مواعيد أو متطلبات غير موثقة. تواصل معنا للحصول على أحدث المعلومات." : "We will not display unverified fees, intakes or admission requirements. Contact YAZ for the latest information."}</span>
                </div>
              )}
            </article>

            <aside className="profile-yaz-card">
              <p className="profile-yaz-label">YAZ EDUCATION</p>
              <h3>{isAr ? "هل هذه المؤسسة مناسبة لك؟" : "Is this institution right for you?"}</h3>
              <p>{isAr ? "أرسل مؤهلك والتخصص الذي تفكر فيه وسنساعدك في تضييق الخيارات قبل التقديم." : "Send your qualification and preferred field, and we can help you narrow down your options before applying."}</p>
              <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer">
                {isAr ? "تحدث مع مستشار YAZ" : "Talk to a YAZ Advisor"}
                {isAr ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}
              </a>
            </aside>
          </div>
        </section>

        <section id="programmes" className="profile-section">
          <div className="profile-section-heading profile-section-heading-row">
            <div>
              <p>{isAr ? "الدراسة" : "STUDY OPTIONS"}</p>
              <h2>{verifiedProgrammes.length ? (isAr ? "البرامج" : "Programmes") : (isAr ? "مجالات الدراسة" : "Study Areas")}</h2>
            </div>
            {verifiedProgrammes.length ? <span className="profile-count-pill">{verifiedProgrammes.length} {isAr ? "برامج موثقة" : "verified programmes"}</span> : null}
          </div>

          {ui.verified && verifiedProgrammes.length ? (
            <div className="profile-program-grid">
              {verifiedProgrammes.map((program) => (
                <article key={program.name} className="profile-program-card">
                  <div className="program-level-pill">{program.level}</div>
                  <h3>{program.name}</h3>
                  <div className="program-meta-list">
                    {program.duration && <div><Clock3 size={17} /><span>{program.duration}</span></div>}
                    {program.intakes?.length ? <div><CalendarDays size={17} /><span>{program.intakes.join(" · ")}</span></div> : null}
                    {program.campus && <div><MapPin size={17} /><span>{program.campus}</span></div>}
                  </div>
                  {program.specialisations?.length ? (
                    <div className="specialisation-list">
                      {program.specialisations.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  ) : null}
                  <a href={program.sourceUrl} target="_blank" rel="noreferrer" className="program-source-link">
                    {isAr ? "المصدر الرسمي" : "Official source"} <ExternalLink size={15} />
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="profile-study-options-wrap">
              <div className="profile-study-options-grid">
                {studyAreas.map((area) => (
                  <div key={area} className="profile-study-option">
                    <GraduationCap size={20} />
                    <span>{area}</span>
                  </div>
                ))}
              </div>
              <div className="profile-study-options-note">
                <p>{isAr ? "هذه مجالات عامة موثقة من الموقع الرسمي. تفاصيل البرامج ومواعيد القبول تختلف حسب البرنامج والسنة الدراسية. للحصول على أحدث الرسوم تواصل مع مستشار YAZ." : "These are broad study areas verified from the institution's official website. Programme details, intakes and requirements can vary by programme and academic year. Contact a YAZ advisor for the latest tuition fee."}</p>
                <a href={ui.officialUrl} target="_blank" rel="noreferrer" className="profile-browse-official">
                  {isAr ? "تصفح البرامج في الموقع الرسمي" : "Browse programmes on the official website"}
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}
        </section>

        <section id="apply" className="profile-section">
          <div className="profile-section-heading">
            <p>{isAr ? "خطوات واضحة" : "CLEAR PROCESS"}</p>
            <h2>{isAr ? "كيفية التقديم" : "How to Apply"}</h2>
          </div>
          <div className="profile-steps-grid">
            {applySteps.map(([number, title, body]) => (
              <article key={number} className="profile-step-card">
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>

          <div className="profile-checklist-card">
            <div>
              <p className="profile-yaz-label">{isAr ? "قائمة مبدئية" : "TYPICAL CHECKLIST"}</p>
              <h3>{isAr ? "مستندات قد تحتاجها" : "Documents you may need"}</h3>
              <p>{isAr ? "المتطلبات تختلف حسب الجامعة والبرنامج، لذلك يتم تأكيدها قبل رفع الطلب." : "Requirements vary by institution and programme, so the final checklist is confirmed before submission."}</p>
            </div>
            <ul>
              <li><Check size={17} />{isAr ? "جواز سفر ساري" : "Valid passport"}</li>
              <li><Check size={17} />{isAr ? "الشهادات وكشوف الدرجات" : "Certificates and academic transcripts"}</li>
              <li><Check size={17} />{isAr ? "إثبات اللغة إذا كان مطلوباً" : "English-language evidence when required"}</li>
              <li><Check size={17} />{isAr ? "مستندات إضافية حسب البرنامج" : "Additional programme-specific documents"}</li>
            </ul>
          </div>
        </section>

        <section id="campus" className="profile-section">
          <div className="profile-section-heading">
            <p>{isAr ? "الحياة الطلابية" : "STUDENT LIFE"}</p>
            <h2>{isAr ? "الحرم الجامعي والسكن" : "Campus & Accommodation"}</h2>
          </div>
          <div className="profile-info-panels">
            <article>
              <MapPin size={24} />
              <h3>{isAr ? "الموقع" : "Location"}</h3>
              <p>{isAr ? ui.campusAr : ui.campusEn}</p>
            </article>
            <article>
              <Building2 size={24} />
              <h3>{isAr ? "السكن" : "Accommodation"}</h3>
              <p>{isAr ? "يمكن لـ YAZ مساعدتك في مناقشة خيارات السكن المناسبة حسب الجامعة والميزانية." : "YAZ can help you discuss suitable accommodation options based on the institution and your budget."}</p>
            </article>
            <article>
              <Globe2 size={24} />
              <h3>{isAr ? "الموقع الرسمي" : "Official Website"}</h3>
              <p>{websiteHost}</p>
              <a href={ui.officialUrl} target="_blank" rel="noreferrer" className="profile-inline-link">
                {isAr ? "فتح الموقع الرسمي" : "Visit official website"} <ExternalLink size={15} />
              </a>
            </article>
          </div>
        </section>

        <section id="faq" className="profile-section profile-faq-section">
          <div className="profile-section-heading">
            <p>FAQ</p>
            <h2>{isAr ? "أسئلة شائعة" : "Frequently Asked Questions"}</h2>
          </div>
          <div className="profile-faq-list">
            <details>
              <summary>{isAr ? "هل الرسوم ثابتة؟" : "Are the fees fixed?"}</summary>
              <p>{isAr ? "لا. الرسوم قد تتغير حسب السنة والدفعة والبرنامج، لذلك لا نعرض سعراً ثابتاً للعامة ويؤكد مستشار YAZ أحدث رسوم قبل التقديم." : "No. Tuition can change by academic year, intake and programme, so YAZ does not publish a fixed public fee and an advisor reconfirms the latest amount before application."}</p>
            </details>
            <details>
              <summary>{isAr ? "هل مواعيد القبول واحدة لكل التخصصات؟" : "Are intake dates the same for every programme?"}</summary>
              <p>{isAr ? "ليس بالضرورة. بعض البرامج لها مواعيد مختلفة، لذلك يتم التحقق من صفحة البرنامج الرسمية." : "Not necessarily. Some programmes use different intake schedules, so the official programme page should be checked."}</p>
            </details>
            <details>
              <summary>{isAr ? "هل يمكن لـ YAZ مساعدتي في اختيار التخصص؟" : "Can YAZ help me choose a programme?"}</summary>
              <p>{isAr ? "نعم. يمكنك إرسال مؤهلك واهتماماتك وميزانيتك لمناقشة الخيارات المناسبة قبل التقديم." : "Yes. You can share your qualification, interests and budget to discuss suitable options before applying."}</p>
            </details>
          </div>
        </section>
      </div>

      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
