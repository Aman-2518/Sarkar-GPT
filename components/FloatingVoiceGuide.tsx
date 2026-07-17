"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Volume2, VolumeX, Mic, MicOff, HelpCircle, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage, configureSpeechUtterance } from "@/lib/languageContext";

// Localized helper announcements for pages (warm, soft, humanized Indian tone)
const NAV_INTRODUCTIONS: Record<string, Record<string, string>> = {
  en: {
    "/": "Namaste ji. Welcome to SarkarGPT. I am your personal guide for government schemes. You can click on 'Find my schemes' to check which schemes are right for you, or you can click 'Ask SarkarGPT' to chat with me directly. I am here to help you, okay?",
    "/find-schemes": "You are on the scheme finder page now. Don't worry, it is very simple. Just fill three easy steps — your state, your age, your work, and your income. I will instantly show you all the schemes that match your profile. If you want me to read any question aloud, just tap the speaker icon next to it.",
    "/chat": "You are on the AI Chat page. You can ask me anything about government schemes in Hindi, English, or any language you are comfortable with. Just type your question, or tap the microphone and speak to me directly. I will explain everything step by step.",
  },
  hi: {
    "/": "नमस्ते जी। सरकारजीपीटी में आपका स्वागत है। मैं सरकारी योजनाओं के लिए आपका व्यक्तिगत गाइड हूँ। आप 'मेरी योजनाएं खोजें' पर क्लिक करके देख सकते हैं कि कौन सी योजनाएं आपके लिए सही हैं, या 'सरकारजीपीटी से पूछें' पर क्लिक करके मुझसे सीधे बात कर सकते हैं। मैं आपकी मदद के लिए यहाँ हूँ।",
    "/find-schemes": "आप अभी योजना खोजक पृष्ठ पर हैं। चिंता मत कीजिए, यह बहुत आसान है। बस तीन आसान चरणों में अपना राज्य, उम्र, काम और आय की जानकारी भरिए। मैं तुरंत आपको वो सभी योजनाएं दिखाऊंगा जो आपके लिए बनी हैं। अगर कोई सवाल सुनना चाहें तो उसके पास वाले स्पीकर आइकन पर टैप कीजिए।",
    "/chat": "आप एआई चैट पेज पर हैं। आप मुझसे हिंदी, अंग्रेजी या किसी भी भाषा में सरकारी योजनाओं के बारे में कुछ भी पूछ सकते हैं। बस अपना सवाल टाइप करें, या माइक पर टैप करके मुझसे सीधे बोलिए। मैं सब कुछ आपको कदम दर कदम समझाऊंगा।",
  },
};

// Short auto-greetings (spoken once per session — warm, soft, humanized Indian tone)
const AUTO_GREETINGS: Record<string, string> = {
  en: "Namaste ji. Welcome to SarkarGPT. I am here to help you find the right government schemes for you and your family. Just tap the orange button whenever you need my help, okay?",
  hi: "नमस्ते जी। सरकारजीपीटी में आपका स्वागत है। मैं यहाँ हूँ आपकी और आपके परिवार की सही सरकारी योजनाएं ढूंढने में मदद करने के लिए। जब भी मदद चाहिए, बस ऑरेंज बटन दबा दीजिए।",
};

export default function FloatingVoiceGuide() {
  const { language, currentSpeechLang, t, voiceGender, selectedVoiceName } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [hasGreeted, setHasGreeted] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Auto-greeting on first visit (once per session, after splash screen)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (sessionStorage.getItem("sarkargpt_voice_greeted")) {
      setHasGreeted(true);
      return;
    }

    // Delay greeting to play after splash screen finishes (2.5s)
    const greetTimer = setTimeout(() => {
      const greetText = AUTO_GREETINGS[language] || AUTO_GREETINGS["en"];
      const utterance = new SpeechSynthesisUtterance(greetText);
      utterance.lang = currentSpeechLang;
      configureSpeechUtterance(utterance, voiceGender, selectedVoiceName);
      utterance.rate = 0.95;
      utterance.onend = () => {
        setIsSpeaking(false);
        setHasGreeted(true);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setHasGreeted(true);
      };
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
      sessionStorage.setItem("sarkargpt_voice_greeted", "true");
    }, 2800);

    return () => clearTimeout(greetTimer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Hide label after 5 seconds
  useEffect(() => {
    const labelTimer = setTimeout(() => setShowLabel(false), 6000);
    return () => clearTimeout(labelTimer);
  }, []);

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
    configureSpeechUtterance(utterance, voiceGender, selectedVoiceName);
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
      setFeedbackMsg(language === "hi" ? "सुन रहा हूँ... अब बोलें" : "Listening for commands...");
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setFeedbackMsg(`"${command}"`);

      // Navigation command processing (supports English and Hindi)
      if (command.includes("chat") || command.includes("चैट") || command.includes("सहेजें") || command.includes("पूछें") || command.includes("बात")) {
        router.push("/chat");
        setFeedbackMsg(language === "hi" ? "चैट पर जा रहे हैं..." : "Navigating to AI Chat...");
      } else if (command.includes("scheme") || command.includes("योजना") || command.includes("खोजें") || command.includes("पात्रता") || command.includes("find")) {
        router.push("/find-schemes");
        setFeedbackMsg(language === "hi" ? "योजना खोजक पर जा रहे हैं..." : "Navigating to Scheme Finder...");
      } else if (command.includes("home") || command.includes("मुख्य") || command.includes("घर") || command.includes("सत्कार") || command.includes("होम")) {
        router.push("/");
        setFeedbackMsg(language === "hi" ? "होम पर जा रहे हैं..." : "Navigating Home...");
      } else if (command.includes("help") || command.includes("मदद") || command.includes("सहायता")) {
        speakGuide();
        setFeedbackMsg(language === "hi" ? "पेज निर्देश पढ़ रहा हूँ..." : "Reading page instructions...");
      } else {
        setFeedbackMsg(language === "hi"
          ? `"${command}" — "चैट", "योजना", या "होम" बोलें`
          : `"${command}" — Try: "chat", "scheme", or "home"`
        );
      }
    };

    recognition.onerror = (e: any) => {
      setIsListening(false);
      setFeedbackMsg(language === "hi" ? "त्रुटि। कृपया पुनः प्रयास करें।" : "Speech error. Please try again.");
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
              <span className="font-bold text-xs text-neutral-800 dark:text-white">🇮🇳 Indian Voice Guide</span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              {language === "hi"
                ? "पेज निर्देश सुनें या हिंदी/अंग्रेजी वॉइस कमांड से नेविगेट करें।"
                : "Listen to page instructions in Indian accent or navigate using Hindi/English voice commands."}
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
                {isSpeaking
                  ? (language === "hi" ? "वॉइस रोकें" : "Stop Voice Help")
                  : (language === "hi" ? "📢 पेज निर्देश सुनें" : "📢 Read Page Instructions")}
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
                {language === "hi" ? "🎙️ वॉइस नेविगेशन" : "🎙️ Voice Navigate"}
              </button>
            </div>

            {/* Voice Feedback Text */}
            {feedbackMsg && (
              <p className="text-[10px] text-center font-medium py-1 px-2 rounded bg-neutral-100 dark:bg-white/5 text-saffron-700 dark:text-saffron-400">
                {feedbackMsg}
              </p>
            )}

            <div className="text-[10px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-100 dark:border-white/5 pt-2 flex flex-col gap-0.5">
              <span className="font-semibold">{language === "hi" ? "वॉइस कमांड सूची:" : "Voice Commands:"}</span>
              <span>• &quot;Chat&quot; / &quot;चैट&quot; / &quot;बात करो&quot;</span>
              <span>• &quot;Find schemes&quot; / &quot;योजना खोजें&quot;</span>
              <span>• &quot;Home&quot; / &quot;होम&quot; / &quot;मुख्य पृष्ठ&quot;</span>
              <span>• &quot;Help&quot; / &quot;मदद&quot;</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Label + Action Button */}
      <div className="flex items-center gap-2">
        {/* Animated "Indian Voice Guide" label */}
        <AnimatePresence>
          {showLabel && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ delay: 2.5, duration: 0.4 }}
              className="bg-white dark:bg-zinc-800 border border-saffron-500/30 shadow-lg rounded-full px-3 py-1.5 text-[10px] font-bold text-saffron-700 dark:text-saffron-300 whitespace-nowrap"
            >
              🇮🇳 {language === "hi" ? "वॉइस गाइड" : "Indian Voice Guide"}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center h-12 w-12 rounded-full bg-warm-gradient text-white shadow-xl focus:outline-none relative border border-white/20"
          aria-label="Toggle Indian Voice Guide"
        >
          {isListening || isSpeaking ? (
            <div className="absolute inset-0 rounded-full bg-saffron-500 animate-ping opacity-25" />
          ) : null}
          
          {isListening ? <Mic size={20} /> : isSpeaking ? <Volume2 size={20} /> : <Navigation size={20} />}
        </motion.button>
      </div>
    </div>
  );
}
