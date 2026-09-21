import { ChevronDown } from "lucide-react";
import type { Locale } from "@/data/content";

const faqs = {
  en: [
    ["How do I start with YAZ Education?", "Start with the free consultation. Tell us your current qualification, the level or field you are interested in, your budget and preferred intake if you already know them."],
    ["Can YAZ help me choose a university?", "Yes. YAZ can help you compare suitable institutions based on the information you provide. Final admission decisions and official requirements remain with each institution."],
    ["Can you help with English language institutes?", "Yes. YAZ can guide students who are considering English-language study in Malaysia and help them explore suitable institute options."],
    ["What documents will I need?", "The exact list depends on the institution, programme and level of study. Typical applications may require academic records, identification documents and other supporting documents. YAZ will help you identify what applies to your case."],
    ["Can YAZ help with accommodation?", "YAZ can help students think through accommodation options based on university location, preferred area and budget. Availability and final booking conditions depend on the accommodation provider."],
    ["Is the consultation free?", "Yes. The initial YAZ study consultation is free."],
    ["When should I apply?", "Application timing depends on the university, programme and intake. It is better to start early so there is enough time to prepare documents and complete the required process."],
  ],
  ar: [
    ["كيف أبدأ مع YAZ Education؟", "ابدأ بالاستشارة المجانية وأخبرنا بمؤهلك الحالي والمرحلة أو التخصص الذي تفكر فيه والميزانية والموعد الدراسي المفضل إن كان معروفاً لديك."],
    ["هل يساعدني YAZ في اختيار الجامعة؟", "نعم. يمكننا مساعدتك في مقارنة المؤسسات المناسبة وفق المعلومات التي تزودنا بها، مع بقاء قرار القبول والمتطلبات الرسمية من اختصاص كل مؤسسة تعليمية."],
    ["هل تساعدون في التسجيل بمعاهد اللغة الإنجليزية؟", "نعم. يمكن لـ YAZ إرشاد الطلاب الراغبين في دراسة اللغة الإنجليزية في ماليزيا ومساعدتهم على استكشاف خيارات المعاهد المناسبة."],
    ["ما المستندات التي سأحتاجها؟", "تختلف القائمة حسب المؤسسة والبرنامج والمرحلة الدراسية. قد تشمل الطلبات السجلات الأكاديمية ووثائق الهوية ومستندات داعمة أخرى، وسنساعدك على تحديد المطلوب لحالتك."],
    ["هل يمكنكم مساعدتي في السكن؟", "يمكن لـ YAZ مساعدتك في استكشاف خيارات السكن بحسب موقع الجامعة والمنطقة والميزانية، بينما يعتمد التوفر وشروط الحجز النهائية على مزود السكن."],
    ["هل الاستشارة مجانية؟", "نعم. الاستشارة الدراسية الأولية مع YAZ مجانية."],
    ["متى يجب أن أقدّم؟", "يعتمد التوقيت على الجامعة والبرنامج والقبول الدراسي. من الأفضل البدء مبكراً لإتاحة وقت كافٍ لتجهيز المستندات واستكمال الإجراءات المطلوبة."],
  ],
} as const;

export function FaqSection({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  return (
    <section className="faq-section" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1120px] px-5 py-20 md:px-8 lg:py-28">
        <div className="faq-head">
          <p className="section-kicker">{isAr ? "الأسئلة الشائعة" : "FREQUENTLY ASKED QUESTIONS"}</p>
          <h2 className="section-title">{isAr ? "قبل أن تبدأ، هذه إجابات أهم الأسئلة" : "Answers to common questions before you begin"}</h2>
        </div>
        <div className="faq-list mt-10">
          {faqs[locale].map(([question, answer], index) => (
            <details key={question} className="faq-item" open={index === 0}>
              <summary>
                <span>{question}</span>
                <ChevronDown size={20} className="faq-chevron" />
              </summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
