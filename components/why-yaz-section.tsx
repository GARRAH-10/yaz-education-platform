import { Languages, MapPin, MessageCircle, Route, School, ShieldCheck } from "lucide-react";
import type { Locale } from "@/data/content";

const reasons = {
  en: [
    [MapPin, "Local support in Malaysia", "YAZ is based in Kuala Lumpur, so students can get guidance from people who understand the local study environment."],
    [Languages, "Arabic & English support", "Communicate in the language that is most comfortable for you while navigating Malaysian institutions and application steps."],
    [School, "University & language guidance", "Explore universities, colleges and English-language institutes with a clearer understanding of your options."],
    [Route, "Support from application to arrival", "Get help organising the journey from choosing an institution and preparing documents to getting ready for Malaysia."],
    [MessageCircle, "Direct advisor access", "Move from website research to a real conversation quickly through WhatsApp when you need personal guidance."],
    [ShieldCheck, "Free initial consultation", "Start by explaining your study goals and current qualification before deciding on the next step."],
  ],
  ar: [
    [MapPin, "دعم محلي في ماليزيا", "يتواجد YAZ في كوالالمبور، لتتلقى إرشاداً من فريق يفهم بيئة الدراسة والحياة الطلابية في ماليزيا."],
    [Languages, "دعم بالعربية والإنجليزية", "تواصل باللغة الأنسب لك أثناء فهم خيارات الجامعات وإجراءات التقديم في ماليزيا."],
    [School, "إرشاد للجامعات ومعاهد اللغة", "استكشف الجامعات والكليات ومعاهد اللغة الإنجليزية بصورة أوضح قبل اتخاذ قرارك."],
    [Route, "من التقديم حتى الوصول", "نساعدك على ترتيب الرحلة من اختيار المؤسسة وتجهيز المستندات حتى الاستعداد للدراسة في ماليزيا."],
    [MessageCircle, "وصول مباشر إلى مستشار", "انتقل من البحث في الموقع إلى محادثة حقيقية عبر واتساب عندما تحتاج إلى توجيه شخصي."],
    [ShieldCheck, "استشارة أولية مجانية", "ابدأ بشرح هدفك الدراسي ومؤهلك الحالي قبل تحديد الخطوة المناسبة التالية."],
  ],
} as const;

export function WhyYazSection({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  return (
    <section id="about" className="why-yaz-section" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:py-28">
        <div className="why-yaz-head">
          <div>
            <p className="section-kicker">{isAr ? "لماذا YAZ EDUCATION؟" : "WHY YAZ EDUCATION?"}</p>
            <h2 className="section-title">{isAr ? "دعم أوضح لقرار دراسي مهم" : "Clearer support for an important study decision"}</h2>
          </div>
          <div className="why-yaz-intro">
            <p>{isAr ? "هدفنا ليس فقط إرسال طلب قبول، بل مساعدتك على فهم خياراتك وما الذي سيحدث بعد ذلك." : "The goal is not simply to submit an application. It is to help you understand your options and what happens next."}</p>
            <strong>{isAr ? "سهلة، لأننا نسهّلها عليك." : "Making your study journey simpler."}</strong>
          </div>
        </div>

        <div className="why-yaz-grid mt-12">
          {reasons[locale].map(([Icon, title, text]) => (
            <article key={title} className="why-yaz-card">
              <div className="why-yaz-icon"><Icon size={22} strokeWidth={1.9} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
