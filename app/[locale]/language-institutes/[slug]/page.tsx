import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpenText, Check, ClipboardCheck, ExternalLink, Globe2, GraduationCap, Home, Languages, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { JsonLd } from "@/components/json-ld";
import { LANGUAGE_INSTITUTE_BY_SLUG, LANGUAGE_INSTITUTES } from "@/data/language-institutes";
import type { Locale } from "@/data/content";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";


export function generateStaticParams() {
  return (["en", "ar"] as const).flatMap((locale) => LANGUAGE_INSTITUTES.map((institute) => ({ locale, slug: institute.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const institute = LANGUAGE_INSTITUTE_BY_SLUG[slug];
  if (!institute) return {};
  const safeLocale = locale as Locale;
  const title = safeLocale === "ar"
    ? `${institute.arabicName} في ماليزيا – البرامج والتسجيل`
    : `${institute.name} Malaysia – English Courses & Enrolment`;
  const description = safeLocale === "ar" ? institute.summaryAr : institute.summaryEn;
  return buildMetadata({ locale: safeLocale, path: `/language-institutes/${slug}`, title, description });
}

export default async function LanguageInstituteProfile({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const institute = LANGUAGE_INSTITUTE_BY_SLUG[slug];
  if (!institute) notFound();

  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";
  const courses = isAr ? institute.coursesAr : institute.coursesEn;

  const profilePath = `/${safeLocale}/language-institutes/${institute.slug}`;
  const instituteJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "@id": `${absoluteUrl(profilePath)}#institute`,
    name: institute.name,
    alternateName: [institute.shortName, institute.arabicName],
    url: absoluteUrl(profilePath),
    sameAs: [institute.officialUrl],
    description: isAr ? institute.summaryAr : institute.summaryEn,
    address: {
      "@type": "PostalAddress",
      addressLocality: institute.city,
      addressCountry: "MY",
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
    { name: isAr ? "معاهد اللغة" : "Language Institutes", path: `/${safeLocale}/language-institutes` },
    { name: isAr ? institute.arabicName : institute.name, path: profilePath },
  ]);

  const sectionNav = [
    ["overview", isAr ? "نبذة عامة" : "Overview"],
    ["programmes", isAr ? "البرامج" : "Programmes"],
    ["assessment", isAr ? "التقييم والمتابعة" : "Assessment"],
    ["why", isAr ? "لماذا هذا المعهد؟" : "Why choose it"],
    ["apply", isAr ? "كيفية التسجيل" : "How to apply"],
    ["accommodation", isAr ? "السكن والدعم" : "Accommodation"],
    ["faq", isAr ? "الأسئلة الشائعة" : "FAQ"],
  ];

  return (
    <main className="language-profile-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={[instituteJsonLd, breadcrumb]} />
      <section className="language-profile-hero">
        <Header locale={safeLocale} />
        <div className="language-profile-glow" aria-hidden="true" />
        <div className="mx-auto grid max-w-[1280px] gap-8 px-5 pb-14 pt-36 md:px-8 lg:grid-cols-[1fr_300px] lg:px-12 lg:pb-16 lg:pt-40">
          <div>
            <Link href={`/${locale}/language-institutes`} className="language-profile-back">
              {isAr ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
              {isAr ? "كل معاهد اللغة" : "All language institutes"}
            </Link>
            <p className="directory-kicker">{isAr ? "معهد لغة إنجليزية" : "ENGLISH LANGUAGE INSTITUTE"}</p>
            <h1>{isAr ? institute.arabicName : institute.name}</h1>
            <div className="language-profile-tags">
              <span><MapPin size={16} />{institute.city}</span>
              <span><Languages size={16} />{isAr ? institute.typeAr : institute.typeEn}</span>
            </div>
            <p className="language-profile-summary">{isAr ? institute.summaryAr : institute.summaryEn}</p>
            <div className="language-profile-actions">
              <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer" className="primary-btn">
                {isAr ? "استشارة مجانية مع YAZ" : "Free Consultation with YAZ"}
              </a>
              <a href={institute.officialUrl} target="_blank" rel="noreferrer" className="secondary-btn">
                {isAr ? "الموقع الرسمي" : "Official Website"}<ExternalLink size={16} />
              </a>
            </div>
          </div>

          <div className="language-profile-logo-card">
            {institute.logo ? (
              <div className="relative h-44 w-full">
                <Image src={institute.logo} alt={institute.name} fill className="object-contain" sizes="300px" />
              </div>
            ) : (
              <div className="language-profile-wordmark">{institute.shortName}</div>
            )}
          </div>
        </div>
      </section>

      <div className="language-section-nav-wrap">
        <nav className="language-section-nav mx-auto max-w-[1280px] px-5 md:px-8 lg:px-12" aria-label={isAr ? "أقسام المعهد" : "Institute sections"}>
          {sectionNav.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
      </div>

      <section id="overview" className="language-rich-section">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "نبذة" : "OVERVIEW"}</p>
            <h2>{isAr ? `عن ${institute.arabicName}` : `About ${institute.name}`}</h2>
            <p>{isAr ? institute.summaryAr : institute.summaryEn}</p>
          </div>
          <div className="language-fact-grid">
            {institute.quickFacts.map((fact) => (
              <article key={fact.titleEn} className="language-fact-card">
                <span><ShieldCheck size={18} /></span>
                <h3>{isAr ? fact.titleAr : fact.titleEn}</h3>
                <p>{isAr ? fact.bodyAr : fact.bodyEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="programmes" className="language-rich-section language-rich-alt">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "البرامج" : "PROGRAMMES"}</p>
            <h2>{isAr ? "خيارات الدراسة" : "Study Options"}</h2>
            <p>{isAr ? "البرامج التالية مدرجة في المصادر الرسمية للمعهد. الرسوم والمواعيد قد تتغير، لذلك نؤكدها قبل التقديم." : "These programmes are listed by the institute's official sources. Fees and start dates can change, so YAZ reconfirms them before application."}</p>
          </div>
          <div className="language-program-grid">
            {courses.map((course) => <article key={course}><GraduationCap size={20} /><span>{course}</span></article>)}
          </div>
        </div>
      </section>

      <section id="assessment" className="language-rich-section">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "التقييم والمتابعة" : "ASSESSMENT & PROGRESS"}</p>
            <h2>{isAr ? "كيف تتم متابعة تقدم الطالب؟" : "How student progress is monitored"}</h2>
          </div>
          <div className="language-step-grid">
            {institute.assessment.map((item, index) => (
              <article key={item.titleEn}>
                <div className="language-step-number">{index + 1}</div>
                <h3>{isAr ? item.titleAr : item.titleEn}</h3>
                <p>{isAr ? item.bodyAr : item.bodyEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="language-rich-section language-rich-alt">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "لماذا هذا المعهد؟" : "WHY CHOOSE THIS INSTITUTE"}</p>
            <h2>{isAr ? `أسباب قد تجعل ${institute.shortName} مناسباً لك` : `Reasons ${institute.shortName} may fit your study goals`}</h2>
          </div>
          <div className="language-why-grid">
            {institute.whyChoose.map((item) => (
              <article key={item.titleEn}>
                <Sparkles size={20} />
                <h3>{isAr ? item.titleAr : item.titleEn}</h3>
                <p>{isAr ? item.bodyAr : item.bodyEn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="apply" className="language-rich-section">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "كيفية التسجيل" : "HOW TO APPLY"}</p>
            <h2>{isAr ? "خطوات التسجيل الأساسية" : "Typical enrolment steps"}</h2>
          </div>
          <div className="language-step-grid language-apply-grid">
            {institute.application.map((item, index) => (
              <article key={item.titleEn}>
                <div className="language-step-number">{index + 1}</div>
                <ClipboardCheck size={22} />
                <h3>{isAr ? item.titleAr : item.titleEn}</h3>
                <p>{isAr ? item.bodyAr : item.bodyEn}</p>
              </article>
            ))}
          </div>
          <div className="language-note-card">
            <Check size={20} />
            <p>{isAr ? "متطلبات التأشيرة والمستندات تختلف بحسب الجنسية ومدة الدراسة. يجب التحقق من المتطلبات الحالية قبل الدفع أو السفر." : "Visa and document requirements vary by nationality and study duration. Current requirements should be verified before payment or travel."}</p>
          </div>
        </div>
      </section>

      <section id="accommodation" className="language-rich-section language-rich-alt">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">{isAr ? "السكن والدعم" : "ACCOMMODATION & SUPPORT"}</p>
            <h2>{isAr ? "الحياة خارج الفصل" : "Support beyond the classroom"}</h2>
          </div>
          <div className="language-two-card-grid">
            <article><Home size={24} /><h3>{isAr ? "السكن" : "Accommodation"}</h3><p>{isAr ? institute.accommodationAr : institute.accommodationEn}</p></article>
            <article><BookOpenText size={24} /><h3>{isAr ? "دعم الطلاب" : "Student Support"}</h3><p>{isAr ? institute.supportAr : institute.supportEn}</p></article>
          </div>
        </div>
      </section>

      <section id="faq" className="language-rich-section language-faq-section">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="language-rich-heading">
            <p className="directory-kicker">FAQ</p>
            <h2>{isAr ? "الأسئلة الشائعة" : "Frequently asked questions"}</h2>
          </div>
          <div className="language-faq-list">
            {institute.faq.map((item) => (
              <details key={item.qEn}>
                <summary>{isAr ? item.qAr : item.qEn}</summary>
                <p>{isAr ? item.aAr : item.aEn}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="language-source-section">
        <div className="mx-auto max-w-[1280px] px-5 pb-16 md:px-8 lg:px-12">
          <div className="language-source-card">
            <div>
              <p className="directory-kicker">{isAr ? "المصادر الرسمية" : "OFFICIAL SOURCES"}</p>
              <h2>{isAr ? "تحقق من أحدث التفاصيل" : "Verify the latest details"}</h2>
              <p>{isAr ? "نستخدم المصادر الرسمية لبناء صفحات المعاهد، ونراجع الرسوم والمواعيد والمتطلبات قبل أي تقديم فعلي." : "YAZ builds these profiles from official institute sources and reconfirms fees, dates and admission requirements before any real application."}</p>
            </div>
            <div className="language-source-links">
              {institute.sourceUrls.map((url, index) => <a key={url} href={url} target="_blank" rel="noreferrer">{isAr ? `مصدر رسمي ${index + 1}` : `Official source ${index + 1}`}<ExternalLink size={15} /></a>)}
            </div>
          </div>
        </div>
      </section>

      <section className="language-profile-final-cta">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-5 py-14 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div>
            <p className="directory-kicker">YAZ EDUCATION</p>
            <h2>{isAr ? "هل تريد معرفة أفضل معهد وخطة دراسة لحالتك؟" : "Want help choosing the right institute and study plan?"}</h2>
            <p>{isAr ? "أرسل لنا هدفك، مستواك الحالي، المدة والميزانية، وسنساعدك في ترتيب الخيارات." : "Send us your goal, current level, preferred duration and budget, and we'll help organise your options."}</p>
          </div>
          <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer">{isAr ? "تحدث مع مستشار YAZ" : "Talk to a YAZ Advisor"}{isAr ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}</a>
        </div>
      </section>

      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
