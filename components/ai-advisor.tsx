"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  Check,
  GitCompareArrows,
  GraduationCap,
  Loader2,
  MapPin,
  Minus,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { content, type Locale } from "@/data/content";

type AdvisorMatch = {
  slug: string;
  name: string;
  universityName: string;
  universityShortName: string;
  universitySlug: string;
  universityLogo: string;
  field: string;
  level: string;
  city: string;
  campus?: string;
  duration?: string;
  studyMode?: string;
  intakes?: string[];
  sourceUrl: string;
  verifiedAt: string;
  matchType?: "exact" | "specialisation" | "related";
};

type Message = {
  role: "assistant" | "user";
  text: string;
  matches?: AdvisorMatch[];
};

const QUICK_EN = [
  "Which universities have Cybersecurity?",
  "What is the difference between Computer Science and Software Engineering?",
  "Explain artificial intelligence in simple terms",
];

const QUICK_AR = [
  "ما الجامعات التي لديها أمن سيبراني؟",
  "ما الفرق بين علوم الحاسب وهندسة البرمجيات؟",
  "اشرح الذكاء الاصطناعي بطريقة بسيطة",
];

export function AiAdvisor({ locale }: { locale: Locale }) {
  const t = content[locale].ai;
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [compareSlugs, setCompareSlugs] = useState<string[]>([]);
  const [advisorMode, setAdvisorMode] = useState<"gemini" | "retrieval" | null>(null);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: t.hello }]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("yaz-programme-compare");
      const parsed = stored ? JSON.parse(stored) : [];
      if (Array.isArray(parsed)) setCompareSlugs(parsed.filter((item): item is string => typeof item === "string").slice(0, 3));
    } catch {
      // Comparison remains optional when storage is unavailable.
    }
  }, []);

  const compareHref = useMemo(
    () => `/${locale}/programmes/compare?ids=${encodeURIComponent(compareSlugs.join(","))}`,
    [compareSlugs, locale],
  );

  const setCompare = (slug: string) => {
    setCompareSlugs((current) => {
      const next = current.includes(slug)
        ? current.filter((item) => item !== slug)
        : current.length < 3
          ? [...current, slug]
          : current;
      try {
        window.localStorage.setItem("yaz-programme-compare", JSON.stringify(next));
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  };

  const sendValue = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          locale,
          history: nextMessages.slice(1, -1).map((item) => ({ role: item.role, content: item.text })),
        }),
      });

      const data = await response.json();
      const answer = response.ok ? data.answer : data.error;
      setAdvisorMode(typeof data.mode === "string" && data.mode.startsWith("gemini") ? "gemini" : typeof data.mode === "string" && data.mode.startsWith("retrieval") ? "retrieval" : null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: answer || (isAr ? "تعذر الحصول على إجابة الآن." : "I couldn't get an answer right now."),
          matches: Array.isArray(data.matches) ? data.matches : [],
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: isAr ? "تعذر الاتصال بالخدمة الآن. حاول مرة أخرى." : "I couldn't reach the service. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const send = async (event: FormEvent) => {
    event.preventDefault();
    await sendValue(input);
  };

  const whatsappText = isAr
    ? "السلام عليكم YAZ Education، أريد التحدث مع مستشار عن الدراسة في ماليزيا."
    : "Hello YAZ Education, I would like to speak with an advisor about studying in Malaysia.";

  if (!open) {
    return (
      <button type="button" className="ai-open" onClick={() => setOpen(true)}>
        <Sparkles size={17} /> {t.open}
      </button>
    );
  }

  return (
    <aside className={`ai-panel ai-panel-simple ai-panel-v24 ${minimized ? "ai-panel-min" : ""}`} dir={isAr ? "rtl" : "ltr"} aria-label={t.name}>
      <div className="ai-head">
        <div className="flex items-center gap-3">
          <div className="ai-logo"><GraduationCap size={20} /></div>
          <div>
            <div className="font-extrabold text-white">{t.name}</div>
            <div className="text-[11px] text-white/55">{t.subtitle}</div>
            {advisorMode ? (
              <div className={`text-[10px] mt-0.5 ${advisorMode === "gemini" ? "text-emerald-300" : "text-amber-300"}`}>
                {advisorMode === "gemini"
                  ? (isAr ? "Gemini متصل — أسئلة عامة + بيانات YAZ الموثقة" : "Gemini connected — general AI + verified YAZ data")
                  : (isAr ? "بحث YAZ الموثق يعمل — Gemini غير متاح مؤقتًا" : "Verified YAZ search active — Gemini temporarily unavailable")}
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="ai-icon" onClick={() => setMinimized((value) => !value)} aria-label="Minimize"><Minus size={17} /></button>
          <button type="button" className="ai-icon" onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="ai-body ai-body-simple">
            <div className="ai-scroll ai-scroll-simple" aria-live="polite">
              {messages.map((message, index) => (
                <div key={index} className="ai-turn">
                  <div className={message.role === "assistant" ? "ai-message bot" : "ai-message user"}>
                    {message.text}
                  </div>

                  {message.role === "assistant" && message.matches?.length ? (
                    <div className="ai-match-list">
                      {message.matches.map((match) => {
                        const selected = compareSlugs.includes(match.slug);
                        return (
                          <article className="ai-match-card" key={match.slug}>
                            <div className="ai-match-top">
                              <div className="ai-match-logo">
                                <Image src={match.universityLogo || "/yaz-logo.png"} alt={match.universityShortName} fill sizes="54px" className="object-contain" />
                              </div>
                              <div>
                                <strong>{match.universityShortName}</strong>
                                <h3>{match.name}</h3>
                              </div>
                            </div>
                            <div className="ai-match-meta">
                              {match.matchType ? (
                                <span>
                                  {match.matchType === "exact"
                                    ? (isAr ? "تطابق مباشر" : "Exact match")
                                    : match.matchType === "specialisation"
                                      ? (isAr ? "مسار / تخصص فرعي" : "Specialisation / pathway")
                                      : (isAr ? "خيار ذو صلة" : "Related option")}
                                </span>
                              ) : null}
                              <span>{match.level}</span>
                              <span>{match.field}</span>
                              <span><MapPin size={12} />{match.campus ?? match.city}</span>
                              {match.duration ? <span>{match.duration}</span> : null}
                            </div>
                            <div className="ai-match-actions">
                              <Link href={`/${locale}/programmes/${match.slug}`}>{isAr ? "عرض البرنامج" : "View programme"}</Link>
                              <button type="button" className={selected ? "is-selected" : ""} onClick={() => setCompare(match.slug)}>
                                {selected ? <Check size={14} /> : <GitCompareArrows size={14} />}
                                {selected ? (isAr ? "تمت الإضافة" : "Added") : (isAr ? "قارن" : "Compare")}
                              </button>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              ))}

              {messages.length === 1 ? (
                <div className="ai-suggestions">
                  {(isAr ? QUICK_AR : QUICK_EN).map((prompt) => (
                    <button type="button" key={prompt} onClick={() => sendValue(prompt)}>{prompt}</button>
                  ))}
                </div>
              ) : null}

              {loading && (
                <div className="ai-typing" aria-label={isAr ? "YAZ AI يكتب" : "YAZ AI is typing"}>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isAr ? "يعمل YAZ AI على إجابتك..." : "YAZ AI is working on your answer..."}</span>
                </div>
              )}
            </div>

            {compareSlugs.length >= 2 ? (
              <Link className="ai-compare-link" href={compareHref}>
                <GitCompareArrows size={15} />
                {isAr ? `مقارنة البرامج المختارة (${compareSlugs.length})` : `Compare selected programmes (${compareSlugs.length})`}
              </Link>
            ) : null}

            <a className="ai-human-link" target="_blank" rel="noreferrer" href={`https://wa.me/60102282144?text=${encodeURIComponent(whatsappText)}`}>
              {t.human}
            </a>
          </div>

          <form className="ai-form ai-form-simple" onSubmit={send}>
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder={t.prompt} aria-label={t.prompt} disabled={loading} />
            <button type="submit" aria-label="Send" disabled={loading || !input.trim()}><ArrowUp size={17} /></button>
          </form>
        </>
      )}
    </aside>
  );
}
