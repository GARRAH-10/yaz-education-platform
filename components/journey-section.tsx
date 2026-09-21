import { CheckCircle2, FileText, MessageCircle, Plane, School, Send } from "lucide-react";
import type { Locale } from "@/data/content";

const journey = {
  en: [
    [MessageCircle, "Free consultation", "Tell us what you want to study, your qualification and your priorities."],
    [School, "Choose your option", "Compare suitable universities, colleges or language institutes with clearer context."],
    [FileText, "Prepare documents", "Organise the required documents and check what still needs to be completed."],
    [Send, "Submit the application", "Your application is prepared and submitted through the appropriate process."],
    [CheckCircle2, "Receive your offer", "Review the offer and understand the next required admission steps."],
    [Plane, "Prepare for Malaysia", "Get practical guidance for the transition into your study journey in Malaysia."],
  ],
  ar: [
    [MessageCircle, "استشارة مجانية", "أخبرنا بما تريد دراسته ومؤهلك الحالي وأهم أولوياتك."],
    [School, "اختر الخيار المناسب", "قارن بين الجامعات أو الكليات أو معاهد اللغة المناسبة بصورة أوضح."],
    [FileText, "جهّز المستندات", "رتّب المستندات المطلوبة واعرف ما الذي لا يزال يحتاج إلى استكمال."],
    [Send, "قدّم طلبك", "يتم تجهيز طلبك ومتابعة التقديم عبر المسار المناسب."],
    [CheckCircle2, "استلم القبول", "راجع خطاب القبول وافهم الخطوات التالية المطلوبة لإكمال إجراءاتك."],
    [Plane, "استعد لماليزيا", "احصل على إرشادات عملية تساعدك على بدء رحلتك الدراسية في ماليزيا."],
  ],
} as const;

export function JourneySection({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  return (
    <section className="journey-section" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:py-28">
        <div className="journey-head">
          <div>
            <p className="section-kicker section-kicker-light">{isAr ? "سهلة، لأننا نسهّلها عليك" : "MAKING YOUR JOURNEY SIMPLER"}</p>
            <h2 className="journey-title">{isAr ? "كيف تبدأ مع YAZ؟" : "How your journey with YAZ works"}</h2>
          </div>
          <p>{isAr ? "ست خطوات واضحة تمنح الطالب صورة كاملة عن المسار قبل أن يبدأ." : "Six clear stages so students understand the process before they begin."}</p>
        </div>

        <div className="journey-grid mt-12">
          {journey[locale].map(([Icon, title, text], index) => (
            <article className="journey-step" key={title}>
              <div className="journey-step-top">
                <div className="journey-icon"><Icon size={21} /></div>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
