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

  const { question, profile, schemes, language, userKeys, history } = (await req.json()) as {
    question: string;
    profile: Partial<UserProfile>;
    schemes: Scheme[];
    language?: string;
    userKeys?: {
      groq?: string;
    };
    history?: { role: "user" | "assistant"; content: string }[];
  };

  const rawGroqKey = userKeys?.groq?.trim() || "";
  const envGroqKey = process.env.GROQ_API_KEY?.trim() || "";
  const groqKey = rawGroqKey || envGroqKey;

  if (!groqKey) {
    return NextResponse.json(
      { error: "Please configure Groq API key in Settings or .env file to enable AI chat." },
      { status: 500 }
    );
  }


  if (!question || !schemes) {
    return NextResponse.json({ error: "Missing question or schemes" }, { status: 400 });
  }

  // 2. Input Sanitization & Length Restriction (Vulnerability Fix)
  const sanitizedQuestion = question.trim().slice(0, 500);

  // Define cache key with profile details and active provider combination
  const activeProvider = "groq";
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
      applyUrl: s.applyUrl,
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
    "You are SarkarGPT, a professional, polite, and reassuring virtual assistant that helps Indian citizens understand government schemes. " +
    "Only use the schemes provided in the context — never invent scheme names or benefits. " +
    "Maintain a highly respectful, empathetic, and professional tone throughout the interaction. Use clear, easy-to-understand language. " +
    "IMPORTANT: You must guide the user step-by-step through a conversational flow. Follow these rules strictly based on the conversation history: " +
    "Rule 1. When the user first asks about a scheme (or asks 'which scheme'): " +
    "   - Welcomely introduce that scheme name and its brief description. " +
    "   - Bold the actual scheme name (e.g. **PM Kisan Samman Nidhi**), but NEVER bold generic words like 'scheme' or 'government'. " +
    "   - DO NOT show benefits or required documents yet. " +
    "   - Ask the user politely: \"Would you like to know more about the details and benefits of this scheme?\" " +
    "Rule 2. If the user has just agreed or replied positively to knowing about the scheme and benefits (look at the history): " +
    "   - Provide detailed info about the scheme and its benefits. " +
    "   - Bold specific benefits, and wrap key figures, numbers, amounts, dates, and milestones in backticks (e.g., `Rs. 6,000` or `18 years`) to highlight them. Do NOT wrap generic words or long sentences in backticks. " +
    "   - DO NOT show the required documents or the application URL yet. " +
    "   - Ask the user politely: \"Would you like to know the required documents to apply for this scheme?\" " +
    "Rule 3. If the user has just agreed or replied positively to knowing the documents required: " +
    "   - Provide the complete list of required documents under a 'Documents Required' heading. " +
    "   - Provide the application link from the context's `applyUrl` using a professional markdown link (e.g., `[Apply/Register Here](applyUrl)`). " +
    `CRITICAL: You must write your response in the language: ${language || "English"}. ` +
    "Keep responses structured, professional, and aligned with these stages. " +
    profileContextString;

  // 4. Smart Failover Router Chain
  const errors: string[] = [];

  // Try Groq First (Free, Llama 3.1)
  if (groqKey) {
    const keysToTry = [rawGroqKey, envGroqKey].filter((k) => k !== "");
    const uniqueKeys = Array.from(new Set(keysToTry));

    for (const key of uniqueKeys) {
      try {
        const groq = new OpenAI({
          apiKey: key,
          baseURL: "https://api.groq.com/openai/v1",
        });

        const requestMessages: any[] = [{ role: "system", content: systemInstruction }];
        if (history && history.length > 0) {
          for (const msg of history) {
            requestMessages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
          }
        }
        requestMessages.push({ role: "user", content: `Context: ${JSON.stringify(context)}\n\nQuestion: ${sanitizedQuestion}` });

        const completion = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          temperature: 0.3,
          max_tokens: 450,
          messages: requestMessages,
        });

        const answer = completion.choices[0]?.message?.content ?? "";
        if (answer) {
          cache.set(cacheKey, answer);
          return NextResponse.json({ answer, cached: false, provider: "groq" });
        }
      } catch (err: any) {
        const isCustom = key === rawGroqKey;
        console.warn(`Groq (${isCustom ? "custom" : "env"}) failed, falling back...`, err.message);
        errors.push(`Groq (${isCustom ? "custom" : "env"}): ${err?.message || "Error"}`);
      }
    }
  }

  // If all active keys failed, return combined diagnostic report
  return NextResponse.json(
    { error: `AI service unavailable. Details: [${errors.join(" | ")}]` },
    { status: 502 }
  );
}