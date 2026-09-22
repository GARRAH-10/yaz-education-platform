import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { UniversityStrip } from "@/components/university-strip";
import { ProgrammeFinder } from "@/components/programme-finder";
import { ServicesSection } from "@/components/services-section";
import { JourneySection } from "@/components/journey-section";
import { WhyYazSection } from "@/components/why-yaz-section";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { WhatsAppContact } from "@/components/whatsapp-contact";
import type { Locale } from "@/data/content";
import { buildMetadata, SEO_TEXT } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") return {};
  const safeLocale = locale as Locale;
  const seo = SEO_TEXT[safeLocale];
  return buildMetadata({ locale: safeLocale, title: seo.homeTitle, description: seo.homeDescription });
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;

  return (
    <main lang={safeLocale === "ar" ? "ar" : "en-MY"}>
      <Header locale={safeLocale} />
      <Hero locale={safeLocale} />
      <ProgrammeFinder locale={safeLocale} />
      <UniversityStrip locale={safeLocale} />
      <ServicesSection locale={safeLocale} />
      <JourneySection locale={safeLocale} />
      <WhyYazSection locale={safeLocale} />
      <FaqSection locale={safeLocale} />
      <ContactSection locale={safeLocale} />
      <Footer locale={safeLocale} />
      <WhatsAppContact locale={safeLocale} />
    </main>
  );
}
