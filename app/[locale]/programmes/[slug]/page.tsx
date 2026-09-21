import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Building2, CalendarDays, CheckCircle2, Clock3, ExternalLink, GraduationCap, MapPin, WalletCards } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { JsonLd } from "@/components/json-ld";
import { PROGRAMME_BY_SLUG, PROGRAMMES } from "@/data/programmes";
import { UNIVERSITY_UI } from "@/data/university-ui";
import type { Locale } from "@/data/content";
import { absoluteUrl, breadcrumbJsonLd, buildMetadata } from "@/lib/seo";


export function generateStaticParams() {
  return (["en", "ar"] as const).flatMap((locale) => PROGRAMMES.map((programme) => ({ locale, slug: programme.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const programme = PROGRAMME_BY_SLUG[slug];
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
  const programme = PROGRAMME_BY_SLUG[slug];
  if (!programme) notFound();

  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;

  const whatsappMessage = encodeURIComponent(`${isAr ? "مرحباً YAZ Education، أريد الاستفسار عن البرنامج:" : "Hello YAZ Education, I would like to ask about this programme:"}\n${programme.name}\n${programme.universityName}`);

  const profilePath = `/${safeLocale}/programmes/${programme.slug}`;
  const universityUi = (UNIVERSITY_UI as Record<string, any>)[programme.universitySlug];
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
              <h1>{programme.name}</h1>
              <div className="programme-profile-tags">
                <span><GraduationCap size={16} />{programme.level}</span>
                <span><BookOpen size={16} />{programme.field}</span>
                <span><MapPin size={16} />{programme.campus ?? programme.city}</span>
              </div>
              <div className="programme-profile-actions">
                <a className="primary-btn" href={`https://wa.me/60102282144?text=${whatsappMessage}`} target="_blank" rel="noreferrer">{isAr ? "استشر YAZ عن هذا البرنامج" : "Ask YAZ About This Programme"}</a>
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
            <Fact icon={<WalletCards size={20} />} label={isAr ? "الرسوم الدولية" : "International fee"} value={programme.internationalFee ?? (isAr ? "غير موثق بعد" : "Not yet verified")} />
            <Fact icon={<CheckCircle2 size={20} />} label={isAr ? "آخر تحقق" : "Last verified"} value={programme.verifiedAt} />
          </div>

          <div className="programme-profile-content-grid">
            <article className="programme-profile-main-card">
              <p className="directory-kicker">{isAr ? "تفاصيل البرنامج" : "PROGRAMME DETAILS"}</p>
              <h2>{isAr ? "ما الذي تم التحقق منه؟" : "What has been verified?"}</h2>
              <p>{isAr ? "تعرض هذه الصفحة فقط المعلومات التي تم التحقق منها من المصدر الرسمي للجامعة. أي متطلبات أو رسوم أو مواعيد غير موجودة هنا يجب تأكيدها قبل التقديم." : "This page only displays information verified from the university's official source. Any requirements, fees or dates not shown here should be reconfirmed before application."}</p>

              {programme.specialisations?.length ? (
                <div className="programme-profile-specialisations">
                  <h3>{isAr ? "التخصصات / المسارات" : "Specialisations / pathways"}</h3>
                  <div>{programme.specialisations.map((item) => <span key={item}>{item}</span>)}</div>
                </div>
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
