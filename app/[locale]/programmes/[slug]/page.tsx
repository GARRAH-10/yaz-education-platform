import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Award, BookOpen, Building2, CalendarDays, CheckCircle2, Clock3, ExternalLink, FileText, GraduationCap, MapPin, WalletCards } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { JsonLd } from "@/components/json-ld";
import { PROGRAMMES } from "@/data/programmes";
import { getProgrammeBySlug, getUniversityBySlug } from "@/lib/catalog";
import type { Locale } from "@/data/content";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";


export function generateStaticParams() {
  return (["en", "ar"] as const).flatMap((locale) => PROGRAMMES.map((programme) => ({ locale, slug: programme.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const programme = await getProgrammeBySlug(slug);
  if (!programme) return {};
  const safeLocale = locale as Locale;
  const title = safeLocale === "ar"
    ? `${programme.name} في ${programme.universityShortName} – ماليزيا`
    : `${programme.name} at ${programme.universityShortName} Malaysia`;
  const description = safeLocale === "ar"
    ? `معلومات موثقة عن ${programme.name} في ${programme.universityName}: المرحلة الدراسية، الموقع، والبيانات المتاحة من المصدر الرسمي.`
    : `Verified information about ${programme.name} at ${programme.universityName}, including study level, location and available official-source details.`;
  return buildMetadata({ locale: safeLocale, path: `/programmes/${slug}`, title, description });
}

export default async function ProgrammeProfile({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const programme = await getProgrammeBySlug(slug);
  if (!programme) notFound();

  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const displayName = isAr && programme.arabicName ? programme.arabicName : programme.name;

  const whatsappMessage = encodeURIComponent(`${isAr ? "مرحباً YAZ Education، أريد أحدث الرسوم ومعلومات التقديم لهذا البرنامج:" : "Hello YAZ Education, I would like the latest tuition fee and application information for this programme:"}\n${programme.name}\n${programme.universityName}`);

  const profilePath = `/${safeLocale}/programmes/${programme.slug}`;
  const universityUi = await getUniversityBySlug(programme.universitySlug);
  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${absoluteUrl(profilePath)}#course`,
    name: programme.name,
    url: absoluteUrl(profilePath),
    description: isAr
      ? `برنامج ${programme.name} في ${programme.universityName} بماليزيا.`
      : `${programme.name} at ${programme.universityName} in Malaysia.`,
    educationalLevel: programme.level,
    provider: {
      "@type": "CollegeOrUniversity",
      name: programme.universityName,
      sameAs: universityUi?.officialUrl ? universityUi.officialUrl : undefined,
    },
  };
  const breadcrumb = breadcrumbJsonLd([
    { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
    { name: isAr ? "البرامج" : "Programmes", path: `/${safeLocale}/programmes` },
    { name: programme.name, path: profilePath },
  ]);

  return (
    <main className="programme-profile-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={[courseJsonLd, breadcrumb]} />
      <section className="programme-profile-hero">
        <Header locale={safeLocale} />
        <div className="mx-auto max-w-[1280px] px-5 pb-14 pt-36 md:px-8 lg:px-12 lg:pb-16 lg:pt-40">
          <Link href={`/${locale}/programmes`} className="programme-back-link"><BackIcon size={16} />{isAr ? "كل البرامج" : "All programmes"}</Link>
          <div className="programme-profile-hero-grid">
            <div>
              <p className="directory-kicker">{programme.universityShortName}</p>
              <h1>{displayName}</h1>
              <div className="programme-profile-tags">
                <span><GraduationCap size={16} />{programme.level}</span>
                <span><BookOpen size={16} />{programme.field}</span>
                <span><MapPin size={16} />{programme.campus ?? programme.city}</span>
              </div>
              <div className="programme-profile-actions">
                <a className="primary-btn" href={`https://wa.me/60102282144?text=${whatsappMessage}`} target="_blank" rel="noreferrer">{isAr ? "احصل على أحدث الرسوم" : "Get Latest Tuition Fee"}</a>
                <a className="secondary-btn" href={programme.sourceUrl} target="_blank" rel="noreferrer">{isAr ? "المصدر الرسمي" : "Official Source"}<ExternalLink size={16} /></a>
              </div>
            </div>
            <div className="programme-profile-logo-card">
              <div className="relative h-40 w-full"><Image src={programme.universityLogo} alt={programme.universityShortName} fill className="object-contain" sizes="280px" /></div>
              <p>{programme.universityName}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="programme-profile-body">
        <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8 lg:px-12 lg:py-20">
          <div className="programme-facts-grid">
            <Fact icon={<Building2 size={20} />} label={isAr ? "الجامعة" : "University"} value={programme.universityName} />
            <Fact icon={<MapPin size={20} />} label={isAr ? "الموقع" : "Location"} value={programme.campus ?? programme.city} />
            <Fact icon={<Clock3 size={20} />} label={isAr ? "المدة" : "Duration"} value={programme.duration ?? (isAr ? "غير موثق بعد" : "Not yet verified")} />
            <Fact icon={<CalendarDays size={20} />} label={isAr ? "مواعيد القبول" : "Intakes"} value={programme.intakes?.join(", ") ?? (isAr ? "غير موثق بعد" : "Not yet verified")} />
            <Fact icon={<WalletCards size={20} />} label={isAr ? "أحدث الرسوم" : "Latest tuition fee"} value={isAr ? "تواصل مع مستشار YAZ" : "Contact a YAZ advisor"} />
            <Fact icon={<BookOpen size={20} />} label={isAr ? "نمط الدراسة" : "Study mode"} value={programme.studyMode ?? (isAr ? "غير موثق بعد" : "Not yet verified")} />
            <Fact icon={<CheckCircle2 size={20} />} label={isAr ? "آخر تحقق" : "Last verified"} value={programme.verifiedAt} />
          </div>

          <div className="programme-profile-content-grid">
            <article className="programme-profile-main-card">
              <p className="directory-kicker">{isAr ? "تفاصيل البرنامج" : "PROGRAMME DETAILS"}</p>
              <h2>{isAr ? "ما الذي تم التحقق منه؟" : "What has been verified?"}</h2>
              <p>{isAr ? "تعرض هذه الصفحة المعلومات التي تم التحقق منها من المصدر الرسمي للجامعة. لا نعرض الرسوم الدقيقة للعامة لأنها قد تتغير حسب السنة والدفعة والحالة؛ يؤكدها مستشار YAZ قبل التقديم." : "This page displays information verified from the university's official source. Exact tuition fees are intentionally not published because they can change by year, intake and applicant status; a YAZ advisor confirms the current fee before application."}</p>

              {programme.specialisations?.length ? (
                <div className="programme-profile-specialisations">
                  <h3>{isAr ? "التخصصات / المسارات" : "Specialisations / pathways"}</h3>
                  <div>{programme.specialisations.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
              ) : null}

              {(isAr ? programme.academicRequirementsAr : programme.academicRequirementsEn) ? (
                <ProgrammeDetailSection icon={<GraduationCap size={19} />} title={isAr ? "المتطلبات الأكاديمية" : "Academic requirements"}>
                  <p>{isAr ? programme.academicRequirementsAr : programme.academicRequirementsEn}</p>
                </ProgrammeDetailSection>
              ) : null}

              {(isAr ? programme.englishRequirementsAr : programme.englishRequirementsEn) ? (
                <ProgrammeDetailSection icon={<BookOpen size={19} />} title={isAr ? "متطلبات اللغة الإنجليزية" : "English requirements"}>
                  <p>{isAr ? programme.englishRequirementsAr : programme.englishRequirementsEn}</p>
                </ProgrammeDetailSection>
              ) : null}

              {(isAr ? programme.requiredDocumentsAr : programme.requiredDocumentsEn)?.length ? (
                <ProgrammeDetailSection icon={<FileText size={19} />} title={isAr ? "المستندات المطلوبة" : "Required documents"}>
                  <ul>{(isAr ? programme.requiredDocumentsAr : programme.requiredDocumentsEn)?.map((item) => <li key={item}>{item}</li>)}</ul>
                </ProgrammeDetailSection>
              ) : null}

              {programme.accreditation ? (
                <ProgrammeDetailSection icon={<Award size={19} />} title={isAr ? "الاعتماد / الاعتراف" : "Accreditation / recognition"}>
                  <p>{programme.accreditation}</p>
                </ProgrammeDetailSection>
              ) : null}

              {(isAr ? programme.scholarshipInfoAr : programme.scholarshipInfoEn) ? (
                <ProgrammeDetailSection icon={<WalletCards size={19} />} title={isAr ? "معلومات المنح" : "Scholarship information"}>
                  <p>{isAr ? programme.scholarshipInfoAr : programme.scholarshipInfoEn}</p>
                </ProgrammeDetailSection>
              ) : null}

              {(isAr ? programme.applicationNotesAr : programme.applicationNotesEn) ? (
                <ProgrammeDetailSection icon={<CheckCircle2 size={19} />} title={isAr ? "ملاحظات التقديم" : "Application notes"}>
                  <p>{isAr ? programme.applicationNotesAr : programme.applicationNotesEn}</p>
                </ProgrammeDetailSection>
              ) : null}
            </article>

            <aside className="programme-profile-side-card">
              <p className="directory-kicker">YAZ EDUCATION</p>
              <h2>{isAr ? "هل هذا البرنامج مناسب لك؟" : "Is this programme right for you?"}</h2>
              <p>{isAr ? "أرسل لنا مؤهلك الحالي وميزانيتك والجنسية وسنساعدك في مراجعة الملاءمة والخطوات التالية." : "Send us your current qualification, budget and nationality and we'll help review fit and next steps."}</p>
              <a href={`https://wa.me/60102282144?text=${whatsappMessage}`} target="_blank" rel="noreferrer">{isAr ? "تحدث مع مستشار YAZ" : "Talk to a YAZ Advisor"}{isAr ? <ArrowLeft size={17} /> : <ArrowRight size={17} />}</a>
              <Link href={`/${locale}/universities/${programme.universitySlug}`}>{isAr ? "عرض صفحة الجامعة" : "View university profile"}</Link>
            </aside>
          </div>
        </div>
      </section>

      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return <article className="programme-fact-card"><span>{icon}</span><p>{label}</p><strong>{value}</strong></article>;
}

function ProgrammeDetailSection({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return <section className="programme-detail-section"><div className="programme-detail-section-title"><span>{icon}</span><h3>{title}</h3></div>{children}</section>;
}
