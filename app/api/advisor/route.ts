import OpenAI from "openai";
import { NextResponse } from "next/server";
import { VERIFIED_AT, VERIFIED_UNIVERSITIES } from "@/data/verified-universities";

export const runtime = "nodejs";

type RequestBody = {
  message?: string;
  locale?: "en" | "ar";
  history?: Array<{ role: "user" | "assistant"; content: string }>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const message = body.message?.trim();
    const locale = body.locale === "ar" ? "ar" : "en";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error:
            locale === "ar"
              ? "تم تجهيز YAZ AI، لكن يلزم إضافة OPENAI_API_KEY في ملف .env.local لتفعيل الذكاء الاصطناعي الحقيقي."
              : "YAZ AI is wired up, but OPENAI_API_KEY must be added to .env.local to enable the live AI backend."
        },
        { status: 503 }
      );
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const history = (body.history ?? []).slice(-6);
    const verifiedData = JSON.stringify(
      {
        verifiedAt: VERIFIED_AT,
        universities: VERIFIED_UNIVERSITIES
      },
      null,
      2
    );

    const instructions = `You are YAZ AI, the study advisor for YAZ Education in Malaysia.
Respond in ${locale === "ar" ? "Arabic" : "English"} unless the user clearly requests another language.
Be concise, helpful and conversational.
For university-specific facts such as programme names, duration, intake dates, fees, campus and specialisations, use ONLY the verified dataset below.
If the requested fact is absent from the dataset, say that it is not yet in the verified YAZ database and suggest speaking with a YAZ advisor rather than guessing.
Never invent official partnerships, admissions guarantees, scholarships, rankings, fees or entry requirements.
When mentioning a fee or intake, state that it was last verified on ${VERIFIED_AT} and may change; recommend confirming before application.
For general study-planning questions you may give general guidance, but clearly separate that guidance from verified university facts.
Keep most answers under 180 words unless the user requests detail.

VERIFIED YAZ DATA:
${verifiedData}`;

    const conversation = [
      ...history.map((item) => `${item.role === "user" ? "USER" : "ASSISTANT"}: ${item.content}`),
      `USER: ${message}`
    ].join("\n\n");

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      reasoning: { effort: "low" },
      instructions,
      input: conversation
    });

    return NextResponse.json({ answer: response.output_text || "" });
  } catch (error) {
    console.error("YAZ AI error", error);
    return NextResponse.json({ error: "Unable to contact YAZ AI right now." }, { status: 500 });
  }
}
