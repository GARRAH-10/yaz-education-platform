import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { UniversityDirectory } from "@/components/university-directory";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import { JsonLd } from "@/components/json-ld";
import type { Locale } from "@/data/content";
import { breadcrumbJsonLd, buildMetadata, SEO_TEXT } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const safeLocale = locale as Locale;
  const seo = SEO_TEXT[safeLocale];
  return buildMetadata({ locale: safeLocale, path: "/universities", title: seo.universitiesTitle, description: seo.universitiesDescription });
}

export default async function UniversitiesDirectoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";

  return (
    <main className="universities-directory-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={breadcrumbJsonLd([
        { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
        { name: isAr ? "الجامعات" : "Universities", path: `/${safeLocale}/universities` },
      ])} />
      <section className="directory-hero">
        <Header locale={safeLocale} />
        <div className="directory-hero-grid" aria-hidden="true" />
        <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-36 md:px-8 lg:px-12 lg:pb-20 lg:pt-40">
          <p className="directory-kicker">{isAr ? "دليل الجامعات" : "UNIVERSITY DIRECTORY"}</p>
          <h1>{isAr ? "استكشف الجامعات في ماليزيا" : "Explore Universities in Malaysia"}</h1>
          <p>{isAr ? "ابحث وقارن بين المؤسسات التي نعرضها في YAZ حسب النوع والموقع ومجال الدراسة، ثم افتح الملف الكامل لكل جامعة." : "Search and compare institutions by type, location and study area, then open each university profile for verified details and official sources."}</p>
          <div className="mt-6"><a className="directory-programme-link" href={`/${locale}/programmes`}>{isAr ? "ابحث حسب التخصص أو البرنامج" : "Search by field or programme"}</a></div>
        </div>
      </section>
      <UniversityDirectory locale={safeLocale} />
      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
