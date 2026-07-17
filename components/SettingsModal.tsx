"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Sun, Moon, Trash2, Check, Languages, Settings2 } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/languageContext";
import { useEffect, useState } from "react";

const sectionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.35, ease: "easeOut" },
  }),
};

function AnimatedToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
        enabled ? "bg-saffron-500" : "bg-neutral-300 dark:bg-white/15"
      }`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="bg-white w-5 h-5 rounded-full shadow-md"
        style={{ marginLeft: enabled ? "auto" : 0 }}
      />
    </button>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      className={`relative py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all overflow-hidden ${className} ${
        selected
          ? "border-saffron-500 text-saffron-800 dark:text-saffron-400"
          : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
      }`}
    >
      {/* Animated fill background */}
      <motion.div
        initial={false}
        animate={{
          scaleX: selected ? 1 : 0,
          opacity: selected ? 1 : 0,
        }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-saffron-500/10 origin-left"
      />
      <span className="relative z-10 flex items-center justify-center gap-1.5">
        {children}
      </span>
    </motion.button>
  );
}

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const {
    language,
    setLanguage,
    voiceGender,
    setVoiceGender,
    selectedVoiceName,
    setSelectedVoiceName,
    availableVoices,
    fontSize,
    setFontSize,
    autoPlaySpeech,
    setAutoPlaySpeech,
    soundEffects,
    setSoundEffects,
    t,
  } = useLanguage();

  const [theme, setThemeState] = useState<"light" | "dark">("dark");
  const [resetSuccess, setResetSuccess] = useState(false);

  // Initialize theme state from DOM class
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setThemeState(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = (selectedTheme: "light" | "dark") => {
    if (typeof window === "undefined") return;
    setThemeState(selectedTheme);
    if (selectedTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("sarkargpt_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("sarkargpt_theme", "light");
    }
  };

  const handleResetData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("sarkargpt_profile");
    localStorage.removeItem("sarkargpt_saved_schemes");
    localStorage.removeItem("sarkargpt_voice_gender");
    localStorage.removeItem("sarkargpt_selected_voice_name");
    localStorage.removeItem("sarkargpt_font_size");
    localStorage.removeItem("sarkargpt_autoplay");
    localStorage.removeItem("sarkargpt_sounds");
    
    // Reset to local defaults
    setVoiceGender("female");
    setSelectedVoiceName("");
    setFontSize("normal");
    setAutoPlaySpeech(false);
    setSoundEffects(true);
    
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Settings Modal Container */}
      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0, rotateX: 8 }}
        animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
        exit={{ scale: 0.9, y: 30, opacity: 0, rotateX: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl p-0 transition-colors duration-200 text-neutral-900 dark:text-neutral-100"
      >
        {/* Decorative gradient strip at top */}
        <motion.div
          className="h-1 bg-warm-gradient"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
          style={{ transformOrigin: "left" }}
        />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 mb-5">
            <motion.div
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="grid h-8 w-8 place-items-center rounded-lg bg-saffron-500/10 text-saffron-600 dark:text-saffron-400"
              >
                <Settings2 size={18} />
              </motion.span>
              <h2 className="text-xl font-bold font-display">Settings</h2>
            </motion.div>
            <motion.button
              onClick={onClose}
              whileHover={{ rotate: 90, scale: 1.1 }}
              whileTap={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10 transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>

          <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
            {/* 1. Language preference */}
            <motion.div
              custom={0}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2"
            >
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                <Languages size={13} /> Interface Language
              </label>
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                  className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 cursor-pointer transition-all dark:text-white"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code} className="text-neutral-900 bg-white dark:bg-zinc-800 dark:text-white">
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* 2. Theme selection */}
            <motion.div
              custom={1}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Appearance Theme
              </span>
              <div className="grid grid-cols-2 gap-2">
                <OptionButton selected={theme === "light"} onClick={() => toggleTheme("light")}>
                  <Sun size={15} /> Light
                </OptionButton>
                <OptionButton selected={theme === "dark"} onClick={() => toggleTheme("dark")}>
                  <Moon size={15} /> Dark
                </OptionButton>
              </div>
            </motion.div>

            {/* Typography Scale */}
            <motion.div
              custom={2}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Text Font Size
              </span>
              <div className="grid grid-cols-3 gap-2">
                <OptionButton selected={fontSize === "normal"} onClick={() => setFontSize("normal")}>
                  Normal
                </OptionButton>
                <OptionButton selected={fontSize === "large"} onClick={() => setFontSize("large")}>
                  Large
                </OptionButton>
                <OptionButton selected={fontSize === "xl"} onClick={() => setFontSize("xl")}>
                  Extra Large
                </OptionButton>
              </div>
            </motion.div>

            {/* 3. Voice Assist Customization */}
            <motion.div
              custom={3}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-3.5 border-t border-neutral-200 dark:border-white/10 pt-4"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                TTS Voice Assistant Settings
              </span>

              {/* Voice Gender Selection */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Voice Tone Gender</span>
                <div className="grid grid-cols-2 gap-2">
                  <OptionButton
                    selected={voiceGender === "female"}
                    onClick={() => setVoiceGender("female")}
                  >
                    <span>👩</span> Female Voice
                  </OptionButton>
                  <OptionButton
                    selected={voiceGender === "male"}
                    onClick={() => setVoiceGender("male")}
                  >
                    <span>👨</span> Male Voice
                  </OptionButton>
                </div>
              </div>

              {/* Voice Model Selector Dropdown */}
              {availableVoices.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Specific Voice Model</span>
                  <select
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                    className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-500/20 cursor-pointer transition-all dark:text-white"
                  >
                    <option value="" className="text-neutral-900 bg-white dark:bg-zinc-800 dark:text-white">-- Auto-Select (Neural/Natural) --</option>
                    {availableVoices
                      .filter((v) => v.lang.toLowerCase().startsWith(language.toLowerCase().split("-")[0]))
                      .map((v) => (
                        <option key={v.name} value={v.name} className="text-neutral-900 bg-white dark:bg-zinc-800 dark:text-white">
                          {v.name} {!v.localService ? "☁️ (Online/Neural)" : "💻 (Local)"}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </motion.div>

            {/* Autoplay & Sound toggles */}
            <motion.div
              custom={4}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-4 border-t border-neutral-200 dark:border-white/10 pt-4"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Interactive Preferences
              </span>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Read Chat Answers Aloud
                  </span>
                  <span className="text-[10px] text-neutral-500">Automatically speak chatbot responses</span>
                </div>
                <AnimatedToggle enabled={autoPlaySpeech} onToggle={() => setAutoPlaySpeech(!autoPlaySpeech)} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Sound Effects
                  </span>
                  <span className="text-[10px] text-neutral-500">Play audio chimes on user actions</span>
                </div>
                <AnimatedToggle enabled={soundEffects} onToggle={() => setSoundEffects(!soundEffects)} />
              </div>
            </motion.div>

            {/* 4. Reset Session Data */}
            <motion.div
              custom={5}
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              className="border-t border-neutral-200 dark:border-white/10 pt-4 flex flex-col gap-2"
            >
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Database & Session
              </span>
              <motion.button
                onClick={handleResetData}
                disabled={resetSuccess}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-2.5 px-4 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  resetSuccess
                    ? "bg-green-500/10 border-green-500/30 text-green-600"
                    : "border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                <AnimatePresence mode="wait">
                  {resetSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={14} /> Session Cleared!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="reset"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Reset Profile & Bookmarks
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
