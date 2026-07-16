"use client";

import { Bookmark, ExternalLink, FileText, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect } from "react";
import { Scheme } from "@/lib/types";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/languageContext";
import dynamic from "next/dynamic";

const DocumentGuideModal = dynamic(() => import("./DocumentGuideModal"), {
  ssr: false,
});

export default function SchemeCard({ scheme, onBookmarkChange }: { scheme: Scheme; onBookmarkChange?: () => void }) {
  const { t, currentSpeechLang } = useLanguage();
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  // Initialize saved state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedIds = JSON.parse(localStorage.getItem("sarkargpt_saved_schemes") || "[]") as string[];
      setSaved(savedIds.includes(scheme.id));
    }
  }, [scheme.id]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleBookmark = () => {
    if (typeof window === "undefined") return;

    const savedIds = JSON.parse(localStorage.getItem("sarkargpt_saved_schemes") || "[]") as string[];
    let newSavedIds: string[];

    if (saved) {
      newSavedIds = savedIds.filter((id) => id !== scheme.id);
    } else {
      newSavedIds = [...savedIds, scheme.id];
    }

    localStorage.setItem("sarkargpt_saved_schemes", JSON.stringify(newSavedIds));
    setSaved(!saved);
    if (onBookmarkChange) onBookmarkChange();
  };

  const toggleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      
      const amountSpeech = scheme.amountDetails ? `Benefit Details: ${scheme.amountDetails}. ` : "";
      const criteriaSpeech = scheme.eligibilityCriteria ? `Eligibility Criteria: ${scheme.eligibilityCriteria.join(". ")}. ` : "";
      const stepsSpeech = scheme.applicationSteps ? `Steps to apply: ${scheme.applicationSteps.join(". ")}. ` : "";
      
      const textToSpeak = `${scheme.name}. ${scheme.description}. ${t("benefits")}: ${scheme.benefits.join(". ")}. ${amountSpeech}${criteriaSpeech}${stepsSpeech}${t("docsNeeded")}: ${scheme.documents.join(". ")}`;
      
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentSpeechLang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col gap-3 relative border border-neutral-200 dark:border-white/10"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-saffron-600">{scheme.category}</span>
            <h3 className="font-display text-lg font-bold">{scheme.name}</h3>
            <p className="text-xs text-ink-900/60 dark:text-saffron-50/60">{scheme.ministry}</p>
          </div>
          <div className="flex items-center gap-1">
            {/* Listen / TTS Button */}
            <button
              onClick={toggleSpeak}
              className={`rounded-full p-2 transition-colors ${
                isSpeaking ? "text-red-500 bg-red-500/10" : "text-ink-900/40 dark:text-saffron-50/40"
              } hover:bg-saffron-100 dark:hover:bg-white/10`}
              aria-label={isSpeaking ? t("stopListening") : t("listenDetails")}
              title={isSpeaking ? t("stopListening") : t("listenDetails")}
            >
              {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            
            <button
              onClick={toggleBookmark}
              aria-label="Bookmark scheme"
              className={`rounded-full p-2 transition-colors ${saved ? "text-saffron-600" : "text-ink-900/40 dark:text-saffron-50/40"} hover:bg-saffron-100 dark:hover:bg-white/10`}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">{scheme.description}</p>

        {open && (
          <div className="flex flex-col gap-4 border-t border-white/30 pt-4 text-sm">
            {/* Benefit Amount Callout Box */}
            {scheme.amountDetails && (
              <div className="bg-saffron-500/10 dark:bg-saffron-500/5 border border-saffron-500/20 rounded-xl p-3 text-xs text-saffron-800 dark:text-saffron-300 font-medium leading-relaxed">
                <span className="font-bold">💵 Benefit Amount Details:</span> {scheme.amountDetails}
              </div>
            )}

            {/* General Benefits List */}
            <div>
              <p className="font-semibold text-ink-900 dark:text-white mb-1.5">{t("benefits")}</p>
              <ul className="list-inside list-disc text-ink-900/80 dark:text-saffron-50/80 flex flex-col gap-0.5 text-xs leading-relaxed">
                {scheme.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>

            {/* Detailed Eligibility criteria */}
            {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 && (
              <div>
                <p className="font-semibold text-ink-900 dark:text-white mb-1.5">Detailed Eligibility Criteria</p>
                <ul className="list-inside list-disc text-ink-900/80 dark:text-saffron-50/80 flex flex-col gap-0.5 text-xs leading-relaxed">
                  {scheme.eligibilityCriteria.map((criteria, ci) => (
                    <li key={ci}>{criteria}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Application Steps */}
            {scheme.applicationSteps && scheme.applicationSteps.length > 0 && (
              <div>
                <p className="font-semibold text-ink-900 dark:text-white mb-1.5">Steps to Fill Application Form</p>
                <ol className="list-decimal list-inside text-ink-900/80 dark:text-saffron-50/80 flex flex-col gap-1 text-xs leading-relaxed">
                  {scheme.applicationSteps.map((step, si) => (
                    <li key={si} className="pl-1">
                      <span className="text-neutral-800 dark:text-saffron-50/90">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Documents Required */}
            <div>
              <p className="font-semibold text-ink-900 dark:text-white mb-2">{t("docsNeeded")} <span className="text-xs font-normal text-ink-900/50 dark:text-saffron-50/50">({t("learnMore")} / {t("listenDetails")})</span></p>
              <div className="flex flex-wrap gap-2">
                {scheme.documents.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDoc(d)}
                    className="text-xs px-2.5 py-1.5 rounded-lg border border-saffron-500/20 bg-saffron-500/5 hover:bg-saffron-500/10 text-saffron-800 dark:text-saffron-400 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <FileText size={12} />
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Extra Pro Tips and Helpdesk */}
            {scheme.extraIntel && scheme.extraIntel.length > 0 && (
              <div className="bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 rounded-xl p-3 text-[11px] text-ink-900/70 dark:text-saffron-50/70 flex flex-col gap-1 leading-relaxed">
                <span className="font-bold text-neutral-800 dark:text-white">💡 Important Notes & Helpline:</span>
                {scheme.extraIntel.map((intel, ii) => (
                  <span key={ii}>• {intel}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          <a href={scheme.applyUrl} target="_blank" rel="noreferrer" className="btn-primary !px-4 !py-2 text-sm">
            {t("applyBtn")} <ExternalLink size={14} />
          </a>
          <button onClick={() => setOpen((o) => !o)} className="btn-secondary !px-4 !py-2 text-sm">
            <FileText size={14} /> {open ? t("hideDetails") : t("learnMore")}
          </button>
        </div>
      </motion.div>

      {/* Document Guide Modal */}
      {selectedDoc && (
        <DocumentGuideModal
          documentName={selectedDoc}
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </>
  );
}
