import { content, type Locale } from "@/data/content";

export function MoreSection({ locale }: { locale: Locale }) {
  const t = content[locale];
  return (
    <section className="bg-[#f7f9fc] py-20" dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 md:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-blue">YAZ EDUCATION</p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-[-.035em] text-[#101828] md:text-5xl">{t.moreTitle}</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#667085]">{t.moreText}</p>
        </div>
        <div className="grid min-h-[300px] place-items-center rounded-[28px] border border-[#e7ebf2] bg-white p-10 text-center shadow-[0_20px_60px_rgba(16,24,40,.06)]">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-3xl">🎓</div>
            <p className="mt-5 font-semibold text-[#344054]">The next sections — services, program finder, student journey and consultations — will build from this approved visual system.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
