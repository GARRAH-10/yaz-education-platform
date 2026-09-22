"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { content, type Locale } from "@/data/content";

export function Hero({ locale }: { locale: Locale }) {
  const t = content[locale].hero;
  const isAr = locale === "ar";

  return (
    <section className="hero-shell hero-shell-v7" dir={isAr ? "rtl" : "ltr"}>
      <div className="hero-grid-bg" aria-hidden="true" />

      <div className="hero-photo-layer" aria-hidden="true">
        <div className="hero-photo-frame">
          <Image
            src="/hero-malaysia.png"
            alt=""
            width={710}
            height={645}
            priority
            quality={100}
            className="hero-photo-image"
            sizes="(max-width: 900px) 92vw, (max-width: 1400px) 70vw, 1040px"
          />
          <div className="hero-photo-left-mask" />
          <div className="hero-photo-location-mask" />
        </div>
      </div>

      <div className="hero-layout-v7 mx-auto max-w-[1500px] px-5 pb-16 pt-32 md:px-8 lg:px-12 lg:pt-28">
        <div className="hero-copy-v7 relative z-10">
          <p className="hero-eyebrow">{t.eyebrow}</p>
          <h1 className="hero-title hero-title-v7">
            <span>{t.line1}</span>
            <span className="hero-highlight">{t.highlight}</span>
            <span>{t.line3}</span>
          </h1>
          <p className="hero-copy hero-copy-text-v7">{t.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link className="primary-btn" href={`/${locale}#consultation`}>
              {t.primary} <ArrowRight size={17} className={isAr ? "rotate-180" : ""} />
            </Link>
            <Link className="secondary-btn" href={`/${locale}/universities`}>
              {t.secondary}
            </Link>
          </div>
        </div>
      </div>

    </section>
  );
}
