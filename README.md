# SarkarGPT 🇮🇳 — Voice-Guided Government Schemes Assistant

SarkarGPT is a creative, highly interactive web application designed to help Indian citizens discover and understand government schemes they are eligible for. The platform is designed with accessibility at its core, featuring multi-language translations and full voice guidance to assist users of all literacy levels.

---

## 🌟 Key Features

### 🎙️ 1. Complete Voice-Assisted Accessibility
- **Floating Voice Navigator Assistant**: A floating helper widget that provides page audio introductions in the user's active language and listens to voice commands (Speech-to-Text) for hands-free site navigation (e.g. say *"Go to chat"* or *"चैट"*).
- **Text-to-Speech (Read Aloud)**: Click the speaker icons next to scheme cards or AI chat messages to hear titles, benefits, documents, and instructions read out loud.
- **Speech-to-Text (Voice Input)**: Speak directly into the AI chat window instead of typing.

### 🌐 2. Multi-Language Support (15 Indian Languages)
- Real-time translations of the interface, form questions, and AI chat responses into:
  * *English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Urdu, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, and Sanskrit*.

### ⚡ 3. Profile-Aware Smart AI Chat
- Once eligibility questionnaire parameters are entered, they are persisted locally.
- The AI chat window auto-loads this profile, greets the user with an active status chip, and references demographic parameters (age, state, occupation, income) to customize eligibility advice.

### 🔒 4. Hardened Security & Robustness
- **In-Memory Rate Limiting**: Protects your API keys by limiting clients to a maximum of 15 queries per minute.
- **Input Sanitization**: Truncates queries to 500 characters to prevent prompt injection and token bloat.
- **Smart LLM Failover Router Chain**: Prioritizes queries through configured API keys to minimize cost and ensure 100% uptime:
  1. **Groq (Llama 3.1)** ➔ *Fastest & Free*
  2. **Google Gemini (v1beta)** ➔ *Fallback (Free)*
  3. **OpenAI (GPT-4o-mini)** ➔ *Paid Backup*

### 📁 5. Persistent Bookmarks & Document Guides
- **Saves Manager**: Click the bookmark icon on any card to save it. View and filter your bookmarked schemes anytime.
- **Document Guides**: Click on required documents (Aadhaar, Caste Certificate, Land Records, etc.) to open a detailed drawer outlining:
  * *What it is, how to get it, fees, processing timelines, and official links.*

---

## 🛠️ Local Installation & Setup

### Prerequisites
- Node.js (v18.x or later)
- npm (v9.x or later)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Aman-2518/Sarkar-GPT.git
   cd Sarkar-GPT
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   # Add at least one of these keys (Groq is recommended for free, fast performance)
   GROQ_API_KEY=gsk_your_key_here
   GEMINI_API_KEY=AIzaSy_your_key_here
   OPENAI_API_KEY=sk-proj_your_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## ☁️ Deployment (Vercel)

Every push to the `main` branch automatically deploys the site to Vercel. 

### Critical Step for Deployment:
To ensure the AI chatbot works online:
1. Go to your **Vercel Project Dashboard** ➔ **Settings** ➔ **Environment Variables**.
2. Add your active API keys (`GROQ_API_KEY`, `GEMINI_API_KEY`, or `OPENAI_API_KEY`).
3. Redeploy your latest deployment to apply the keys.

---

## 📁 Project Structure

```
├── app/                  # App Router pages and API routes
│   ├── api/chat/route.ts # Server-side API with failovers and rate limiting
│   ├── find-schemes/     # Eligibility Finder interface
│   └── chat/             # AI Assistant interface
├── components/           # UI Elements (Navbar, Scheme Cards, Voice Navigator)
├── data/                 # Static JSON databases (schemes.json, documentGuides.json)
├── lib/                  # Context providers, language keys, and filtering engines
└── public/               # Static assets and icons
```
