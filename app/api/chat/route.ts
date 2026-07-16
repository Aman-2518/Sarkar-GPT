import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Scheme, UserProfile } from "@/lib/types";

// Simple in-memory response cache (resets on server restart). Keyed by question + scheme ids.
const cache = new Map<string, string>();

export async function POST(req: NextRequest) {
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey) {
    return NextResponse.json(
      { error: "Please configure GEMINI_API_KEY (free) or OPENAI_API_KEY in your .env file." },
      { status: 500 }
    );
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

  const cacheKey = `${question.trim().toLowerCase()}::${schemes.map((s) => s.id).join(",")}::${language || "en"}::${geminiKey ? "gemini" : "openai"}`;
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

  const systemInstruction =
    "You are SarkarGPT, an assistant that helps Indian citizens understand government schemes. " +
    "Only use the schemes provided in the context — never invent scheme names or benefits. " +
    "Be concise, plain-language, and practical. " +
    `CRITICAL: You must write your response in the language: ${language || "English"}. ` +
    "Use simple vocabulary suitable for general public understanding. Keep responses structured and brief.";

  // Option 1: Use Google Gemini API (Free Tier)
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
      
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ 
              text: `System Instruction: ${systemInstruction}\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${question}` 
            }] 
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 450
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to get response from Gemini API");
      }

      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response — please try again.";
      cache.set(cacheKey, answer);

      return NextResponse.json({ answer, cached: false });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      return NextResponse.json(
        { error: `AI Service Error (Gemini): ${err?.message || "Unknown error occurred"}` },
        { status: 502 }
      );
    }
  }

  // Option 2: Fallback to OpenAI (Paid/Credit based)
  try {
    const openai = new OpenAI({ apiKey: openaiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 450,
      messages: [
        {
          role: "system",
          content: systemInstruction,
        },
        { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${question}` },
      ],
    });

    const answer = completion.choices[0]?.message?.content ?? "I couldn't generate a response — please try again.";
    cache.set(cacheKey, answer);

    return NextResponse.json({ answer, cached: false });
  } catch (err: any) {
    console.error("OpenAI API error:", err);
    return NextResponse.json(
      { error: `AI Service Error (OpenAI): ${err?.message || "Unknown error occurred"}` },
      { status: 502 }
    );
  }
}
