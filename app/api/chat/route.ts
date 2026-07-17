import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Scheme, UserProfile } from "@/lib/types";

// In-memory cache for responses
const cache = new Map<string, string>();

// Simple in-memory rate limiter (resets on server restart)
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limitData = ipRequestCounts.get(ip);

  if (!limitData || now > limitData.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  limitData.count += 1;
  if (limitData.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  return false;
}

export async function POST(req: NextRequest) {
  // 1. IP-based Rate Limiting (Vulnerability Fix)
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.ip || "127.0.0.1";
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute before asking again." },
      { status: 429 }
    );
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!geminiKey && !openaiKey && !groqKey) {
    return NextResponse.json(
      { error: "Please configure GROQ_API_KEY (free), GEMINI_API_KEY (free), or OPENAI_API_KEY in your .env file." },
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

  // 2. Input Sanitization & Length Restriction (Vulnerability Fix)
  const sanitizedQuestion = question.trim().slice(0, 500);

  // Define cache key with profile details and active provider combination
  const activeProvider = groqKey ? "groq" : geminiKey ? "gemini" : "openai";
  const profileKey = JSON.stringify(profile ?? {});
  const cacheKey = `${sanitizedQuestion.toLowerCase()}::${schemes.map((s) => s.id).join(",")}::${profileKey}::${language || "en"}::${activeProvider}`;

  const cached = cache.get(cacheKey);
  if (cached) return NextResponse.json({ answer: cached, cached: true });

  const context = {
    profile,
    schemes: schemes.map((s) => ({
      name: s.name,
      category: s.category,
      description: s.description,
      benefits: s.benefits,
      documents: s.documents,
      eligibilityCriteria: s.eligibilityCriteria,
      amountDetails: s.amountDetails,
      applicationSteps: s.applicationSteps,
      extraIntel: s.extraIntel,
    })),
  };

  // 3. Profile-Aware system instruction personalization
  let profileContextString = "";
  if (profile && Object.keys(profile).length > 0) {
    profileContextString = `The user's demographics are: State: ${profile.state || "Not specified"}, ` +
      `Age: ${profile.age || "Not specified"}, Gender: ${profile.gender || "Not specified"}, ` +
      `Occupation: ${profile.occupation || "Not specified"}, Income: ₹${profile.income || "Not specified"}/year. ` +
      `Special details: Farmer: ${profile.isFarmer ? "Yes" : "No"}, Student: ${profile.isStudent ? "Yes" : "No"}, ` +
      `Startup: ${profile.isStartupFounder ? "Yes" : "No"}, MSME: ${profile.isMsmeOwner ? "Yes" : "No"}, ` +
      `Disability: ${profile.hasDisability ? "Yes" : "No"}, Senior: ${profile.isSeniorCitizen ? "Yes" : "No"}. ` +
      `Address the user accordingly and tailor scheme eligibility answers directly to these parameters.`;
  }

  const systemInstruction =
    "You are SarkarGPT, an assistant that helps Indian citizens understand government schemes. " +
    "Only use the schemes provided in the context — never invent scheme names or benefits. " +
    "Be concise, plain-language, and practical. " +
    "IMPORTANT: Whenever you mention or recommend a scheme, you MUST list ALL the required documents needed to apply. " +
    "Always present documents as a clear bulleted list under a 'Documents Required' heading so the user knows exactly what to prepare. " +
    `CRITICAL: You must write your response in the language: ${language || "English"}. ` +
    "Use simple vocabulary suitable for general public understanding. Keep responses structured and brief. " +
    profileContextString;

  // 4. Smart Failover Router Chain
  const errors: string[] = [];

  // Try Groq First (Free, Llama 3.1)
  if (groqKey) {
    try {
      const groq = new OpenAI({
        apiKey: groqKey,
        baseURL: "https://api.groq.com/openai/v1",
      });

      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 450,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${sanitizedQuestion}` },
        ],
      });

      const answer = completion.choices[0]?.message?.content ?? "";
      if (answer) {
        cache.set(cacheKey, answer);
        return NextResponse.json({ answer, cached: false, provider: "groq" });
      }
    } catch (err: any) {
      console.warn("Groq failed, falling back...", err.message);
      errors.push(`Groq: ${err?.message || "Error"}`);
    }
  }

  // Try Gemini Second (Free, Gemini Flash)
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `System Instruction: ${systemInstruction}\n\nContext: ${JSON.stringify(context)}\n\nQuestion: ${sanitizedQuestion}`
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

      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
      if (answer) {
        cache.set(cacheKey, answer);
        return NextResponse.json({ answer, cached: false, provider: "gemini" });
      }
    } catch (err: any) {
      console.warn("Gemini failed, falling back...", err.message);
      errors.push(`Gemini: ${err?.message || "Error"}`);
    }
  }

  // Try OpenAI Third (Paid, GPT-4o-mini)
  if (openaiKey) {
    try {
      const openai = new OpenAI({ apiKey: openaiKey });
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 450,
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${sanitizedQuestion}` },
        ],
      });

      const answer = completion.choices[0]?.message?.content ?? "";
      if (answer) {
        cache.set(cacheKey, answer);
        return NextResponse.json({ answer, cached: false, provider: "openai" });
      }
    } catch (err: any) {
      console.warn("OpenAI failed...", err.message);
      errors.push(`OpenAI: ${err?.message || "Error"}`);
    }
  }

  // If all active keys failed, return combined diagnostic report
  return NextResponse.json(
    { error: `AI service unavailable. Details: [${errors.join(" | ")}]` },
    { status: 502 }
  );
}