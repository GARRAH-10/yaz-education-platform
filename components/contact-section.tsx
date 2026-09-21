"use client";

import { FormEvent, useState } from "react";
import { Instagram, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import type { Locale } from "@/data/content";

const levels = {
  en: ["Foundation", "Diploma", "Bachelor's", "Master's", "PhD", "English Language", "Not sure yet"],
  ar: ["تأسيسي", "دبلوم", "بكالوريوس", "ماجستير", "دكتوراه", "لغة إنجليزية", "لم أحدد بعد"],
};

export function ContactSection({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [databaseSaved, setDatabaseSaved] = useState<boolean | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) || "").trim();
    const message = isAr
      ? `السلام عليكم YAZ Education، أريد استشارة دراسية مجانية.\n\nالاسم: ${value("name")}\nالجنسية: ${value("nationality")}\nرقم واتساب: ${value("whatsapp")}\nالبريد: ${value("email") || "غير مذكور"}\nالمرحلة: ${value("level")}\nالتخصص/المجال: ${value("field") || "غير محدد"}\nموعد الدراسة: ${value("intake") || "غير محدد"}\nملاحظات: ${value("message") || "لا يوجد"}`
      : `Hello YAZ Education, I would like a free study consultation.\n\nName: ${value("name")}\nNationality: ${value("nationality")}\nWhatsApp: ${value("whatsapp")}\nEmail: ${value("email") || "Not provided"}\nStudy level: ${value("level")}\nField: ${value("field") || "Not specified"}\nPreferred intake: ${value("intake") || "Not specified"}\nNotes: ${value("message") || "None"}`;

    setSaving(true);
    setDatabaseSaved(null);

    try {
      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          nationality: value("nationality"),
          whatsapp: value("whatsapp"),
          email: value("email"),
          level: value("level"),
          field: value("field"),
          intake: value("intake"),
          message: value("message"),
          locale,
        }),
      });

      const result = await response.json().catch(() => ({}));
      setDatabaseSaved(Boolean(response.ok && result.saved));
    } catch {
      setDatabaseSaved(false);
    } finally {
      setSaving(false);
      setSubmitted(true);
      window.open(`https://wa.me/60102282144?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="contact" className="contact-section" dir={isAr ? "rtl" : "ltr"}>
      <div id="consultation" className="mx-auto max-w-[1280px] px-5 py-20 md:px-8 lg:py-28">
        <div className="contact-grid">
          <div className="contact-copy">
            <p className="section-kicker section-kicker-light">{isAr ? "تواصل معنا" : "CONTACT YAZ EDUCATION"}</p>
            <h2>{isAr ? "ابدأ باستشارة دراسية مجانية" : "Start with a free study consultation"}</h2>
            <p className="contact-lead">{isAr ? "أرسل لنا معلوماتك الأساسية وسنفتح لك رسالة واتساب مرتبة يمكنك إرسالها مباشرة إلى مستشار YAZ." : "Share the basics below and we will prepare a structured WhatsApp message that you can send directly to a YAZ advisor."}</p>

            <div className="contact-methods">
              <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer" className="contact-method">
                <span><MessageCircle size={20} /></span>
                <div><small>WhatsApp</small><strong>+60 10-228 2144</strong></div>
              </a>
              <a href="mailto:yazan.connect@gmail.com" className="contact-method">
                <span><Mail size={20} /></span>
                <div><small>{isAr ? "البريد الإلكتروني" : "Email"}</small><strong>yazan.connect@gmail.com</strong></div>
              </a>
              <div className="contact-method">
                <span><MapPin size={20} /></span>
                <div><small>{isAr ? "الموقع" : "Location"}</small><strong>Kuala Lumpur, Malaysia</strong></div>
              </div>
              <a href="https://www.instagram.com/yaz.education/" target="_blank" rel="noreferrer" className="contact-method">
                <span><Instagram size={20} /></span>
                <div><small>Instagram</small><strong>@yaz.education</strong></div>
              </a>
            </div>
          </div>

          <form className="consultation-form" onSubmit={submit}>
            <div className="consultation-form-head">
              <h3>{isAr ? "طلب استشارة مجانية" : "Request a free consultation"}</h3>
              <p>{isAr ? "أدخل معلوماتك الأساسية. الحقول المعلّمة مطلوبة." : "Enter the essential details. Fields marked required must be completed."}</p>
            </div>

            <div className="form-grid">
              <label><span>{isAr ? "الاسم الكامل *" : "Full name *"}</span><input name="name" required autoComplete="name" /></label>
              <label><span>{isAr ? "الجنسية *" : "Nationality *"}</span><input name="nationality" required /></label>
              <label><span>{isAr ? "رقم واتساب *" : "WhatsApp number *"}</span><input name="whatsapp" required inputMode="tel" autoComplete="tel" /></label>
              <label><span>{isAr ? "البريد الإلكتروني" : "Email"}</span><input name="email" type="email" autoComplete="email" /></label>
              <label><span>{isAr ? "المرحلة الدراسية *" : "Study level *"}</span><select name="level" required defaultValue=""><option value="" disabled>{isAr ? "اختر المرحلة" : "Select level"}</option>{levels[locale].map((level) => <option key={level}>{level}</option>)}</select></label>
              <label><span>{isAr ? "التخصص أو المجال" : "Field of study"}</span><input name="field" placeholder={isAr ? "مثال: علوم الحاسب" : "e.g. Computer Science"} /></label>
              <label className="form-span-2"><span>{isAr ? "موعد الدراسة المفضل" : "Preferred intake"}</span><input name="intake" placeholder={isAr ? "مثال: سبتمبر 2027" : "e.g. September 2027"} /></label>
              <label className="form-span-2"><span>{isAr ? "رسالتك" : "Your message"}</span><textarea name="message" rows={4} placeholder={isAr ? "أي معلومات إضافية تساعدنا على فهم طلبك" : "Anything else that helps us understand what you need"} /></label>
            </div>

            <button className="consultation-submit" type="submit" disabled={saving}><Send size={18} />{saving ? (isAr ? "جارٍ الحفظ..." : "Saving...") : (isAr ? "متابعة عبر واتساب" : "Continue on WhatsApp")}</button>
            <p className="consultation-form-note">
              {submitted
                ? databaseSaved === true
                  ? (isAr ? "تم حفظ طلبك وفتح واتساب لإكمال التواصل." : "Your enquiry was saved and WhatsApp opened for the conversation.")
                  : (isAr ? "تم فتح واتساب. قاعدة البيانات غير متصلة بعد، لذلك لم يُحفظ الطلب إلكترونياً." : "WhatsApp opened. The database is not connected yet, so the enquiry was not stored online.")
                : (isAr ? "لن يتم إرسال شيء عبر واتساب قبل أن تؤكد الإرسال بنفسك." : "Nothing is sent on WhatsApp until you confirm the message yourself.")}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
