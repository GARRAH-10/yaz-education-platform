import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { ProgrammeDirectory } from "@/components/programme-directory";
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
  return buildMetadata({ locale: safeLocale, path: "/programmes", title: seo.programmesTitle, description: seo.programmesDescription });
}

export default async function ProgrammesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;
  const isAr = safeLocale === "ar";

  return (
    <main className="programme-directory-page" dir={isAr ? "rtl" : "ltr"}>
      <JsonLd data={breadcrumbJsonLd([
        { name: isAr ? "الرئيسية" : "Home", path: `/${safeLocale}` },
        { name: isAr ? "البرامج الدراسية" : "Programmes", path: `/${safeLocale}/programmes` },
      ])} />
      <section className="programme-directory-header"><Header locale={safeLocale} /></section>
      <ProgrammeDirectory locale={safeLocale} />
      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
