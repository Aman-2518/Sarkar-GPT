"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, RotateCcw, Send, Trash2, Mic, MicOff, Volume2, VolumeX, Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import schemesData from "@/data/schemes.json";
import { ChatMessage, Scheme, UserProfile } from "@/lib/types";
import { useLanguage, configureSpeechUtterance } from "@/lib/languageContext";

const SUGGESTED = [
  "Which schemes help small farmers?",
  "Are there schemes for women entrepreneurs?",
  "What documents do I need for Ayushman Bharat?",
];

const schemes = schemesData as Scheme[];

interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

function parseMarkdown(text: string) {
  const lines = text.split("\n");
  
  return lines.map((line, index) => {
    const tokenRegex = /(\*\*.*?\*\*|\[.*?\]\(.*?\)|`[^`]+`)/g;
    const tokens = line.split(tokenRegex);
    
    const parsedLine = tokens.map((token, tIdx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return <strong key={tIdx} className="font-extrabold text-saffron-600 dark:text-saffron-400">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith("[") && token.includes("](")) {
        const closeBracketIdx = token.indexOf("](");
        const label = token.slice(1, closeBracketIdx);
        const url = token.slice(closeBracketIdx + 2, -1);
        return (
          <a
            key={tIdx}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-saffron-600 dark:text-saffron-400 underline hover:text-saffron-500 font-bold ml-1 inline-flex items-center gap-0.5"
          >
            {label}
          </a>
        );
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <span key={tIdx} className="bg-saffron-500/10 dark:bg-saffron-500/20 text-saffron-700 dark:text-saffron-300 px-1.5 py-0.5 rounded font-mono text-xs font-bold mx-0.5 border border-saffron-500/10">
            {token.slice(1, -1)}
          </span>
        );
      }
      return token;
    });

    if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
      const listContent = line.replace(/^\s*[\*\-]\s+/, "");
      const listTokens = listContent.split(tokenRegex).map((token, tIdx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return <strong key={tIdx} className="font-extrabold text-saffron-600 dark:text-saffron-400">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith("[") && token.includes("](")) {
          const closeBracketIdx = token.indexOf("](");
          const label = token.slice(1, closeBracketIdx);
          const url = token.slice(closeBracketIdx + 2, -1);
          return (
            <a
              key={tIdx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron-600 dark:text-saffron-400 underline hover:text-saffron-500 font-bold ml-1 inline-flex items-center gap-0.5"
            >
              {label}
            </a>
          );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
          return (
            <span key={tIdx} className="bg-saffron-500/10 dark:bg-saffron-500/20 text-saffron-700 dark:text-saffron-300 px-1.5 py-0.5 rounded font-mono text-xs font-bold mx-0.5 border border-saffron-500/10">
              {token.slice(1, -1)}
            </span>
          );
        }
        return token;
      });
      return (
        <li key={index} className="list-disc ml-5 mt-1 text-ink-900 dark:text-saffron-50/90">
          {listTokens}
        </li>
      );
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const listContent = line.replace(/^\s*\d+\.\s+/, "");
      const listTokens = listContent.split(tokenRegex).map((token, tIdx) => {
        if (token.startsWith("**") && token.endsWith("**")) {
          return <strong key={tIdx} className="font-extrabold text-saffron-600 dark:text-saffron-400">{token.slice(2, -2)}</strong>;
        }
        if (token.startsWith("[") && token.includes("](")) {
          const closeBracketIdx = token.indexOf("](");
          const label = token.slice(1, closeBracketIdx);
          const url = token.slice(closeBracketIdx + 2, -1);
          return (
            <a
              key={tIdx}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-saffron-600 dark:text-saffron-400 underline hover:text-saffron-500 font-bold ml-1 inline-flex items-center gap-0.5"
            >
              {label}
            </a>
          );
        }
        if (token.startsWith("`") && token.endsWith("`")) {
          return (
            <span key={tIdx} className="bg-saffron-500/10 dark:bg-saffron-500/20 text-saffron-700 dark:text-saffron-300 px-1.5 py-0.5 rounded font-mono text-xs font-bold mx-0.5 border border-saffron-500/10">
              {token.slice(1, -1)}
            </span>
          );
        }
        return token;
      });
      return (
        <li key={index} className="list-decimal ml-5 mt-1 text-ink-900 dark:text-saffron-50/90">
          {listTokens}
        </li>
      );
    }

    return (
      <p key={index} className="mt-1">
        {parsedLine}
      </p>
    );
  });
}

export default function ChatWindow() {
  const {
    language,
    t,
    currentSpeechLang,
    voiceGender,
    selectedVoiceName,
    autoPlaySpeech,
    soundEffects,
  } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgIndex, setSpeakingMsgIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    // Load profile from localStorage if it exists
    if (typeof window !== "undefined") {
      const savedProfile = localStorage.getItem("sarkargpt_profile");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile));
        } catch (e) {
          console.error("Failed to parse saved profile", e);
        }
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
        if (recognitionRef.current) recognitionRef.current.abort();
      }
    };
  }, []);

  const playChirp = (type: "send" | "reply") => {
    if (typeof window === "undefined" || !soundEffects) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "send") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(587, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {}
  };

  async function send(question: string) {
    if (!question.trim() || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: question }]);
    setLoading(true);
    playChirp("send");

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
    }

    const lower = question.toLowerCase();
    const matched = schemes.filter(
      (s) =>
        lower.includes(s.category.toLowerCase()) ||
        s.name.toLowerCase().split(" ").some((w) => w.length > 3 && lower.includes(w))
    );
    const relevant = (matched.length > 0 ? matched : schemes).slice(0, 6);

    const userKeys = {
      groq: typeof window !== "undefined" ? localStorage.getItem("sarkargpt_groq_key") || "" : "",
    };

    let replyContent = "Network error — please try again.";
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, profile, schemes: relevant, language, userKeys, history: messages }),
      });
      const data = await res.json();
      if (!res.ok) {
        replyContent = data.error ?? "Failed to get a response from the server.";
      } else {
        replyContent = data.answer ?? "Something went wrong.";
      }
    } catch {
    } finally {
      // Get the index of the newly added reply
      const newReplyIndex = messages.length + 1;
      setMessages((m) => [...m, { role: "assistant", content: replyContent }]);
      setLoading(false);
      playChirp("reply");
      if (autoPlaySpeech) {
        setTimeout(() => {
          toggleSpeakMessage(replyContent, newReplyIndex);
        }, 120);
      }
    }
  }

  function toggleSpeechInput() {
    if (typeof window === "undefined") return;
    
    const SpeechRecognition =
      (window as unknown as IWindow).SpeechRecognition ||
      (window as unknown as IWindow).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please try Google Chrome.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentSpeechLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const resultText = event.results[0][0].transcript;
      if (resultText) {
        setInput(resultText);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }

  const toggleSpeakMessage = (text: string, index: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speakingMsgIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingMsgIndex(null);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentSpeechLang;
      configureSpeechUtterance(utterance, voiceGender, selectedVoiceName);
      utterance.onend = () => setSpeakingMsgIndex(null);
      utterance.onerror = () => setSpeakingMsgIndex(null);
      setSpeakingMsgIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  function regenerate() {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser) {
      setMessages((m) => m.slice(0, -1));
      send(lastUser.content);
    }
  }

  const profileSummary = profile.state
    ? `${profile.state}, ${profile.age} yrs, ${profile.occupation || "Self-employed"}`
    : null;

  return (
    <div className="card mx-auto flex h-[70vh] max-w-2xl flex-col border border-neutral-200 dark:border-white/10 shadow-lg bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
        <div className="flex flex-col">
          <h2 className="font-display font-bold text-ink-900 dark:text-white">{t("chatHeader")}</h2>
          {profileSummary && (
            <span className="text-[11px] text-saffron-600 dark:text-saffron-400 font-medium flex items-center gap-1 mt-0.5">
              <Sparkles size={10} /> Profile active: {profileSummary}
            </span>
          )}
        </div>
        <button onClick={() => setMessages([])} className="text-xs flex items-center gap-1 text-ink-900/60 dark:text-saffron-50/60 hover:text-red-500 transition-colors">
          <Trash2 size={14} /> {t("clearBtn")}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-1 scrollbar-thin">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <p className="text-sm text-ink-900/60 dark:text-saffron-50/60 font-medium">{t("suggestedTitle")}</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {SUGGESTED.map((p) => (
                <button key={p} onClick={() => send(p)} className="rounded-full border border-saffron-500/20 px-3 py-1.5 text-xs bg-saffron-500/5 text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/10 font-medium transition-all">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.role === "user" ? "bg-warm-gradient text-white" : "bg-neutral-100 dark:bg-white/5 text-ink-900 dark:text-saffron-50/90"
                }`}
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <div className="flex flex-col gap-1">{parseMarkdown(m.content)}</div>
                )}
                {m.role === "assistant" && (
                  <div className="mt-2 flex gap-4 text-ink-900/40 dark:text-saffron-50/50">
                    <button
                      onClick={() => handleCopyMessage(m.content, i)}
                      title={copiedIndex === i ? "Copied!" : "Copy"}
                      aria-label={copiedIndex === i ? "Copied!" : "Copy"}
                      className="hover:text-saffron-600 transition-all flex items-center gap-1.5"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                    <button
                      onClick={() => toggleSpeakMessage(m.content, i)}
                      title={speakingMsgIndex === i ? t("stopRead") : t("readAloud")}
                      aria-label={speakingMsgIndex === i ? t("stopRead") : t("readAloud")}
                      className={`hover:text-saffron-600 transition-colors ${speakingMsgIndex === i ? "text-red-500" : ""}`}
                    >
                      {speakingMsgIndex === i ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    </button>
                    {i === messages.length - 1 && (
                      <button onClick={regenerate} title="Regenerate" aria-label="Regenerate" className="hover:text-saffron-600 transition-colors">
                        <RotateCcw size={13} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          {loading && <TypingIndicator />}
        </div>
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-neutral-200 dark:border-white/10 pt-3"
      >
        <button
          type="button"
          onClick={toggleSpeechInput}
          className={`btn-secondary !p-2 rounded-xl transition-all ${
            isListening ? "bg-red-500/10 border-red-500 text-red-500 animate-pulse" : "text-saffron-600 hover:bg-saffron-500/5"
          }`}
          title={isListening ? t("listening") : t("speakBtn")}
          aria-label={isListening ? t("listening") : t("speakBtn")}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isListening ? t("listening") : t("chatPlaceholder")}
          className="input flex-1"
          disabled={loading}
        />
        <button type="submit" className="btn-primary !px-4 !py-2.5 rounded-xl" aria-label="Send" disabled={loading || !input.trim()}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 rounded-2xl bg-neutral-100 dark:bg-white/5 px-4 py-3 w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-saffron-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
