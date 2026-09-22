import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Building2, CheckCircle2, Clock3, ExternalLink, GitCompareArrows, GraduationCap, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { getProgrammes } from "@/lib/catalog";
import type { Locale } from "@/data/content";
import type { ProgrammeRecord } from "@/data/programmes";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const safeLocale = locale as Locale;
  const base = buildMetadata({
    locale: safeLocale,
    path: "/programmes/compare",
    title: safeLocale === "ar" ? "مقارنة البرامج الدراسية | YAZ Education" : "Compare Study Programmes | YAZ Education",
    description: safeLocale === "ar"
      ? "قارن بين البرامج الدراسية الموثقة في ماليزيا من حيث الجامعة والموقع والمدة والقبول والمتطلبات."
      : "Compare verified study programmes in Malaysia by university, location, duration, intakes, requirements and official-source details.",
  });
  return { ...base, robots: { index: false, follow: true } };
}

export default async function ProgrammeComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string | string[] }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const query = await searchParams;
  const rawIds = Array.isArray(query.ids) ? query.ids[0] : query.ids ?? "";
  const ids = rawIds.split(",").map((item) => item.trim()).filter(Boolean).slice(0, 3);
  const allProgrammes = await getProgrammes();
  const bySlug = new Map(allProgrammes.map((programme) => [programme.slug, programme]));
  const programmes = ids.map((id) => bySlug.get(id)).filter((item): item is ProgrammeRecord => Boolean(item));

  const advisorMessage = encodeURIComponent(
    `${isAr ? "مرحباً YAZ Education، أحتاج مساعدة في مقارنة هذه البرامج:" : "Hello YAZ Education, I would like help comparing these programmes:"}\n${programmes
      .map((programme, index) => `${index + 1}. ${programme.name} — ${programme.universityName}`)
      .join("\n")}`,
  );

  return (
    <main className="programme-compare-page" dir={isAr ? "rtl" : "ltr"}>
      <section className="programme-compare-hero">
        <Header locale={safeLocale} />
        <div className="mx-auto max-w-[1380px] px-5 pb-12 pt-36 md:px-8 lg:px-12 lg:pb-16 lg:pt-40">
          <Link href={`/${safeLocale}/programmes`} className="programme-back-link">
            <BackIcon size={16} />{isAr ? "العودة إلى البرامج" : "Back to programmes"}
          </Link>
          <div className="programme-compare-hero-copy">
            <p className="directory-kicker">{isAr ? "مقارنة مباشرة" : "SIDE-BY-SIDE COMPARISON"}</p>
            <h1>{isAr ? "قارن البرامج قبل أن تختار" : "Compare Programmes Before You Decide"}</h1>
            <p>{isAr
              ? "قارن المعلومات الموثقة جنباً إلى جنب. لا نصنف برنامجاً كفائز؛ القرار يعتمد على أهدافك ومؤهلاتك وتفضيلاتك."
              : "Compare verified facts side by side. YAZ does not declare a winner; the right choice depends on your goals, qualifications and preferences."}</p>
          </div>
        </div>
      </section>

      <section className="programme-compare-body">
        <div className="mx-auto max-w-[1380px] px-5 py-12 md:px-8 lg:px-12 lg:py-16">
          {programmes.length < 2 ? (
            <div className="programme-compare-empty">
              <GitCompareArrows size={34} />
              <h2>{isAr ? "اختر برنامجين على الأقل للمقارنة" : "Select at least two programmes to compare"}</h2>
              <p>{isAr ? "ارجع إلى دليل البرامج واضغط «أضف للمقارنة» على برنامجين أو ثلاثة." : "Return to the programme directory and use “Add to compare” on two or three programmes."}</p>
              <Link href={`/${safeLocale}/programmes`}>{isAr ? "استكشف البرامج" : "Browse programmes"}</Link>
            </div>
          ) : (
            <>
              <div className="programme-compare-summary">
                <div>
                  <p className="directory-kicker">{isAr ? "اختياراتك" : "YOUR SELECTION"}</p>
                  <h2>{isAr ? `${programmes.length} برامج للمقارنة` : `${programmes.length} programmes compared`}</h2>
                </div>
                <Link href={`/${safeLocale}/programmes`} className="programme-compare-edit-link">
                  {isAr ? "تعديل الاختيارات" : "Change selection"}
                </Link>
              </div>

              <div className="programme-compare-table-wrap">
                <table className="programme-compare-table">
                  <thead>
                    <tr>
                      <th>{isAr ? "المعيار" : "Attribute"}</th>
                      {programmes.map((programme) => (
                        <th key={programme.slug}>
                          <div className="programme-compare-column-head">
                            <div className="programme-compare-logo">
                              <Image src={programme.universityLogo} alt={programme.universityShortName} fill className="object-contain" sizes="80px" />
                            </div>
                            <span>{programme.universityShortName}</span>
                            <strong>{isAr && programme.arabicName ? programme.arabicName : programme.name}</strong>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow icon={<Building2 size={17} />} label={isAr ? "الجامعة" : "University"} programmes={programmes} render={(p) => p.universityName} />
                    <CompareRow icon={<BookOpen size={17} />} label={isAr ? "المجال" : "Field"} programmes={programmes} render={(p) => p.field} />
                    <CompareRow icon={<GraduationCap size={17} />} label={isAr ? "المرحلة" : "Study level"} programmes={programmes} render={(p) => p.level} />
                    <CompareRow icon={<MapPin size={17} />} label={isAr ? "الموقع / الحرم" : "Location / campus"} programmes={programmes} render={(p) => p.campus ?? p.city} />
                    <CompareRow icon={<Clock3 size={17} />} label={isAr ? "المدة" : "Duration"} programmes={programmes} render={(p) => p.duration ?? fallback(isAr)} />
                    <CompareRow icon={<BookOpen size={17} />} label={isAr ? "نمط الدراسة" : "Study mode"} programmes={programmes} render={(p) => p.studyMode ?? fallback(isAr)} />
                    <CompareRow icon={<CheckCircle2 size={17} />} label={isAr ? "مواعيد القبول" : "Intakes"} programmes={programmes} render={(p) => p.intakes?.join(", ") ?? fallback(isAr)} />
                    <CompareRow long icon={<GraduationCap size={17} />} label={isAr ? "المتطلبات الأكاديمية" : "Academic requirements"} programmes={programmes} render={(p) => (isAr ? p.academicRequirementsAr : p.academicRequirementsEn) ?? fallback(isAr)} />
                    <CompareRow long icon={<BookOpen size={17} />} label={isAr ? "متطلبات الإنجليزية" : "English requirements"} programmes={programmes} render={(p) => (isAr ? p.englishRequirementsAr : p.englishRequirementsEn) ?? fallback(isAr)} />
                    <CompareRow long icon={<ShieldCheck size={17} />} label={isAr ? "الاعتماد / الاعتراف" : "Accreditation / recognition"} programmes={programmes} render={(p) => p.accreditation ?? fallback(isAr)} />
                    <CompareRow icon={<MessageCircle size={17} />} label={isAr ? "الرسوم الدراسية" : "Tuition fee"} programmes={programmes} render={() => isAr ? "تواصل مع مستشار YAZ لأحدث الرسوم" : "Contact a YAZ advisor for the latest fee"} />
                    <CompareRow icon={<CheckCircle2 size={17} />} label={isAr ? "آخر تحقق" : "Last verified"} programmes={programmes} render={(p) => p.verifiedAt} />
                    <tr>
                      <th><span className="programme-compare-row-label"><ExternalLink size={17} />{isAr ? "المصدر الرسمي" : "Official source"}</span></th>
                      {programmes.map((programme) => (
                        <td key={programme.slug}>
                          <a className="programme-compare-source" href={programme.sourceUrl} target="_blank" rel="noreferrer">
                            {isAr ? "فتح المصدر" : "Open source"}<ExternalLink size={14} />
                          </a>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <th><span className="programme-compare-row-label"><BookOpen size={17} />{isAr ? "صفحة البرنامج" : "Programme page"}</span></th>
                      {programmes.map((programme) => (
                        <td key={programme.slug}>
                          <Link className="programme-compare-profile-link" href={`/${safeLocale}/programmes/${programme.slug}`}>
                            {isAr ? "عرض التفاصيل" : "View details"}
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="programme-compare-advisor-card">
                <div>
                  <p className="directory-kicker">YAZ EDUCATION</p>
                  <h2>{isAr ? "تحتاج مساعدة في الاختيار؟" : "Need help choosing?"}</h2>
                  <p>{isAr
                    ? "أرسل لنا البرامج التي تقارن بينها مع مؤهلك وميزانيتك وتفضيلاتك، وسيساعدك المستشار في مراجعة الفروق والخطوات التالية."
                    : "Send us the programmes you are comparing together with your qualification, budget and preferences. A YAZ advisor can help you review the differences and next steps."}</p>
                </div>
                <a href={`https://wa.me/60102282144?text=${advisorMessage}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />{isAr ? "اسأل مستشار YAZ" : "Ask a YAZ Advisor"}
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}

function fallback(isAr: boolean) {
  return isAr ? "غير موثق بعد" : "Not yet verified";
}

function CompareRow({
  icon,
  label,
  programmes,
  render,
  long = false,
}: {
  icon: ReactNode;
  label: string;
  programmes: ProgrammeRecord[];
  render: (programme: ProgrammeRecord) => string;
  long?: boolean;
}) {
  return (
    <tr>
      <th><span className="programme-compare-row-label">{icon}{label}</span></th>
      {programmes.map((programme) => (
        <td key={programme.slug} className={long ? "programme-compare-long-value" : undefined}>{render(programme)}</td>
      ))}
    </tr>
  );
}
