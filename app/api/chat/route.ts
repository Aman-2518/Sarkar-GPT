import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Scheme, UserProfile } from "@/lib/types";

// Simple in-memory response cache (resets on server restart). Keyed by question + scheme ids.
const cache = new Map<string, string>();

export async function POST(req: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not configured on the server." }, { status: 500 });
  }

  const { question, profile, schemes, language } = (await req.json()) as {
    question: string;
    profile: Partial<UserProfile>;
    schemes: Scheme[];
    language?: string;
  };

  if (!question || !schemes) {
    return NextResponse.json({ error: "Missing question or schemes" }, { status: 400 });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const cacheKey = `${question.trim().toLowerCase()}::${schemes.map((s) => s.id).join(",")}::${language || "en"}`;
  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json({ answer: cached, cached: true });

  // Only the pre-filtered schemes (not the full catalog) and a minimal profile are sent — keeps tokens low.
  const context = {
    profile,
    schemes: schemes.map((s) => ({
      name: s.name,
      category: s.category,
      description: s.description,
      benefits: s.benefits,
      documents: s.documents,
    })),
  };

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 450,
      messages: [
        {
          role: "system",
          content:
            "You are SarkarGPT, an assistant that helps Indian citizens understand government schemes. " +
            "Only use the schemes provided in the context — never invent scheme names or benefits. " +
            "Be concise, plain-language, and practical. " +
            `CRITICAL: You must write your response in the language: ${language || "English"}. ` +
            "Use simple vocabulary suitable for general public understanding. Keep responses structured and brief to save tokens.",
        },
        { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}` },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "I couldn't generate a response — please try again.";
    cache.set(cacheKey, answer);

    return NextResponse.json({ answer, cached: false });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: "Failed to get a response from the AI service. Please try again in a moment." },
      { status: 502 }
    );
  }
}
