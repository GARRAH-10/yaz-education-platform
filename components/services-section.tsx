import {
  Building2,
  FileCheck2,
  GraduationCap,
  Home,
  Languages,
  LifeBuoy,
  ArrowUpRight,
} from "lucide-react";
import type { Locale } from "@/data/content";

const services = {
  en: [
    {
      icon: GraduationCap,
      title: "University Admission",
      text: "Support with choosing suitable universities, preparing the application and following the admission process.",
    },
    {
      icon: Languages,
      title: "English Language Institutes",
      text: "Guidance on English-language study options and registration with suitable language centres in Malaysia.",
    },
    {
      icon: FileCheck2,
      title: "Application Support",
      text: "Document checks, application preparation and clear guidance on the next step in your admission journey.",
    },
    {
      icon: Home,
      title: "Accommodation Support",
      text: "Help exploring suitable accommodation options based on your institution, area and student needs.",
    },
    {
      icon: LifeBuoy,
      title: "Student Support",
      text: "Practical guidance for settling into student life in Malaysia, from arrival to everyday essentials.",
    },
    {
      icon: Building2,
      title: "Document Services",
      text: "Support with document-related procedures and verification steps where the service is available.",
    },
  ],
  ar: [
    {
      icon: GraduationCap,
      title: "القبول الجامعي",
      text: "نساعدك في اختيار الجامعة المناسبة وتجهيز طلبك ومتابعة خطوات القبول بشكل واضح.",
    },
    {
      icon: Languages,
      title: "معاهد اللغة الإنجليزية",
      text: "إرشادك إلى خيارات دراسة اللغة الإنجليزية والتسجيل في معاهد مناسبة داخل ماليزيا.",
    },
    {
      icon: FileCheck2,
      title: "دعم التقديم",
      text: "مراجعة المستندات وتجهيز الطلب ومساعدتك على فهم الخطوة التالية في رحلة القبول.",
    },
    {
      icon: Home,
      title: "دعم السكن",
      text: "مساعدتك في استكشاف خيارات السكن المناسبة بحسب الجامعة والمنطقة واحتياجات الطالب.",
    },
    {
      icon: LifeBuoy,
      title: "دعم الطالب",
      text: "إرشادات عملية تساعدك على الاستقرار في الحياة الطلابية في ماليزيا من الوصول وما بعده.",
    },
    {
      icon: Building2,
      title: "خدمات الوثائق",
      text: "المساعدة في الإجراءات المتعلقة بالمستندات والتصديقات عندما تكون هذه الخدمة متاحة.",
    },
  ],
} as const;

export function ServicesSection({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const items = services[locale];

  return (
    <section id="services" className="services-section" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:py-28">
        <div className="services-heading-grid">
          <div>
            <p className="section-kicker">{isAr ? "خدمات YAZ EDUCATION" : "YAZ EDUCATION SERVICES"}</p>
            <h2 className="section-title">
              {isAr ? "دعم واضح في كل خطوة من رحلتك" : "Support for every step of your study journey"}
            </h2>
          </div>
          <p className="section-lead">
            {isAr
              ? "بدلاً من أن تتعامل مع كل خطوة بمفردك، نرتب لك المسار من اختيار المؤسسة المناسبة وحتى الاستعداد للحياة الدراسية في ماليزيا."
              : "Instead of navigating every step alone, YAZ helps structure the journey from choosing the right institution to preparing for student life in Malaysia."}
          </p>
        </div>

        <div className="services-grid mt-12">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="service-card group">
                <div className="service-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="service-icon"><Icon size={23} strokeWidth={1.8} /></div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <a href={`/${locale}#consultation`} className="service-link">
                  {isAr ? "تحدث مع مستشار" : "Talk to an advisor"}
                  <ArrowUpRight size={16} className={isAr ? "-scale-x-100" : ""} />
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
