"use client";

import { X, Volume2, VolumeX, ExternalLink, Calendar, CreditCard, HelpCircle, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/languageContext";
import documentGuides from "@/data/documentGuides.json";

interface DocumentGuide {
  whatIsIt: string;
  howToGet: string;
  time: string;
  fees: string;
  onlineUrl?: string;
}

interface DocumentGuideModalProps {
  documentName: string;
  onClose: () => void;
}

export default function DocumentGuideModal({ documentName, onClose }: DocumentGuideModalProps) {
  const { t, currentSpeechLang } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Normalize document name mapping
  const docKey = Object.keys(documentGuides).find(
    (key) => key.toLowerCase() === documentName.toLowerCase() || documentName.toLowerCase().includes(key.toLowerCase())
  );
  
  const guide: DocumentGuide | undefined = docKey
    ? (documentGuides as Record<string, DocumentGuide>)[docKey]
    : undefined;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = guide 
        ? `${documentName}. ${guide.whatIsIt}. ${t("docHow")} ${guide.howToGet}. ${t("docTime")} ${guide.time}. ${t("docFees")} ${guide.fees}`
        : `${documentName}. No detailed guide available.`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentSpeechLang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="card w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200 bg-white/95 dark:bg-zinc-900/95 shadow-2xl border border-saffron-500/20 max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-ink-900/60 dark:text-saffron-50/60"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 pr-8 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <FileText className="text-saffron-600 shrink-0" size={24} />
          <h2 className="font-display text-xl font-bold text-ink-900 dark:text-white leading-tight">{documentName}</h2>
        </div>

        {guide ? (
          <div className="flex flex-col gap-4 text-sm text-ink-900/80 dark:text-saffron-50/90">
            {/* Audio Button */}
            <button
              onClick={toggleSpeak}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border font-semibold transition-all ${
                isSpeaking
                  ? "bg-red-500/10 border-red-500/40 text-red-600 dark:text-red-400"
                  : "bg-saffron-500/10 border-saffron-500/30 text-saffron-700 dark:text-saffron-400 hover:bg-saffron-500/20"
              }`}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
              {isSpeaking ? t("stopRead") : t("readAloud")}
            </button>

            {/* Content Blocks */}
            <div className="flex gap-3">
              <HelpCircle className="text-saffron-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-ink-900 dark:text-white mb-0.5">{t("docWhat")}</p>
                <p className="leading-relaxed">{guide.whatIsIt}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <FileText className="text-saffron-600 shrink-0 mt-0.5" size={16} />
              <div>
                <p className="font-bold text-ink-900 dark:text-white mb-0.5">{t("docHow")}</p>
                <p className="leading-relaxed whitespace-pre-line">{guide.howToGet}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2 bg-neutral-100 dark:bg-white/5 p-3 rounded-xl">
              <div className="flex gap-2">
                <Calendar className="text-saffron-600 shrink-0 mt-0.5" size={15} />
                <div>
                  <p className="font-bold text-ink-900 dark:text-white text-xs">{t("docTime")}</p>
                  <p className="text-xs text-ink-900/70 dark:text-saffron-50/70">{guide.time}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <CreditCard className="text-saffron-600 shrink-0 mt-0.5" size={15} />
                <div>
                  <p className="font-bold text-ink-900 dark:text-white text-xs">{t("docFees")}</p>
                  <p className="text-xs text-ink-900/70 dark:text-saffron-50/70">{guide.fees}</p>
                </div>
              </div>
            </div>

            {/* Official Link */}
            {guide.onlineUrl && (
              <a
                href={guide.onlineUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-1.5 btn-primary w-full text-center py-2.5"
              >
                {t("docOnlineLink")} <ExternalLink size={15} />
              </a>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-ink-900/60 dark:text-saffron-50/60">No detailed guide available for this document yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
