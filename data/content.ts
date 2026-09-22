export type Locale = "en" | "ar";

export const content = {
  en: {
    dir: "ltr",
    nav: {
      home: "Home",
      universities: "Universities",
      programs: "Programmes",
      services: "Services",
      malaysia: "Study in Malaysia",
      about: "About",
      contact: "Contact",
      consult: "Get Free Consultation",
      language: "العربية"
    },
    hero: {
      eyebrow: "YOUR FUTURE. OUR SUPPORT.",
      line1: "Your Journey to",
      highlight: "Study in Malaysia",
      line3: "Starts Here.",
      description: "University admissions, English language institutes and student support — all in one place.",
      primary: "Get Free Consultation",
      secondary: "Explore Universities",
      assisted: "Personal Student Support",
      assistedSub: "Guidance from application to arrival",
      location: "Kuala Lumpur, Malaysia",
      locationSub: "Your Study Destination"
    },
    ai: {
      name: "YAZ AI",
      subtitle: "Your Study Advisor",
      hello: "Hi 👋 I’m YAZ AI, your study advisor. Ask me naturally about universities, programmes, admissions, study fields, careers, student life in Malaysia, or general study questions. I can check verified YAZ data when needed.",
      prompt: "Type your question...",
      open: "Ask YAZ AI",
      human: "Talk to a human advisor",
      quick: [
        ["Find a university", "Tell me your preferred field, study level and budget, and I can help narrow down suitable university options."],
        ["Find a program", "Tell me what you want to study and your current qualification, and I can help structure your program search."],
        ["Tuition & budget", "Share your approximate budget and study level. I can help narrow suitable options, while a YAZ advisor confirms the latest official tuition fee."],
        ["Entry requirements", "Tell me your qualification, grades and intended program so I can explain the typical requirements to check."],
        ["Intakes", "Tell me the university or program you are considering and I can help you plan which intake information to verify."],
        ["Accommodation", "Tell me your university or preferred area and budget, and I can help you think through accommodation options."]
      ],
      fallback: "Thanks — this prototype demonstrates the YAZ AI experience. The next development step is connecting it to verified university/program data and a real AI backend."
    },
    logosTitle: "Universities we can help you explore",
    moreTitle: "More Than a Degree",
    moreText: "A complete study journey — from choosing the right path to settling into student life in Malaysia."
  },
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      universities: "الجامعات",
      programs: "التخصصات",
      services: "خدماتنا",
      malaysia: "الدراسة في ماليزيا",
      about: "من نحن",
      contact: "تواصل معنا",
      consult: "استشارة مجانية",
      language: "English"
    },
    hero: {
      eyebrow: "مستقبلك. دعمنا.",
      line1: "ابدأ رحلتك",
      highlight: "للدراسة في ماليزيا",
      line3: "مع YAZ.",
      description: "القبول الجامعي، معاهد اللغة الإنجليزية، ودعم الطالب في ماليزيا — كل ما تحتاجه في مكان واحد.",
      primary: "احصل على استشارة مجانية",
      secondary: "استكشف الجامعات",
      assisted: "دعم شخصي للطلاب",
      assistedSub: "إرشاد من التقديم حتى بداية الدراسة",
      location: "كوالالمبور، ماليزيا",
      locationSub: "وجهتك الدراسية"
    },
    ai: {
      name: "YAZ AI",
      subtitle: "مستشارك الدراسي",
      hello: "مرحباً 👋 أنا YAZ AI، مستشارك الدراسي. اسألني بشكل طبيعي عن الجامعات والتخصصات والقبول والمجالات الدراسية والمسارات المهنية والحياة الطلابية في ماليزيا. أتحقق من بيانات YAZ الموثقة عند الحاجة.",
      prompt: "اكتب سؤالك...",
      open: "اسأل YAZ AI",
      human: "تحدث مع مستشار",
      quick: [
        ["ابحث عن جامعة", "أخبرني بالتخصص والمرحلة الدراسية والميزانية لأساعدك في تضييق خيارات الجامعات المناسبة."],
        ["ابحث عن تخصص", "أخبرني بما تريد دراسته ومؤهلك الحالي لنرتب خيارات البرامج المناسبة."],
        ["الرسوم والميزانية", "أرسل ميزانيتك السنوية التقريبية بالرينجت والمرحلة الدراسية لنرتب الخيارات المناسبة."],
        ["متطلبات القبول", "أخبرني بمؤهلك ودرجاتك والتخصص المطلوب لأوضح لك المتطلبات التي ينبغي التحقق منها."],
        ["مواعيد القبول", "أخبرني بالجامعة أو التخصص وسأساعدك في تنظيم معلومات مواعيد القبول التي تحتاج للتحقق منها."],
        ["السكن", "أخبرني بالجامعة أو المنطقة والميزانية لأساعدك في التفكير بخيارات السكن المناسبة."]
      ],
      fallback: "شكراً. هذه النسخة تعرض تجربة YAZ AI مبدئياً. الخطوة التالية هي ربطها ببيانات الجامعات والتخصصات الموثقة وبخدمة ذكاء اصطناعي فعلية."
    },
    logosTitle: "جامعات يمكننا مساعدتك في استكشافها",
    moreTitle: "أكثر من مجرد شهادة",
    moreText: "رحلة دراسية متكاملة — من اختيار المسار المناسب حتى الاستقرار في الحياة الطلابية في ماليزيا."
  }
} as const;
