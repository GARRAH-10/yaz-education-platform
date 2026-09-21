import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import type { Locale } from "@/data/content";

export function Footer({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  return (
    <footer className="site-footer" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-[1280px] px-5 py-14 md:px-8">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href={`/${locale}`} className="footer-logo">
              <Image src="/yaz-logo.png" width={46} height={46} alt="YAZ Education" />
              <div><strong>YAZ</strong><span>EDUCATION</span></div>
            </Link>
            <p>{isAr ? "شريكك في رحلة الدراسة في ماليزيا — من أول سؤال حتى بداية الطريق." : "Your study journey in Malaysia — from the first question to the next step."}</p>
            <strong className="footer-slogan">{isAr ? "سهلة، لأننا نسهّلها عليك." : "Making your study journey simpler."}</strong>
          </div>

          <div>
            <h3>{isAr ? "روابط" : "Explore"}</h3>
            <nav className="footer-links">
              <Link href={`/${locale}`}>{isAr ? "الرئيسية" : "Home"}</Link>
              <Link href={`/${locale}#universities`}>{isAr ? "الجامعات والمعاهد" : "Universities & institutes"}</Link>
              <Link href={`/${locale}#services`}>{isAr ? "خدماتنا" : "Services"}</Link>
              <Link href={`/${locale}#about`}>{isAr ? "لماذا YAZ" : "Why YAZ"}</Link>
              <Link href={`/${locale}#contact`}>{isAr ? "تواصل معنا" : "Contact"}</Link>
            </nav>
          </div>

          <div>
            <h3>{isAr ? "تواصل" : "Contact"}</h3>
            <div className="footer-contact-list">
              <a href="https://wa.me/60102282144" target="_blank" rel="noreferrer"><MessageCircle size={17} /> +60 10-228 2144</a>
              <a href="mailto:yazan.connect@gmail.com"><Mail size={17} /> yazan.connect@gmail.com</a>
              <span><MapPin size={17} /> Kuala Lumpur, Malaysia</span>
              <a href="https://www.instagram.com/yaz.education/" target="_blank" rel="noreferrer"><Instagram size={17} /> @yaz.education</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 YAZ Education. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          <span>{isAr ? "المعلومات التعليمية في الموقع إرشادية ويجب تأكيد المتطلبات النهائية مع المؤسسة المعنية." : "Study information is guidance only; final requirements should be confirmed with the relevant institution."}</span>
        </div>
      </div>
    </footer>
  );
}
