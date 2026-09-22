import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { LanguageInstituteDirectory } from "@/components/language-institute-directory";
import { JsonLd } from "@/components/json-ld";
import type { Locale } from "@/data/content";
import { breadcrumbJsonLd, buildMetadata, SEO_TEXT } from "@/lib/seo";
import { getLanguageInstitutes } from "@/lib/catalog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const safeLocale = locale as Locale;
  const seo = SEO_TEXT[safeLocale];
  return buildMetadata({ locale: safeLocale, path: "/language-institutes", title: seo.institutesTitle, description: seo.institutesDescription });
}

export default async function LanguageInstitutesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";
  const institutes = await getLanguageInstitutes();

  return (
    <main className="language-directory-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={breadcrumbJsonLd([
        { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
        { name: isAr ? "معاهد اللغة" : "Language Institutes", path: `/${safeLocale}/language-institutes` },
      ])} />
      <section className="directory-hero language-directory-hero">
        <Header locale={safeLocale} />
        <div className="directory-hero-grid" aria-hidden="true" />
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-8 lg:px-12 lg:pb-20 lg:pt-40">
          <p className="directory-kicker">{isAr ? "دليل معاهد اللغة" : "LANGUAGE INSTITUTE DIRECTORY"}</p>
          <h1>{isAr ? "استكشف معاهد اللغة الإنجليزية في ماليزيا" : "Explore English Language Institutes in Malaysia"}</h1>
          <p>{isAr ? "قارن بين المعاهد حسب الموقع ونوع البرنامج، ثم افتح الملف الكامل لكل معهد لمراجعة الدورات والموقع الرسمي ومعلومات التسجيل." : "Compare language institutes by location and programme type, then open each profile for courses, official links and enrolment guidance."}</p>
        </div>
      </section>
      <LanguageInstituteDirectory locale={safeLocale} institutes={institutes} />
      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
