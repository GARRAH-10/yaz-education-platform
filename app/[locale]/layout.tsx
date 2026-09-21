import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import type { Locale } from "@/data/content";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ar" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const safeLocale = locale as Locale;

  return (
    <div lang={safeLocale === "ar" ? "ar" : "en-MY"} dir={safeLocale === "ar" ? "rtl" : "ltr"}>
      <JsonLd data={[organizationJsonLd(safeLocale), websiteJsonLd(safeLocale)]} />
      {children}
    </div>
  );
}
