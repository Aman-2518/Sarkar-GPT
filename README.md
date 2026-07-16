# SarkarGPT (lean prototype)

A minimal, hackathon-ready MVP for discovering Indian government schemes conversationally.

## What's included (scoped for a low-cost prototype)
- **Home** — hero, features, 3-step workflow, FAQ
- **Find Schemes** — 3-step eligibility wizard → local (zero-API-cost) matching against `data/schemes.json`
- **AI Chat** — lazy-loaded, calls `/api/chat` (Next.js API route, not a separate Express server) only on submit, never while typing
- Dark mode, glassmorphism cards, warm-orange theme, Framer Motion transitions
- In-memory response cache on the API route (same question + same filtered schemes = no repeat API call)

## Deliberately left out of this prototype (see "Future Scope")
Voice input, PDF export, QR codes, PWA manifest, Supabase/Firebase auth & persistence, OCR, DigiLocker/Aadhaar verification, WhatsApp bot, SMS reminders, AI auto form-filling. These are straightforward to layer on top of this structure later without a rewrite.

## Setup
```bash
npm install
cp .env.example .env.local   # add your OPENAI_API_KEY
npm run dev
```

## Why this keeps AI cost low
1. Eligibility matching (`lib/filterSchemes.ts`) runs entirely in the browser — no API call.
2. Chat only calls OpenAI on message *submit*, never on keystroke.
3. Only the locally pre-filtered schemes (not the full catalog) plus a minimal profile are sent as context.
4. Identical questions against the same filtered scheme set are served from an in-memory cache.
5. `gpt-4o-mini` with `max_tokens: 400` keeps per-call cost minimal.
6. The chat module is lazy-loaded, so its JS bundle only loads for users who open `/chat`.

## Folder structure
```
app/            Next.js App Router pages + API route
components/     Reusable UI components
lib/            Types + pure filtering logic
data/           schemes.json (edit this to add/remove schemes — no code changes needed)
```
