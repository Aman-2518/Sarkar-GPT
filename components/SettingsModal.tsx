"use client";

import { motion } from "framer-motion";
import { X, Volume2, Sun, Moon, Trash2, Check, Languages } from "lucide-react";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/languageContext";
import { useEffect, useState } from "react";

export default function SettingsModal({ onClose }: { onClose: () => void }) {
  const {
    language,
    setLanguage,
    voiceGender,
    setVoiceGender,
    voiceRate,
    setVoiceRate,
    voicePitch,
    setVoicePitch,
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
    localStorage.removeItem("sarkargpt_voice_rate");
    localStorage.removeItem("sarkargpt_voice_pitch");
    localStorage.removeItem("sarkargpt_selected_voice_name");
    localStorage.removeItem("sarkargpt_font_size");
    localStorage.removeItem("sarkargpt_autoplay");
    localStorage.removeItem("sarkargpt_sounds");
    
    // Reset to local defaults
    setVoiceGender("female");
    setVoiceRate(0.95);
    setVoicePitch(1.0);
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
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Settings Modal Container */}
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/90 dark:bg-ink-950/90 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-200 text-ink-950 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
              <Volume2 size={16} />
            </span>
            <h2 className="text-xl font-bold font-display">Preferences Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* 1. Language preference */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
              <Languages size={13} /> Interface Language
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-saffron-500 cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="text-neutral-900 bg-white">
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 2. Theme selection */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Appearance Theme
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => toggleTheme("light")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                  theme === "light"
                    ? "bg-saffron-500/10 border-saffron-500 text-saffron-800"
                    : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                <Sun size={15} /> Light
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                  theme === "dark"
                    ? "bg-saffron-500/10 border-saffron-500 text-saffron-400"
                    : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                <Moon size={15} /> Dark
              </button>
            </div>
          </div>

          {/* Typography Scale */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Text Font Size
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFontSize("normal")}
                className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                  fontSize === "normal"
                    ? "bg-saffron-500/10 border-saffron-500 text-saffron-855"
                    : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setFontSize("large")}
                className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                  fontSize === "large"
                    ? "bg-saffron-500/10 border-saffron-500 text-saffron-855"
                    : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                Large
              </button>
              <button
                onClick={() => setFontSize("xl")}
                className={`py-2 px-1 rounded-xl border text-xs font-semibold transition-all ${
                  fontSize === "xl"
                    ? "bg-saffron-500/10 border-saffron-500 text-saffron-855"
                    : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                }`}
              >
                Extra Large
              </button>
            </div>
          </div>

          {/* 3. Voice Assist Customization */}
          <div className="flex flex-col gap-3.5 border-t border-neutral-200 dark:border-white/10 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              TTS Voice Assistant Settings
            </span>

            {/* Voice Gender Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Voice Tone Gender</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setVoiceGender("female")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    voiceGender === "female"
                      ? "bg-saffron-500/10 border-saffron-500 text-saffron-800 dark:text-saffron-400"
                      : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span>👩</span> Female Voice
                </button>
                <button
                  onClick={() => setVoiceGender("male")}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                    voiceGender === "male"
                      ? "bg-saffron-500/10 border-saffron-500 text-saffron-800 dark:text-saffron-400"
                      : "border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5"
                  }`}
                >
                  <span>👨</span> Male Voice
                </button>
              </div>
            </div>

            {/* Voice Model Selector Dropdown */}
            {availableVoices.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">Specific Voice Model</span>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-saffron-500 cursor-pointer"
                >
                  <option value="">-- Auto-Select (Neural/Natural) --</option>
                  {availableVoices
                    .filter((v) => v.lang.toLowerCase().startsWith(language.toLowerCase().split("-")[0]))
                    .map((v) => (
                      <option key={v.name} value={v.name} className="text-neutral-900 bg-white">
                        {v.name} {!v.localService ? "☁️ (Online/Neural)" : "💻 (Local)"}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Voice Speed Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Narration Speed</span>
                <span className="text-saffron-600 dark:text-saffron-400 font-bold">{Math.round(voiceRate * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voiceRate}
                onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-saffron-500"
              />
            </div>

            {/* Voice Pitch Slider */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">Voice Pitch</span>
                <span className="text-saffron-600 dark:text-saffron-400 font-bold">{Math.round(voicePitch * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.05"
                value={voicePitch}
                onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                className="w-full h-1 bg-neutral-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-saffron-500"
              />
            </div>
          </div>

          {/* Autoplay & Sound toggles */}
          <div className="flex flex-col gap-4 border-t border-neutral-200 dark:border-white/10 pt-4">
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
              <button
                onClick={() => setAutoPlaySpeech(!autoPlaySpeech)}
                className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                  autoPlaySpeech ? "bg-saffron-500" : "bg-neutral-300 dark:bg-white/15"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    autoPlaySpeech ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Sound Effects
                </span>
                <span className="text-[10px] text-neutral-500">Play audio chimes on user actions</span>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`w-10 h-6 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${
                  soundEffects ? "bg-saffron-500" : "bg-neutral-300 dark:bg-white/15"
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ${
                    soundEffects ? "translate-x-4" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* 4. Reset Session Data */}
          <div className="border-t border-neutral-200 dark:border-white/10 pt-4 flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Database & Session
            </span>
            <button
              onClick={handleResetData}
              disabled={resetSuccess}
              className={`w-full py-2.5 px-4 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                resetSuccess ? "bg-green-500/10 border-green-500/30 text-green-600" : ""
              }`}
            >
              {resetSuccess ? (
                <>
                  <Check size={14} /> Session Cleared!
                </>
              ) : (
                <>
                  <Trash2 size={14} /> Reset Profile & Bookmarks
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
