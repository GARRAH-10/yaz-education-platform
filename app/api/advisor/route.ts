import { NextResponse } from "next/server";
import { getProgrammes, getUniversities } from "@/lib/catalog";
import {
  deterministicAdvisorAnswer,
  findAdvisorMatches,
  parseAdvisorIntent,
} from "@/lib/advisor-retrieval";
import {
  searchAdvisorProgrammes,
  searchAdvisorUniversities,
  type AdvisorToolProgramme,
  type ProgrammeSearchArgs,
  type UniversitySearchArgs,
} from "@/lib/advisor-tools";

export const runtime = "nodejs";

const MAX_MESSAGE_LENGTH = 3000;
const MAX_HISTORY = 8;
const MAX_TOOL_ROUNDS = 2;
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
const GEMINI_RETRY_DELAYS_MS = [400];
const DEFAULT_GEMINI_MODEL = "gemini-3.5-flash-lite";
const DEFAULT_GEMINI_FALLBACK_MODELS = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

type RequestBody = {
  message?: string;
  locale?: "en" | "ar";
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

type GeminiFunctionCall = {
  name?: string;
  args?: Record<string, unknown>;
  id?: string;
};

type GeminiPart = {
  text?: string;
  thoughtSignature?: string;
  functionCall?: GeminiFunctionCall;
  functionResponse?: {
    name: string;
    id?: string;
    response: Record<string, unknown>;
  };
};

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

type GeminiResponse = {
  candidates?: Array<{
    content?: GeminiContent;
    finishReason?: string;
    groundingMetadata?: unknown;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

function contextualFallbackIntent(
  history: Array<{ role: "user" | "assistant"; content: string }>,
  message: string,
  programmes: Awaited<ReturnType<typeof getProgrammes>>,
  universities: Awaited<ReturnType<typeof getUniversities>>,
) {
  // Parse the current message first so a new constraint such as "what about APU?"
  // always overrides older mentions such as UTM. Then inherit only the missing
  // pieces (for example Cybersecurity) from the newest relevant user turns.
  const current = parseAdvisorIntent(message, programmes, universities);
  const resolved = { ...current };

  const previousUserTurns = history
    .filter((item) => item.role === "user")
    .slice(-6)
    .reverse();

  for (const turn of previousUserTurns) {
    const prior = parseAdvisorIntent(turn.content, programmes, universities);
    if (!resolved.field && prior.field) resolved.field = prior.field;
    if (!resolved.level && prior.level) resolved.level = prior.level;
    if (!resolved.university && prior.university) resolved.university = prior.university;
    if (!resolved.city && prior.city) resolved.city = prior.city;
    resolved.mentionsBudget = resolved.mentionsBudget || prior.mentionsBudget;

    if (resolved.field && resolved.level && resolved.university && resolved.city) break;
  }

  return resolved;
}

function uniqueMatches(matches: AdvisorToolProgramme[]) {
  const seen = new Set<string>();
  return matches.filter((match) => {
    if (seen.has(match.slug)) return false;
    seen.add(match.slug);
    return true;
  }).slice(0, 6);
}

function normalizeFastText(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\u0600-\u06ff&+\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isConceptualQuestion(message: string) {
  const text = normalizeFastText(message);
  return /^(what is|what are|explain|why |how does|how do|difference between|define |ما هو|ما هي|اشرح|لماذا)/.test(text);
}

function shouldUseFastCataloguePath(
  message: string,
  intent: ReturnType<typeof contextualFallbackIntent>,
) {
  const text = normalizeFastText(message);
  if (isConceptualQuestion(message) && !intent.university) return false;

  const catalogueLanguage = /(which universit|what about|and |offer|offers|have |has |programme|program|course|intake|requirement|duration|campus|accredit|in |at |في |جامعة|برنامج)/.test(text);
  const compactStructured = message.length <= 90 && Boolean(intent.university && (intent.field || intent.level));
  const fieldSearch = Boolean(intent.field && catalogueLanguage);
  const universityFollowUp = Boolean(intent.university && /(what about|and |\?|in |at |في |عن )/.test(text));
  const budgetQuery = Boolean(intent.mentionsBudget && (intent.field || intent.university));

  return compactStructured || fieldSearch || universityFollowUp || budgetQuery;
}

function fastProgrammeAnswer(
  locale: "en" | "ar",
  intent: ReturnType<typeof contextualFallbackIntent>,
  matches: AdvisorToolProgramme[],
) {
  const isAr = locale === "ar";
  const exact = matches.filter((item) => item.matchType === "exact");
  const pathways = matches.filter((item) => item.matchType === "specialisation");
  const related = matches.filter((item) => item.matchType === "related");
  const university = intent.university;
  const field = intent.field;

  if (!matches.length) {
    if (isAr) {
      if (university && field) return `لا يوجد لدي حالياً برنامج ${field} موثق لجامعة ${university} في قاعدة بيانات YAZ. هذا لا يعني أن الجامعة لا تقدمه؛ فقط أنه غير موثق لدينا حتى الآن.`;
      return "لم أجد برنامجاً موثقاً يطابق هذه الشروط في قاعدة بيانات YAZ حالياً.";
    }
    if (university && field) return `I don't currently have a verified ${field} programme for ${university} in the YAZ database. This does not mean the university does not offer it; it is simply not verified in our catalogue yet.`;
    return "I couldn't find a verified programme matching those conditions in the YAZ database yet.";
  }

  if (isAr) {
    if (exact.length) return `وجدت ${exact.length} ${exact.length === 1 ? "برنامجاً موثقاً مطابقاً" : "برامج موثقة مطابقة"}${field ? ` لـ ${field}` : ""}${university ? ` في ${university}` : ""}. يمكنك مراجعة البطاقات أدناه. الرسوم الحالية يؤكدها مستشار YAZ لأنها قد تتغير حسب الدفعة.`;
    if (pathways.length) return `وجدت ${pathways.length} خياراً موثقاً يقدّم ${field ?? "المجال المطلوب"} كمسار أو تخصص فرعي، وليس كبرنامج مستقل. راجع البطاقات أدناه.`;
    return `وجدت ${related.length} خياراً ذا صلة في قاعدة YAZ، لكنه ليس تطابقاً مباشراً مع ${field ?? "طلبك"}.`;
  }

  if (exact.length) return `I found ${exact.length} verified exact ${field ?? "programme"} option${exact.length === 1 ? "" : "s"}${university ? ` at ${university}` : ""}. Review the cards below. Current tuition is confirmed by a YAZ advisor because fees can change by intake.`;
  if (pathways.length) return `I found ${pathways.length} verified option${pathways.length === 1 ? "" : "s"} where ${field ?? "the requested field"} is offered as a specialisation/pathway rather than a standalone programme. Review the cards below.`;
  return `I found ${related.length} related option${related.length === 1 ? "" : "s"} in the YAZ catalogue, but they are not exact ${field ?? "requested"} programme matches.`;
}

function fastUniversityAnswer(
  locale: "en" | "ar",
  universityResult: ReturnType<typeof searchAdvisorUniversities>,
) {
  const item = universityResult.universities[0];
  if (!item) return null;
  if (locale === "ar") {
    return `${item.arabicName || item.name} (${item.shortName}) هي ${item.type} وموقعها ${item.city}. ${item.summary || ""}`.trim();
  }
  return `${item.name} (${item.shortName}) is a ${item.type} located in ${item.city}. ${item.summary || ""}`.trim();
}

function advisorInstructions(locale: "en" | "ar") {
  return `You are YAZ AI, a conversational study advisor for YAZ Education in Malaysia.
Respond in ${locale === "ar" ? "Arabic" : "English"} unless the user clearly asks for another language.

YOUR JOB
- Have a natural multi-turn conversation and use the earlier turns as context. If the previous topic was Cybersecurity and the user says "what about UTM?", understand it as "what Cybersecurity options does UTM have?" unless the topic clearly changed.
- Answer general education questions directly: differences between study fields, study planning, careers, application concepts, English tests, student life, and general study-in-Malaysia guidance.
- For YAZ catalogue facts about specific universities or programmes, use the YAZ tools instead of guessing.
- If the user asks for current/time-sensitive public information and the current-web tool is available, use it. Prefer official sources.

GROUNDING RULES
- Never invent a programme, intake, campus, duration, accreditation, entry requirement, partnership, scholarship, or admission fact.
- If a YAZ search returns no exact match, say it is "not currently verified in the YAZ database". Do not claim the university definitely does not offer it.
- If a programme has matchType="specialisation", clearly say it is a specialisation/pathway rather than a standalone exact programme.
- If matchType="related", clearly label it as related and do not present it as an exact match.
- Never reveal exact tuition-fee numbers, even if they exist internally or appear in a web result. Say tuition can change by intake and a YAZ advisor can confirm the latest official fee.
- Do not call a university/programme "best", "#1", or a winner. Compare factual attributes and let the student decide.
- Distinguish general guidance from verified institution-specific facts.

TOOL USE
- Use search_yaz_programmes when the user asks what/where to study, which universities offer a field, a specific programme, programme requirements, intake, duration, campus, study mode, accreditation, or a follow-up about a previously discussed field/programme.
- Use search_yaz_universities for university-level questions such as location, institution type, general study areas, or profile information.
- Carry context from the conversation into tool arguments. A short follow-up like "and APU?" must inherit the relevant field/level from the prior turn.
- Do not call YAZ tools for general conceptual questions such as "What is the difference between Computer Science and Software Engineering?"
- Use search_current_web only when the question genuinely requires current public information. Never use it to reveal tuition numbers.

SCOPE
- You are a general-purpose conversational AI inside the YAZ Education website. Answer normal user questions across general knowledge, writing, explanations, technology, careers, travel, study, everyday life, and other harmless topics.
- Do not force unrelated questions back to education. If the user asks a non-education question, answer it directly and naturally.
- Keep YAZ Education as your strongest specialty: when the question involves Malaysian universities, YAZ programmes, admissions, campuses, intakes, accreditation, or other catalogue facts, use the verified YAZ tools rather than guessing.
- Follow the model provider's safety restrictions and do not assist with disallowed harmful requests.

STYLE
- Be concise, helpful, and specific.
- Ask at most one useful follow-up question when genuinely needed.
- Programme cards are rendered separately in the UI, so do not duplicate every card field in prose.`;
}

function buildFunctionDeclarations(enableWebSearch: boolean) {
  const declarations: Array<Record<string, unknown>> = [
    {
      name: "search_yaz_programmes",
      description: "Search the verified YAZ programme catalogue. Use for exact programmes, study fields, university-specific programme queries, programme requirements, duration, intakes, campus, study mode, accreditation, and contextual follow-ups such as 'what about UTM?'.",
      parameters: {
        type: "OBJECT",
        properties: {
          field: { type: "STRING", description: "Requested study field inherited from conversation when relevant, e.g. Cybersecurity or Mechanical Engineering." },
          level: { type: "STRING", description: "Study level such as Bachelor's, Master's, Diploma, Foundation or PhD." },
          university: { type: "STRING", description: "University name or short name such as UTM, APU, Taylor's, UCSI, MMU or Sunway." },
          location: { type: "STRING", description: "Preferred city/campus/location when supplied." },
          query: { type: "STRING", description: "Extra free-text programme title or specialisation terms." },
          limit: { type: "INTEGER", description: "Maximum records to return, between 1 and 8." },
        },
      },
    },
    {
      name: "search_yaz_universities",
      description: "Search verified YAZ university profiles for university-level information such as type, city/campus, study areas, and profile summary.",
      parameters: {
        type: "OBJECT",
        properties: {
          query: { type: "STRING", description: "University name/short name or university-level search text." },
          studyArea: { type: "STRING", description: "General study area or field when relevant." },
          city: { type: "STRING", description: "City/location filter when relevant." },
          limit: { type: "INTEGER", description: "Maximum records to return, between 1 and 8." },
        },
      },
    },
  ];

  if (enableWebSearch) {
    declarations.push({
      name: "search_current_web",
      description: "Get current public information when the answer depends on recent or time-sensitive information. Prefer official sources. Do not use this tool to reveal tuition-fee numbers.",
      parameters: {
        type: "OBJECT",
        properties: {
          query: { type: "STRING", description: "A concise current-information search question." },
        },
        required: ["query"],
      },
    });
  }

  return declarations;
}

function toGeminiHistory(history: Array<{ role: "user" | "assistant"; content: string }>, message: string): GeminiContent[] {
  return [
    ...history.map((item): GeminiContent => ({
      role: item.role === "assistant" ? "model" : "user",
      parts: [{ text: item.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];
}

class GeminiRequestError extends Error {
  status: number;
  code?: number;
  apiStatus?: string;

  constructor(message: string, status: number, code?: number, apiStatus?: string) {
    super(message);
    this.name = "GeminiRequestError";
    this.status = status;
    this.code = code;
    this.apiStatus = apiStatus;
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientGeminiStatus(status: number) {
  return status === 408 || status === 429 || status === 500 || status === 502 || status === 503 || status === 504;
}

function modelCandidates(primary: string) {
  const configuredFallbacks = (process.env.GEMINI_FALLBACK_MODELS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const fallbacks = configuredFallbacks.length ? configuredFallbacks : DEFAULT_GEMINI_FALLBACK_MODELS;
  return [...new Set([primary, ...fallbacks])].slice(0, 2);
}

async function callGeminiOnce(
  apiKey: string,
  model: string,
  contents: GeminiContent[],
  systemInstruction: string,
  functionDeclarations: Array<Record<string, unknown>>,
): Promise<GeminiResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);

  try {
    const response = await fetch(`${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents,
        tools: [{ functionDeclarations }],
        toolConfig: { functionCallingConfig: { mode: "AUTO" } },
        generationConfig: {
          temperature: 0.35,
          maxOutputTokens: 900,
        },
      }),
      signal: controller.signal,
    });

    const data = (await response.json()) as GeminiResponse;
    if (!response.ok || data.error) {
      throw new GeminiRequestError(
        data.error?.message || `Gemini API request failed with HTTP ${response.status}.`,
        response.status,
        data.error?.code,
        data.error?.status,
      );
    }
    return data;
  } catch (error) {
    if (error instanceof GeminiRequestError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new GeminiRequestError("Gemini request timed out.", 408);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function callGeminiWithRetry(
  apiKey: string,
  model: string,
  contents: GeminiContent[],
  systemInstruction: string,
  functionDeclarations: Array<Record<string, unknown>>,
): Promise<GeminiResponse> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= GEMINI_RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await callGeminiOnce(apiKey, model, contents, systemInstruction, functionDeclarations);
    } catch (error) {
      lastError = error;
      const status = error instanceof GeminiRequestError ? error.status : 0;
      if (!isTransientGeminiStatus(status) || attempt >= GEMINI_RETRY_DELAYS_MS.length) throw error;
      await sleep(GEMINI_RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError;
}

async function callGeminiInitial(
  apiKey: string,
  preferredModel: string,
  contents: GeminiContent[],
  systemInstruction: string,
  functionDeclarations: Array<Record<string, unknown>>,
): Promise<{ response: GeminiResponse; model: string }> {
  let lastError: unknown;

  for (const model of modelCandidates(preferredModel)) {
    try {
      const response = await callGeminiWithRetry(apiKey, model, contents, systemInstruction, functionDeclarations);
      return { response, model };
    } catch (error) {
      lastError = error;
      const status = error instanceof GeminiRequestError ? error.status : 0;
      // Authentication/permission and malformed-request errors will not improve by switching models.
      if (status === 400 || status === 401 || status === 403) throw error;
      console.warn(`YAZ Gemini model ${model} unavailable; trying fallback model`, error);
    }
  }

  throw lastError;
}

function extractText(response: GeminiResponse) {
  return (response.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text?.trim())
    .filter((value): value is string => Boolean(value))
    .join("\n\n")
    .trim();
}

function extractFunctionCalls(response: GeminiResponse) {
  return (response.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.functionCall)
    .filter((call): call is GeminiFunctionCall & { name: string } => Boolean(call?.name));
}

async function searchCurrentWeb(apiKey: string, model: string, query: string, locale: "en" | "ar") {
  const response = await fetch(`${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{
          text: `Answer in ${locale === "ar" ? "Arabic" : "English"}. Search for current public information and prioritize official sources. Never provide exact tuition-fee numbers. If the information cannot be verified, say so clearly. Return a concise factual summary suitable for another study-advisor model.`,
        }],
      },
      contents: [{ role: "user", parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 600 },
    }),
  });

  const data = (await response.json()) as GeminiResponse;
  if (!response.ok || data.error) {
    return { error: data.error?.message || `Web grounding failed with HTTP ${response.status}.` };
  }

  return {
    answer: extractText(data),
    note: "Current-information result produced with Gemini Google Search grounding. Tuition numbers must not be disclosed.",
  };
}

function normalizeToolArgs(args: Record<string, unknown> | undefined) {
  return (args ?? {}) as Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const message = body.message?.trim();
    const locale = body.locale === "ar" ? "ar" : "en";

    if (!message) return NextResponse.json({ error: "Message is required." }, { status: 400 });
    if (message.length > MAX_MESSAGE_LENGTH) return NextResponse.json({ error: "Message is too long." }, { status: 400 });

    const [programmes, universities] = await Promise.all([getProgrammes(), getUniversities()]);
    const history = (body.history ?? []).slice(-MAX_HISTORY);

    const fallbackIntent = contextualFallbackIntent(history, message, programmes, universities);
    const fallbackMatches = findAdvisorMatches(message, fallbackIntent, programmes, locale, 5);
    const fallbackAnswer = deterministicAdvisorAnswer(locale, fallbackIntent, fallbackMatches);

    // Fast path for clear catalogue requests. These do not need a model round-trip:
    // "SE in APU", "what about UTM?", "which universities have Cybersecurity?".
    // This makes common study searches respond almost immediately while Gemini remains
    // available for general questions, explanations and ambiguous requests.
    if (shouldUseFastCataloguePath(message, fallbackIntent)) {
      if (fallbackIntent.field || fallbackIntent.level || fallbackIntent.city) {
        const result = searchAdvisorProgrammes(programmes, {
          field: fallbackIntent.field,
          level: fallbackIntent.level,
          university: fallbackIntent.university,
          location: fallbackIntent.city,
          query: message,
          limit: 6,
        }, locale);
        return NextResponse.json({
          answer: fastProgrammeAnswer(locale, fallbackIntent, result.matches),
          matches: uniqueMatches(result.matches),
          intent: fallbackIntent,
          mode: "retrieval-fast",
          provider: "yaz-catalogue",
        });
      }

      if (fallbackIntent.university) {
        const universityResult = searchAdvisorUniversities(universities, {
          query: fallbackIntent.university,
          limit: 1,
        }, locale);
        const answer = fastUniversityAnswer(locale, universityResult);
        if (answer) {
          return NextResponse.json({
            answer,
            matches: [],
            intent: fallbackIntent,
            mode: "retrieval-fast",
            provider: "yaz-catalogue",
          });
        }
      }
    }

    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json({
        answer: fallbackAnswer,
        matches: fallbackMatches,
        intent: fallbackIntent,
        mode: "retrieval",
        provider: "none",
        fallbackReason: "missing_gemini_api_key",
      });
    }

    try {
      const preferredModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
      const enableWebSearch = process.env.YAZ_AI_WEB_SEARCH === "true";
      const functionDeclarations = buildFunctionDeclarations(enableWebSearch);
      const contents = toGeminiHistory(history, message);
      const cardMatches: AdvisorToolProgramme[] = [];

      const initial = await callGeminiInitial(
        apiKey,
        preferredModel,
        contents,
        advisorInstructions(locale),
        functionDeclarations,
      );
      let response = initial.response;
      const model = initial.model;

      for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
        const calls = extractFunctionCalls(response);
        if (!calls.length) break;

        const modelContent = response.candidates?.[0]?.content;
        if (modelContent) contents.push(modelContent);

        const functionResponseParts: GeminiPart[] = [];
        for (const call of calls) {
          const args = normalizeToolArgs(call.args);
          let result: Record<string, unknown>;

          if (call.name === "search_yaz_programmes") {
            const programmeResult = searchAdvisorProgrammes(programmes, args as unknown as ProgrammeSearchArgs, locale);
            cardMatches.push(...programmeResult.matches);
            result = programmeResult as unknown as Record<string, unknown>;
          } else if (call.name === "search_yaz_universities") {
            result = searchAdvisorUniversities(universities, args as unknown as UniversitySearchArgs, locale) as unknown as Record<string, unknown>;
          } else if (call.name === "search_current_web") {
            const query = typeof args.query === "string" ? args.query.trim() : "";
            result = query
              ? await searchCurrentWeb(apiKey, model, query, locale)
              : { error: "A web-search query is required." };
          } else {
            result = { error: "Unknown YAZ tool." };
          }

          functionResponseParts.push({
            functionResponse: {
              ...(call.id ? { id: call.id } : {}),
              name: call.name,
              response: result,
            },
          });
        }

        contents.push({ role: "user", parts: functionResponseParts });
        // Stay on the same model within a function-calling turn so Gemini 3 thought signatures remain valid.
        response = await callGeminiWithRetry(
          apiKey,
          model,
          contents,
          advisorInstructions(locale),
          functionDeclarations,
        );
      }

      const answer = extractText(response);
      return NextResponse.json({
        answer: answer || fallbackAnswer,
        matches: uniqueMatches(cardMatches),
        intent: fallbackIntent,
        mode: enableWebSearch ? "gemini-tools-web" : "gemini-tools",
        provider: "gemini",
        model,
      });
    } catch (error) {
      const messageText = error instanceof Error ? error.message : "Unknown Gemini error";
      console.error("YAZ Gemini AI call failed; using verified retrieval fallback", error);
      return NextResponse.json({
        answer: fallbackAnswer,
        matches: fallbackMatches,
        intent: fallbackIntent,
        mode: "retrieval",
        provider: "gemini",
        fallbackReason: messageText,
        fallbackCode: error instanceof GeminiRequestError ? error.status : undefined,
      });
    }
  } catch (error) {
    console.error("YAZ AI route error", error);
    return NextResponse.json({ error: "Unable to answer right now." }, { status: 500 });
  }
}
