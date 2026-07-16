"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Volume2, VolumeX, Mic, MicOff, HelpCircle, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/languageContext";

// Localized helper announcements for pages
const NAV_INTRODUCTIONS: Record<string, Record<string, string>> = {
  en: {
    "/": "Welcome to SarkarGPT. I will help you find government schemes you qualify for. Click 'Find my schemes' to fill out the form, or click 'Ask SarkarGPT' to start chatting.",
    "/find-schemes": "You are on the scheme finder page. Fill out the three steps with your state, age, occupation, and income. If you qualify for any schemes, they will show up instantly. You can click the speaker icon on any question to hear it aloud.",
    "/chat": "You are on the AI Chat assistant. Click the microphone icon at the bottom of the screen to speak your question, or type it in. I will help you understand any scheme details or document requirements.",
  },
  hi: {
    "/": "सरकारजीपीटी में आपका स्वागत है। मैं आपकी पात्रता वाली सरकारी योजनाओं को खोजने में मदद करूँगा। फ़ॉर्म भरने के लिए 'मेरी योजनाएं खोजें' पर क्लिक करें, या चैट शुरू करने के लिए 'सरकारजीपीटी से पूछें' पर क्लिक करें।",
    "/find-schemes": "आप योजना खोजक पृष्ठ पर हैं। तीन चरणों में अपने राज्य, आयु, व्यवसाय और आय की जानकारी भरें। आपकी पात्रता वाली योजनाएं तुरंत दिखाई देंगी। आप किसी भी प्रश्न को सुनने के लिए उसके पास वाले स्पीकर आइकन पर क्लिक कर सकते हैं।",
    "/chat": "आप एआई चैट सहायक पर हैं। प्रश्न पूछने के लिए स्क्रीन के नीचे माइक्रोफ़ोन आइकन पर क्लिक करें और बोलें। मैं आपको किसी भी योजना के विवरण या आवश्यक दस्तावेजों को समझने में मदद करूँगा।",
  },
};

export default function FloatingVoiceGuide() {
  const { language, currentSpeechLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Stop speaking when path changes
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [pathname]);

  const speakGuide = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const introductions = NAV_INTRODUCTIONS[language] || NAV_INTRODUCTIONS["en"];
    const text = introductions[pathname] || introductions["/"];

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentSpeechLang;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const startVoiceNavigation = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setFeedbackMsg("Mic not supported in this browser");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const recognition = new SpeechRecognition();
    recognition.lang = currentSpeechLang;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setFeedbackMsg("Listening for navigation commands...");
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setFeedbackMsg(`Recognized: "${command}"`);

      // Simple navigation command processing (supports English and Hindi matches)
      if (command.includes("chat") || command.includes("चैट") || command.includes("सहेजें") || command.includes("पूछें")) {
        router.push("/chat");
        setFeedbackMsg("Navigating to AI Chat...");
      } else if (command.includes("scheme") || command.includes("योजना") || command.includes("खोजें") || command.includes("पात्रता")) {
        router.push("/find-schemes");
        setFeedbackMsg("Navigating to Scheme Finder...");
      } else if (command.includes("home") || command.includes("मुख्य") || command.includes("घर") || command.includes("सत्कार")) {
        router.push("/");
        setFeedbackMsg("Navigating Home...");
      } else {
        setFeedbackMsg(`Unknown command: "${command}". Try: "chat", "scheme", or "home"`);
      }
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      setFeedbackMsg("Speech error. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Help Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="card max-w-xs shadow-xl p-4 bg-white/95 dark:bg-zinc-900/95 border border-saffron-500/30 flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-white/5 pb-2">
              <HelpCircle className="text-saffron-600 shrink-0" size={16} />
              <span className="font-bold text-xs text-neutral-800 dark:text-white">Voice Help Desk</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Listen to page instructions or navigate the site using simple voice commands.
            </p>

            <div className="flex flex-col gap-2">
              {/* Speak page help button */}
              <button
                onClick={speakGuide}
                className={`text-xs py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-all ${
                  isSpeaking
                    ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400"
                    : "bg-saffron-500/10 border-saffron-500/20 text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/20"
                }`}
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
                {isSpeaking ? "Stop Voice Help" : "Read Page Instructions"}
              </button>

              {/* Navigation Commands Mic */}
              <button
                onClick={startVoiceNavigation}
                className={`text-xs py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-2 transition-all ${
                  isListening
                    ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400 animate-pulse"
                    : "bg-saffron-500/10 border-saffron-500/20 text-saffron-800 dark:text-saffron-300 hover:bg-saffron-500/20"
                }`}
              >
                {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                Voice Navigate
              </button>
            </div>

            {/* Voice Feedback Text */}
            {feedbackMsg && (
              <p className="text-[10px] text-center font-medium py-1 px-2 rounded bg-neutral-100 dark:bg-white/5 text-saffron-700 dark:text-saffron-400">
                {feedbackMsg}
              </p>
            )}

            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-white/5 pt-2 flex flex-col gap-0.5">
              <span className="font-semibold">Voice Commands list:</span>
              <span>• "Go to chat" / "चैट"</span>
              <span>• "Find schemes" / "योजना"</span>
              <span>• "Home" / "मुख्य पृष्ठ"</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center h-12 w-12 rounded-full bg-warm-gradient text-white shadow-xl focus:outline-none relative border border-white/20"
        aria-label="Toggle Voice Assistant Help"
      >
        {isListening || isSpeaking ? (
          <div className="absolute inset-0 rounded-full bg-saffron-500 animate-ping opacity-25" />
        ) : null}
        
        {isListening ? <Mic size={20} /> : isSpeaking ? <Volume2 size={20} /> : <Navigation size={20} />}
      </motion.button>
    </div>
  );
}
