"use client";

import { ArrowUp, GraduationCap, Loader2, Minus, Sparkles, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { content, type Locale } from "@/data/content";

type Message = { role: "assistant" | "user"; text: string };

export function AiAdvisor({ locale }: { locale: Locale }) {
  const t = content[locale].ai;
  const isAr = locale === "ar";
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: t.hello }]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const value = input.trim();
    if (!value || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", text: value }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: value,
          locale,
          history: nextMessages.slice(1, -1).map((item) => ({
            role: item.role,
            content: item.text
          }))
        })
      });

      const data = await response.json();
      const answer = response.ok ? data.answer : data.error;
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: answer || (isAr ? "تعذر الحصول على إجابة الآن." : "I couldn't get an answer right now.")
        }
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: isAr ? "تعذر الاتصال بالخدمة الآن. حاول مرة أخرى." : "I couldn't reach the service. Please try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
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
    <aside className={`ai-panel ai-panel-simple ${minimized ? "ai-panel-min" : ""}`} dir={isAr ? "rtl" : "ltr"} aria-label={t.name}>
      <div className="ai-head">
        <div className="flex items-center gap-3">
          <div className="ai-logo"><GraduationCap size={20} /></div>
          <div>
            <div className="font-extrabold text-white">{t.name}</div>
            <div className="text-[11px] text-white/55">{t.subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="ai-icon" onClick={() => setMinimized((v) => !v)} aria-label="Minimize"><Minus size={17} /></button>
          <button type="button" className="ai-icon" onClick={() => setOpen(false)} aria-label="Close"><X size={17} /></button>
        </div>
      </div>

      {!minimized && (
        <>
          <div className="ai-body ai-body-simple">
            <div className="ai-scroll ai-scroll-simple" aria-live="polite">
              {messages.map((message, index) => (
                <div key={index} className={message.role === "assistant" ? "ai-message bot" : "ai-message user"}>
                  {message.text}
                </div>
              ))}
              {loading && (
                <div className="ai-typing" aria-label={isAr ? "YAZ AI يكتب" : "YAZ AI is typing"}>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isAr ? "جاري البحث في البيانات الموثقة..." : "Checking verified YAZ data..."}</span>
                </div>
              )}
            </div>
            <a className="ai-human-link" target="_blank" rel="noreferrer" href={`https://wa.me/60102282144?text=${encodeURIComponent(whatsappText)}`}>
              {t.human}
            </a>
          </div>

          <form className="ai-form ai-form-simple" onSubmit={send}>
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={t.prompt} aria-label={t.prompt} disabled={loading} />
            <button type="submit" aria-label="Send" disabled={loading || !input.trim()}><ArrowUp size={17} /></button>
          </form>
        </>
      )}
    </aside>
  );
}
