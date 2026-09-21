"use client";

import { MessageCircle } from "lucide-react";
import { type Locale } from "@/data/content";

export function WhatsAppContact({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const text = isAr
    ? "السلام عليكم YAZ Education، أريد استشارة عن الدراسة في ماليزيا."
    : "Hello YAZ Education, I would like a consultation about studying in Malaysia.";

  return (
    <a
      className="whatsapp-contact"
      href={`https://wa.me/60102282144?text=${encodeURIComponent(text)}`}
      target="_blank"
      rel="noreferrer"
      aria-label={isAr ? "تحدث مع مستشار عبر واتساب" : "Chat with an advisor on WhatsApp"}
      dir={isAr ? "rtl" : "ltr"}
    >
      <span className="whatsapp-contact-icon" aria-hidden="true"><MessageCircle size={21} /></span>
      <span className="whatsapp-contact-label">
        {isAr ? "تحدث مع مستشار" : "Chat on WhatsApp"}
      </span>
    </a>
  );
}
