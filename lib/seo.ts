import type { Metadata } from "next";
import type { Locale } from "@/data/content";

export const SITE_NAME = "YAZ Education";
export const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

export function localizedPath(locale: Locale, path = "") {
  const normalized = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  return `/${locale}${normalized}`;
}

export const SEO_TEXT = {
  en: {
    homeTitle: "Study in Malaysia | University & Language Institute Guidance",
    homeDescription:
      "Explore universities, programmes and English language institutes in Malaysia with YAZ Education. Get bilingual guidance, verified official sources and a free consultation.",
    universitiesTitle: "Universities in Malaysia | Compare Study Options",
    universitiesDescription:
      "Explore Malaysian universities by location, institution type and study area. Review YAZ profiles, official websites and verified study information before you apply.",
    programmesTitle: "Study Programmes in Malaysia | Search by Field & University",
    programmesDescription:
      "Search verified study programmes in Malaysia by study level, field, university and location, then review official sources and request guidance from YAZ Education.",
    institutesTitle: "English Language Institutes in Malaysia | Compare Courses",
    institutesDescription:
      "Compare English language institutes in Malaysia, including course types, locations, student support and official sources. Get free guidance from YAZ Education.",
  },
  ar: {
    homeTitle: "الدراسة في ماليزيا | الجامعات ومعاهد اللغة",
    homeDescription:
      "استكشف الجامعات والتخصصات ومعاهد اللغة الإنجليزية في ماليزيا مع YAZ Education، مع معلومات موثقة من المصادر الرسمية واستشارة مجانية بالعربية والإنجليزية.",
    universitiesTitle: "الجامعات في ماليزيا | دليل الجامعات للطلاب الدوليين",
    universitiesDescription:
      "قارن بين الجامعات في ماليزيا حسب الموقع والنوع ومجال الدراسة، وراجع ملفات الجامعات والمواقع الرسمية والمعلومات الموثقة قبل التقديم.",
    programmesTitle: "التخصصات والبرامج الدراسية في ماليزيا | بحث ومقارنة",
    programmesDescription:
      "ابحث عن البرامج الدراسية في ماليزيا حسب المرحلة والتخصص والجامعة والموقع، وراجع المصادر الرسمية واطلب إرشاد YAZ Education قبل التقديم.",
    institutesTitle: "معاهد اللغة الإنجليزية في ماليزيا | مقارنة المعاهد والدورات",
    institutesDescription:
      "قارن بين معاهد اللغة الإنجليزية في ماليزيا من حيث الموقع ونوع البرنامج ودعم الطلاب والمصادر الرسمية، واحصل على استشارة مجانية من YAZ Education.",
  },
} as const;

export function buildMetadata(args: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
}): Metadata {
  const { locale, path = "", title, description, image = "/seo-og.png", type = "website" } = args;
  const canonicalPath = localizedPath(locale, path);
  const enPath = localizedPath("en", path);
  const arPath = localizedPath("ar", path);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-MY": enPath,
        "ar": arPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      type,
      locale: locale === "ar" ? "ar_AR" : "en_MY",
      alternateLocale: locale === "ar" ? ["en_MY"] : ["ar_AR"],
      url: canonicalPath,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} - Study in Malaysia`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function organizationJsonLd(locale: Locale) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: SITE_NAME,
    url,
    logo: absoluteUrl("/yaz-logo.png"),
    email: "yazan.connect@gmail.com",
    telephone: "+60102282144",
    areaServed: {
      "@type": "Country",
      name: "Malaysia",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kuala Lumpur",
      addressCountry: "MY",
    },
    sameAs: ["https://www.instagram.com/yaz.education/"],
    description:
      locale === "ar"
        ? "YAZ Education يساعد الطلاب الدوليين على استكشاف خيارات الدراسة في ماليزيا والحصول على إرشاد حول الجامعات ومعاهد اللغة والتقديم."
        : "YAZ Education helps international students explore study options in Malaysia and get guidance on universities, language institutes and applications.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+60102282144",
      contactType: "student consultation",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function websiteJsonLd(locale: Locale) {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: SITE_NAME,
    publisher: { "@id": `${url}/#organization` },
    inLanguage: locale === "ar" ? "ar" : "en-MY",
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
