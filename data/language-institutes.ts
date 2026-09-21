export type BilingualItem = { en: string; ar: string };
export type BilingualDetail = { titleEn: string; titleAr: string; bodyEn: string; bodyAr: string };
export type BilingualFaq = { qEn: string; qAr: string; aEn: string; aAr: string };

export type LanguageInstitute = {
  slug: string;
  name: string;
  shortName: string;
  arabicName: string;
  city: string;
  locations: string[];
  typeEn: string;
  typeAr: string;
  summaryEn: string;
  summaryAr: string;
  coursesEn: string[];
  coursesAr: string[];
  focus: Array<"general" | "academic" | "ielts" | "business" | "junior" | "online">;
  officialUrl: string;
  logo?: string;
  sourceUrls: string[];
  quickFacts: BilingualDetail[];
  assessment: BilingualDetail[];
  whyChoose: BilingualDetail[];
  application: BilingualDetail[];
  accommodationEn: string;
  accommodationAr: string;
  supportEn: string;
  supportAr: string;
  faq: BilingualFaq[];
};

export const LANGUAGE_INSTITUTES: LanguageInstitute[] = [
  {
    slug: "bright",
    name: "Bright Language Center",
    shortName: "Bright",
    arabicName: "معهد برايت للغة الإنجليزية",
    city: "Kuala Lumpur",
    locations: ["Kuala Lumpur"],
    typeEn: "English language centre",
    typeAr: "مركز لغة إنجليزية",
    summaryEn:
      "Bright Language Center is an English-language centre in central Kuala Lumpur offering intensive English, IELTS preparation, private classes, online learning and seasonal programmes. Its official site highlights small class sizes, modern classrooms, multilingual support and accommodation assistance.",
    summaryAr:
      "معهد برايت هو مركز لتعليم اللغة الإنجليزية في وسط كوالالمبور، ويقدم الإنجليزية المكثفة والتحضير لاختبار IELTS والدروس الخاصة والتعلم عبر الإنترنت والبرامج الموسمية. ويبرز موقعه الرسمي صغر أحجام الفصول، والفصول الحديثة، والدعم متعدد اللغات، والمساعدة في السكن.",
    coursesEn: ["Intensive General English", "IELTS Preparation", "Private Classes", "Online English", "Summer Camp"],
    coursesAr: ["الإنجليزية العامة المكثفة", "التحضير لـ IELTS", "الدروس الخاصة", "الإنجليزية عبر الإنترنت", "المعسكر الصيفي"],
    focus: ["general", "ielts", "online", "junior"],
    officialUrl: "https://bright.edu.my/",
    logo: "/universities/bright.png",
    sourceUrls: [
      "https://bright.edu.my/",
      "https://bright.edu.my/en/our-school",
      "https://bright.edu.my/en/intensive-general-english",
      "https://bright.edu.my/en/ielts-preparation",
      "https://bright.edu.my/en/summer-camp"
    ],
    quickFacts: [
      { titleEn: "Location", titleAr: "الموقع", bodyEn: "Golden Triangle, central Kuala Lumpur", bodyAr: "منطقة المثلث الذهبي في وسط كوالالمبور" },
      { titleEn: "Levels", titleAr: "المستويات", bodyEn: "Beginner to advanced", bodyAr: "من المبتدئ إلى المتقدم" },
      { titleEn: "Class size", titleAr: "حجم الفصل", bodyEn: "Average about 10 students; stated maximum 10–18", bodyAr: "متوسط يقارب 10 طلاب، والحد الأقصى المعلن 10–18" },
      { titleEn: "Student support", titleAr: "دعم الطلاب", bodyEn: "Multilingual support and 24/7 support-team information on the official site", bodyAr: "دعم متعدد اللغات ومعلومات عن فريق دعم متاح على مدار الساعة في الموقع الرسمي" }
    ],
    assessment: [
      { titleEn: "Placement test", titleAr: "اختبار تحديد المستوى", bodyEn: "Students take a placement test at the start so Bright can place them in a class matching their English level.", bodyAr: "يخضع الطالب لاختبار تحديد مستوى في البداية لوضعه في الفصل المناسب لمستواه في اللغة الإنجليزية." },
      { titleEn: "Weekly assessment", titleAr: "تقييم أسبوعي", bodyEn: "Bright states that weekly assessment tests are used to monitor progress during the course.", bodyAr: "يذكر برايت أن اختبارات تقييم أسبوعية تُستخدم لمتابعة تقدم الطالب أثناء الدورة." },
      { titleEn: "Tutorial support", titleAr: "دعم تعليمي فردي", bodyEn: "Teachers can provide supplementary materials and regular one-to-one tutorial discussions about progress and next steps.", bodyAr: "يمكن للمدرسين تقديم مواد إضافية ومناقشات فردية منتظمة حول تقدم الطالب والخطوات التالية." }
    ],
    whyChoose: [
      { titleEn: "Strategic KL location", titleAr: "موقع استراتيجي في كوالالمبور", bodyEn: "The centre is located near KLCC with access to transport, shopping and city amenities.", bodyAr: "يقع المركز بالقرب من KLCC مع سهولة الوصول إلى المواصلات والتسوق والخدمات في وسط المدينة." },
      { titleEn: "Small classes", titleAr: "فصول صغيرة", bodyEn: "Bright promotes small class sizes to support interaction and individual attention.", bodyAr: "يركز برايت على الفصول الصغيرة لدعم التفاعل والاهتمام الفردي." },
      { titleEn: "Modern facilities", titleAr: "مرافق حديثة", bodyEn: "The official site lists smart classrooms, Wi‑Fi, library/study areas and student spaces.", bodyAr: "يذكر الموقع الرسمي فصولاً ذكية وواي فاي ومكتبة ومناطق للدراسة ومساحات للطلاب." },
      { titleEn: "International environment", titleAr: "بيئة دولية", bodyEn: "Bright highlights a mix of nationalities and regular social activities that encourage English use outside class.", bodyAr: "يبرز برايت تنوع الجنسيات والأنشطة الاجتماعية المنتظمة التي تشجع استخدام الإنجليزية خارج الفصل." },
      { titleEn: "Accommodation assistance", titleAr: "مساعدة في السكن", bodyEn: "Bright states that it offers accommodation options selected and monitored for students.", bodyAr: "يذكر برايت أنه يوفر خيارات سكن مختارة ومتابعة للطلاب." },
      { titleEn: "IELTS pathway support", titleAr: "دعم للتحضير لـ IELTS", bodyEn: "IELTS preparation is one of Bright’s core programmes alongside general English.", bodyAr: "التحضير لاختبار IELTS أحد البرامج الأساسية في برايت إلى جانب الإنجليزية العامة." }
    ],
    application: [
      { titleEn: "Choose a programme", titleAr: "اختر البرنامج", bodyEn: "Select the English course that best matches your goal and study duration.", bodyAr: "اختر دورة اللغة الإنجليزية التي تتناسب مع هدفك ومدة الدراسة المطلوبة." },
      { titleEn: "Confirm intake and fees", titleAr: "أكد الموعد والرسوم", bodyEn: "Bright publishes fees/calendar information separately; YAZ can help verify the current intake and fee before payment.", bodyAr: "ينشر برايت معلومات الرسوم والتقويم بشكل منفصل، ويمكن لـ YAZ مساعدتك في التأكد من الموعد والرسوم الحالية قبل الدفع." },
      { titleEn: "Placement and enrolment", titleAr: "تحديد المستوى والتسجيل", bodyEn: "Your English level is checked at the start so the institute can place you in the appropriate class.", bodyAr: "يتم فحص مستواك في اللغة الإنجليزية عند البداية حتى يتم وضعك في الفصل المناسب." }
    ],
    accommodationEn: "Bright states that it offers a variety of accommodation options and that selected residences are within walking distance of the school. Availability and exact prices should be reconfirmed for the intended intake.",
    accommodationAr: "يذكر برايت أنه يوفر عدة خيارات للسكن وأن بعض أماكن الإقامة المختارة تقع على مسافة مشي من المعهد. يجب التأكد من التوفر والأسعار الحالية قبل التسجيل.",
    supportEn: "Bright promotes multilingual support, modern student facilities and regular social activities. For immigration, visa and medical requirements, YAZ should verify the current rules for the student's nationality and study duration before application.",
    supportAr: "يركز برايت على الدعم متعدد اللغات والمرافق الحديثة والأنشطة الاجتماعية المنتظمة. وبالنسبة لمتطلبات التأشيرة والهجرة والفحص الطبي، يجب على YAZ التحقق من القواعد الحالية حسب جنسية الطالب ومدة الدراسة قبل التقديم.",
    faq: [
      { qEn: "When can I start?", qAr: "متى يمكنني البدء؟", aEn: "Bright advertises year-round English study. Exact start dates depend on the programme, so confirm the current calendar before enrolling.", aAr: "يعلن برايت عن الدراسة على مدار العام. تختلف مواعيد البدء حسب البرنامج، لذلك يجب التأكد من التقويم الحالي قبل التسجيل." },
      { qEn: "How is my English level decided?", qAr: "كيف يتم تحديد مستواي؟", aEn: "A placement test is used at the start to place students at an appropriate level.", aAr: "يستخدم اختبار تحديد مستوى في البداية لوضع الطالب في المستوى المناسب." },
      { qEn: "Does Bright provide accommodation?", qAr: "هل يوفر برايت السكن؟", aEn: "Bright states that it offers accommodation assistance and selected residences. Availability should be checked for your dates.", aAr: "يذكر برايت أنه يوفر مساعدة في السكن وخيارات إقامة مختارة، ويجب التأكد من التوفر حسب تواريخك." },
      { qEn: "Is IELTS preparation available?", qAr: "هل توجد دورة تحضير IELTS؟", aEn: "Yes. IELTS Preparation is listed among Bright’s official programmes.", aAr: "نعم. التحضير لاختبار IELTS مدرج ضمن برامج برايت الرسمية." },
      { qEn: "What class sizes should I expect?", qAr: "ما حجم الفصول؟", aEn: "Bright states an average of about 10 students per class with a stated maximum range of 10–18.", aAr: "يذكر برايت أن المتوسط يقارب 10 طلاب للفصل، مع حد أقصى معلن يتراوح بين 10 و18." }
    ]
  },
  {
    slug: "els-malaysia",
    name: "ELS Language Centres Malaysia",
    shortName: "ELS",
    arabicName: "مراكز ELS للغات في ماليزيا",
    city: "Kuala Lumpur / Subang Jaya / Serdang / Johor",
    locations: ["Kuala Lumpur", "Subang Jaya", "UPM, Serdang", "UTM, Johor"],
    typeEn: "English language centre network",
    typeAr: "شبكة مراكز لغة إنجليزية",
    summaryEn:
      "ELS Malaysia operates multiple centres and is known for its Certified Intensive English Programme (CIEP), which is designed for academic progression and university preparation, alongside general, workplace, test-preparation and holiday programmes.",
    summaryAr:
      "تدير ELS ماليزيا عدة مراكز، وتشتهر ببرنامج CIEP المكثف المعتمد المصمم للتقدم الأكاديمي والاستعداد للجامعة، إضافة إلى الإنجليزية العامة وبرامج مكان العمل والتحضير للاختبارات وبرامج العطلات.",
    coursesEn: ["Certified Intensive English Programme (CIEP)", "General English", "Semi-Intensive English", "IELTS & TOEFL Preparation", "Workplace English", "Holiday English"],
    coursesAr: ["برنامج CIEP المكثف المعتمد", "الإنجليزية العامة", "الإنجليزية شبه المكثفة", "التحضير لـ IELTS وTOEFL", "إنجليزية مكان العمل", "برامج العطلات"],
    focus: ["general", "academic", "ielts", "business", "online"],
    officialUrl: "https://els.edu.my/",
    sourceUrls: [
      "https://els.edu.my/",
      "https://els.edu.my/course/certified-intensive-english-programme-ciep",
      "https://els.edu.my/how-to-apply/international-students",
      "https://els.edu.my/student-services",
      "https://els.edu.my/contact-us"
    ],
    quickFacts: [
      { titleEn: "CIEP levels", titleAr: "مستويات CIEP", bodyEn: "10 levels, Beginner 100 to Advanced 109", bodyAr: "10 مستويات من Beginner 100 حتى Advanced 109" },
      { titleEn: "Level length", titleAr: "مدة المستوى", bodyEn: "4 weeks per level for CIEP", bodyAr: "4 أسابيع لكل مستوى في CIEP" },
      { titleEn: "Class schedule", titleAr: "الجدول", bodyEn: "28 lessons per week for CIEP", bodyAr: "28 حصة أسبوعياً في CIEP" },
      { titleEn: "Class size", titleAr: "حجم الفصل", bodyEn: "Average 15, maximum 20 for CIEP", bodyAr: "متوسط 15 طالباً، والحد الأقصى 20 في CIEP" }
    ],
    assessment: [
      { titleEn: "Placement test", titleAr: "اختبار تحديد المستوى", bodyEn: "ELS uses a placement test before study to determine the most suitable CIEP level.", bodyAr: "تستخدم ELS اختبار تحديد مستوى قبل الدراسة لاختيار مستوى CIEP الأنسب." },
      { titleEn: "Four-week progression", titleAr: "تقدم كل أربعة أسابيع", bodyEn: "Students who meet their level requirements can progress after each four-week session.", bodyAr: "يمكن للطلاب الذين يستوفون متطلبات المستوى الانتقال بعد كل جلسة مدتها أربعة أسابيع." },
      { titleEn: "Progress planning", titleAr: "تخطيط التقدم", bodyEn: "ELS describes individual progress updates/planners and remedial support as part of its progression system.", bodyAr: "تصف ELS تحديثات وخطط تقدم فردية ودعماً علاجياً ضمن نظام متابعة التقدم." }
    ],
    whyChoose: [
      { titleEn: "University-pathway focus", titleAr: "تركيز على المسار الجامعي", bodyEn: "CIEP is positioned as a university-preparation pathway, with recognition arrangements that vary by university and programme.", bodyAr: "يُطرح CIEP كمسار للاستعداد الجامعي، مع اختلاف الاعتراف به حسب الجامعة والتخصص." },
      { titleEn: "Multiple centres", titleAr: "عدة مراكز", bodyEn: "ELS operates centres in Kuala Lumpur, Subang Jaya, UPM and UTM (Johor).", bodyAr: "تدير ELS مراكز في كوالالمبور وسوبانج جايا وUPM وUTM في جوهور." },
      { titleEn: "Structured levels", titleAr: "مستويات منظمة", bodyEn: "The CIEP structure uses 10 levels from beginner to advanced with defined progression milestones.", bodyAr: "يعتمد CIEP على 10 مستويات من المبتدئ إلى المتقدم مع مراحل تقدم محددة." },
      { titleEn: "Student services", titleAr: "خدمات الطلاب", bodyEn: "ELS lists accommodation assistance, arrival/orientation, university placement guidance and ongoing student support.", bodyAr: "تذكر ELS مساعدة في السكن والاستقبال والتوجيه والإرشاد الجامعي والدعم المستمر للطلاب." }
    ],
    application: [
      { titleEn: "Submit application", titleAr: "تقديم الطلب", bodyEn: "International students submit an application and the required supporting documents through the ELS process.", bodyAr: "يقدم الطلاب الدوليون الطلب والمستندات المطلوبة عبر إجراءات ELS." },
      { titleEn: "Visa / EMGS documents", titleAr: "مستندات التأشيرة وEMGS", bodyEn: "ELS lists passport copies, passport photo, certified school certificate/transcripts and an EMGS health declaration among the documents required for international students.", bodyAr: "تذكر ELS نسخ جواز السفر وصورة جواز وشهادة المدرسة وكشوف الدرجات المصدقة وإقرار EMGS الصحي ضمن مستندات الطلاب الدوليين." },
      { titleEn: "Placement and enrolment", titleAr: "تحديد المستوى والتسجيل", bodyEn: "After arrival/enrolment, students complete a placement test to determine the appropriate level.", bodyAr: "بعد الوصول والتسجيل يخضع الطالب لاختبار تحديد مستوى لتحديد المستوى المناسب." }
    ],
    accommodationEn: "ELS provides accommodation assistance and publishes selected housing options near its centres. Options, rental prices and availability differ by centre and can change, so they should be reconfirmed before booking.",
    accommodationAr: "توفر ELS مساعدة في السكن وتنشر خيارات إقامة مختارة بالقرب من مراكزها. تختلف الخيارات والأسعار والتوفر حسب المركز وقد تتغير، لذلك يجب التأكد منها قبل الحجز.",
    supportEn: "ELS lists accommodation assistance, arrival/orientation, university placement support, visa/health guidance and student activities as part of its student services.",
    supportAr: "تذكر ELS المساعدة في السكن والاستقبال والتوجيه ودعم الانتقال للجامعة والإرشاد المتعلق بالتأشيرة والصحة والأنشطة الطلابية ضمن خدماتها.",
    faq: [
      { qEn: "Do I need IELTS or TOEFL to join CIEP?", qAr: "هل أحتاج IELTS أو TOEFL للانضمام إلى CIEP؟", aEn: "ELS states that IELTS or TOEFL is not required to join CIEP; students take a placement test instead.", aAr: "تذكر ELS أن IELTS أو TOEFL غير مطلوب للانضمام إلى CIEP، ويخضع الطالب لاختبار تحديد مستوى بدلاً من ذلك." },
      { qEn: "How long is one CIEP level?", qAr: "كم مدة مستوى CIEP الواحد؟", aEn: "ELS states that each CIEP level runs for four weeks.", aAr: "تذكر ELS أن مدة كل مستوى في CIEP هي أربعة أسابيع." },
      { qEn: "Can CIEP be used for university entry?", qAr: "هل يمكن استخدام CIEP للقبول الجامعي؟", aEn: "Many Malaysian universities accept CIEP for English requirements, but the required level varies by institution and programme and should be confirmed before applying.", aAr: "تقبل جامعات ماليزية عديدة CIEP ضمن متطلبات اللغة الإنجليزية، لكن المستوى المطلوب يختلف حسب الجامعة والتخصص ويجب التأكد منه قبل التقديم." },
      { qEn: "Does ELS help with accommodation?", qAr: "هل تساعد ELS في السكن؟", aEn: "Yes. ELS lists accommodation assistance and centre-specific housing options among its student services.", aAr: "نعم. تذكر ELS مساعدة في السكن وخيارات إقامة تختلف حسب المركز ضمن خدماتها للطلاب." }
    ]
  },
  {
    slug: "elc-malaysia",
    name: "English Language Company Malaysia",
    shortName: "ELC",
    arabicName: "شركة اللغة الإنجليزية ELC ماليزيا",
    city: "Bukit Bintang, Kuala Lumpur",
    locations: ["Bukit Bintang, Kuala Lumpur"],
    typeEn: "English language centre",
    typeAr: "مركز لغة إنجليزية",
    summaryEn:
      "ELC Malaysia is an English school in Bukit Bintang, Kuala Lumpur offering general, academic, business, IELTS, junior and healthcare-focused English programmes, with student support and accommodation options.",
    summaryAr:
      "ELC ماليزيا مدرسة لغة إنجليزية في بوكيت بينتانج بكوالالمبور تقدم الإنجليزية العامة والأكاديمية وإنجليزية الأعمال والتحضير لـ IELTS وبرامج الناشئين وبرامج اللغة للقطاع الصحي، مع دعم للطلاب وخيارات للسكن.",
    coursesEn: ["General English", "General + Business English", "Academic English", "Premium English", "Super-Intensive IELTS", "Junior Program", "OET Preparation"],
    coursesAr: ["الإنجليزية العامة", "الإنجليزية العامة + الأعمال", "الإنجليزية الأكاديمية", "الإنجليزية المميزة", "IELTS مكثف", "برنامج الناشئين", "التحضير لـ OET"],
    focus: ["general", "academic", "ielts", "business", "junior"],
    officialUrl: "https://elcmy.edu.my/",
    sourceUrls: [
      "https://elcmy.edu.my/",
      "https://elcmy.edu.my/en/elc-courses/",
      "https://elcmy.edu.my/en/faq/",
      "https://elcmy.edu.my/en/student-services/student-support/",
      "https://elcmy.edu.my/en/student-services/accommodation/"
    ],
    quickFacts: [
      { titleEn: "Location", titleAr: "الموقع", bodyEn: "Bukit Bintang, central Kuala Lumpur", bodyAr: "بوكيت بينتانج، وسط كوالالمبور" },
      { titleEn: "Placement", titleAr: "تحديد المستوى", bodyEn: "Written placement test plus spoken interview on the first day", bodyAr: "اختبار تحديد مستوى كتابي ومقابلة شفهية في اليوم الأول" },
      { titleEn: "Progress checks", titleAr: "متابعة التقدم", bodyEn: "Weekly tests and formal progress reporting every 4–5 weeks depending on course", bodyAr: "اختبارات أسبوعية وتقارير تقدم رسمية كل 4–5 أسابيع حسب الدورة" },
      { titleEn: "Student mix", titleAr: "تنوع الطلاب", bodyEn: "ELC describes a highly international student mix", bodyAr: "تصف ELC بيئتها الطلابية بأنها دولية ومتنوعة" }
    ],
    assessment: [
      { titleEn: "First-day placement", titleAr: "تحديد المستوى في اليوم الأول", bodyEn: "Students complete a written placement test and spoken interview so ELC can place them in a suitable class.", bodyAr: "يكمل الطالب اختباراً كتابياً ومقابلة شفهية في اليوم الأول حتى يتم وضعه في الفصل المناسب." },
      { titleEn: "Weekly testing", titleAr: "اختبارات أسبوعية", bodyEn: "General English timetables include a weekly progress test as part of ongoing assessment.", bodyAr: "تتضمن جداول الإنجليزية العامة اختبار تقدم أسبوعي ضمن المتابعة المستمرة." },
      { titleEn: "Progress reports", titleAr: "تقارير التقدم", bodyEn: "ELC states that teachers complete a progress report every 4–5 weeks, covering language skills, grammar and vocabulary.", bodyAr: "تذكر ELC أن المدرسين يعدون تقرير تقدم كل 4–5 أسابيع يشمل المهارات اللغوية والقواعد والمفردات." }
    ],
    whyChoose: [
      { titleEn: "Central Bukit Bintang location", titleAr: "موقع مركزي في بوكيت بينتانج", bodyEn: "ELC is located in the heart of Kuala Lumpur with convenient access to city amenities and transport.", bodyAr: "تقع ELC في قلب كوالالمبور مع سهولة الوصول إلى خدمات المدينة والمواصلات." },
      { titleEn: "Broad course range", titleAr: "تنوع البرامج", bodyEn: "Students can move from general English into academic, business, IELTS, junior or OET-oriented study depending on level and goals.", bodyAr: "يمكن للطلاب الانتقال من الإنجليزية العامة إلى الأكاديمية أو الأعمال أو IELTS أو برامج الناشئين أو OET حسب المستوى والهدف." },
      { titleEn: "Communicative approach", titleAr: "منهج تواصلي", bodyEn: "ELC emphasises practical communication, collaborative learning and real-world language use.", bodyAr: "تركز ELC على التواصل العملي والتعلم التعاوني واستخدام اللغة في مواقف واقعية." },
      { titleEn: "Student services", titleAr: "خدمات الطلاب", bodyEn: "ELC provides orientation, academic advice, day-to-day support and guidance about further study and life in Malaysia.", bodyAr: "توفر ELC التهيئة والإرشاد الأكاديمي والدعم اليومي والتوجيه حول الدراسة المستقبلية والحياة في ماليزيا." }
    ],
    application: [
      { titleEn: "Choose course and start date", titleAr: "اختر الدورة وموعد البدء", bodyEn: "ELC's enrolment form asks students to choose a course, start date and course length.", bodyAr: "يطلب نموذج التسجيل في ELC اختيار الدورة وموعد البدء ومدة الدراسة." },
      { titleEn: "Level requirement", titleAr: "متطلبات المستوى", bodyEn: "General English is open broadly, while some other courses require a minimum English level and a level test.", bodyAr: "الإنجليزية العامة متاحة بشكل واسع، بينما تتطلب بعض الدورات الأخرى مستوى أدنى واختبار تحديد مستوى." },
      { titleEn: "Accommodation / airport pickup", titleAr: "السكن والاستقبال من المطار", bodyEn: "Students can request accommodation and airport pickup during the enrolment process.", bodyAr: "يمكن للطلاب طلب السكن والاستقبال من المطار ضمن عملية التسجيل." }
    ],
    accommodationEn: "ELC offers several apartment accommodation options in Kuala Lumpur, including Casa Residency, Casa Mutiara and Swiss Garden Residence, and advises students to book early because availability can be limited.",
    accommodationAr: "توفر ELC عدة خيارات للشقق السكنية في كوالالمبور، منها Casa Residency وCasa Mutiara وSwiss Garden Residence، وتنصح بالحجز المبكر لأن التوفر قد يكون محدوداً.",
    supportEn: "ELC provides first-day orientation, practical guidance about living in Malaysia, academic advice, travel information and ongoing support while students are studying.",
    supportAr: "توفر ELC تهيئة في اليوم الأول وإرشاداً عملياً للحياة في ماليزيا ونصائح أكاديمية ومعلومات سفر ودعماً مستمراً أثناء الدراسة.",
    faq: [
      { qEn: "What documents do I need to enrol?", qAr: "ما المستندات المطلوبة للتسجيل؟", aEn: "ELC states that General English has no specific entry requirements beyond enrolment, while other courses may require a minimum English level and level testing.", aAr: "تذكر ELC أن الإنجليزية العامة لا تتطلب شروط دخول محددة بخلاف التسجيل، بينما قد تتطلب الدورات الأخرى مستوى أدنى واختبار مستوى." },
      { qEn: "How is my class level decided?", qAr: "كيف يتم تحديد مستوى فصلي؟", aEn: "Students take a written placement test and spoken interview on the first day.", aAr: "يخضع الطالب لاختبار كتابي ومقابلة شفهية في اليوم الأول." },
      { qEn: "Can I combine courses?", qAr: "هل يمكنني الجمع بين دورات مختلفة؟", aEn: "Yes. ELC says many students begin with General English and later move into Academic or Business English when they reach the required level.", aAr: "نعم. تذكر ELC أن كثيراً من الطلاب يبدأون بالإنجليزية العامة ثم ينتقلون إلى الإنجليزية الأكاديمية أو إنجليزية الأعمال عند الوصول للمستوى المطلوب." },
      { qEn: "Does ELC arrange accommodation?", qAr: "هل توفر ELC السكن؟", aEn: "Yes. ELC lists several apartment options and recommends booking early, especially if you want the school to arrange accommodation.", aAr: "نعم. تعرض ELC عدة خيارات للشقق وتنصح بالحجز المبكر، خصوصاً إذا كنت ترغب في أن يرتب المعهد السكن لك." },
      { qEn: "How is progress monitored?", qAr: "كيف تتم متابعة التقدم؟", aEn: "ELC uses weekly tests and teacher progress reports every 4–5 weeks, depending on the course.", aAr: "تستخدم ELC اختبارات أسبوعية وتقارير تقدم يعدها المدرس كل 4–5 أسابيع حسب الدورة." }
    ]
  }
];

export const LANGUAGE_INSTITUTE_BY_SLUG = Object.fromEntries(
  LANGUAGE_INSTITUTES.map((item) => [item.slug, item])
) as Record<string, LanguageInstitute>;
