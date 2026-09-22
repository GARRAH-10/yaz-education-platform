"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpenCheck, GraduationCap } from "lucide-react";
import type { Locale } from "@/data/content";
import { STUDY_FIELD_GROUPS, STUDY_LEVELS } from "@/data/study-fields";

const LEVEL_AR: Record<string, string> = {
  Foundation: "تأسيسي",
  Diploma: "دبلوم",
  "Bachelor's": "بكالوريوس",
  "Master's": "ماجستير",
  PhD: "دكتوراه",
  "Professional / Pre-University": "مهني / ما قبل الجامعة",
};

export function ProgrammeFinder({ locale }: { locale: Locale }) {
  const isAr = locale === "ar";
  const router = useRouter();
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");

  const submit = () => {
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (field) params.set("field", field);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    router.push(`/${locale}/programmes${suffix}`);
  };

  return (
    <section className="home-programme-finder-shell" dir={isAr ? "rtl" : "ltr"} aria-label={isAr ? "البحث عن برنامج دراسي" : "Programme finder"}>
      <div className="home-programme-finder-card">
        <div className="home-programme-finder-copy">
          <span className="home-programme-finder-icon"><BookOpenCheck size={22} /></span>
          <div>
            <p>{isAr ? "ابحث بشكل أسرع" : "QUICK PROGRAMME FINDER"}</p>
            <h2>{isAr ? "ماذا تريد أن تدرس؟" : "What do you want to study?"}</h2>
            <span>{isAr ? "اختر المرحلة والمجال وسنعرض لك البرامج المطابقة مباشرة." : "Choose your study level and field to open matching programmes immediately."}</span>
          </div>
        </div>

        <div className="home-programme-finder-controls">
          <label>
            <span><GraduationCap size={15} />{isAr ? "المرحلة الدراسية" : "Study level"}</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option value="">{isAr ? "كل المراحل" : "All levels"}</option>
              {STUDY_LEVELS.map((item) => <option key={item} value={item}>{isAr ? (LEVEL_AR[item] ?? item) : item}</option>)}
            </select>
          </label>

          <label>
            <span><BookOpenCheck size={15} />{isAr ? "مجال الدراسة" : "Study field"}</span>
            <select value={field} onChange={(event) => setField(event.target.value)}>
              <option value="">{isAr ? "كل المجالات" : "All fields"}</option>
              {STUDY_FIELD_GROUPS.map((group) => (
                <optgroup key={group.group} label={isAr ? group.groupAr : group.group}>
                  {group.fields.map((item) => (
                    <option key={item.value} value={item.value}>{isAr ? item.labelAr : item.value}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <button type="button" onClick={submit}>
            {isAr ? "عرض البرامج" : "Find programmes"}
            <ArrowRight size={17} className={isAr ? "rotate-180" : ""} />
          </button>
        </div>
      </div>
    </section>
  );
}
