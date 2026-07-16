"use client";

import { useState, useEffect } from "react";
import EligibilityForm from "@/components/EligibilityForm";
import SchemeCard from "@/components/SchemeCard";
import schemesData from "@/data/schemes.json";
import { filterSchemes } from "@/lib/filterSchemes";
import { Scheme, UserProfile } from "@/lib/types";
import { RotateCcw, Bookmark } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const schemes = schemesData as Scheme[];

export default function FindSchemesPage() {
  const [results, setResults] = useState<Scheme[] | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const { t } = useLanguage();

  // Load saved schemes from localStorage on mount and when changed
  const loadSavedIds = () => {
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem("sarkargpt_saved_schemes") || "[]") as string[];
      setSavedIds(ids);
    }
  };

  useEffect(() => {
    loadSavedIds();
  }, []);

  function handleSubmit(profile: UserProfile) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sarkargpt_profile", JSON.stringify(profile));
    }
    setResults(filterSchemes(schemes, profile));
  }

  const displayedResults = showSavedOnly
    ? (results || schemes).filter((s) => savedIds.includes(s.id))
    : (results || []);

  const handleEditProfile = () => {
    setResults(null);
    setShowSavedOnly(false);
  };

  // If viewing all saved schemes (when form is not filled)
  const isViewingGlobalSaved = !results && showSavedOnly;

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight">
            {isViewingGlobalSaved
              ? "Your Saved Schemes"
              : results
              ? `${results.length} ${t("matchedText")}`
              : t("findMySchemesBtn")}
          </h1>
          {results && !showSavedOnly && (
            <p className="text-sm text-ink-900/60 dark:text-saffron-50/60 mt-1">
              Based on your profile answers. Click the bookmark icon to save any scheme.
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Saved Schemes Toggle */}
          <button
            onClick={() => {
              loadSavedIds();
              setShowSavedOnly(!showSavedOnly);
            }}
            className={`btn-secondary !px-4 !py-2 text-sm flex items-center gap-1.5 transition-all ${
              showSavedOnly ? "bg-saffron-500/10 border-saffron-500 text-saffron-700 dark:text-saffron-400 font-semibold" : ""
            }`}
          >
            <Bookmark size={14} fill={showSavedOnly ? "currentColor" : "none"} />
            {showSavedOnly ? "Showing Saved" : "Show Saved"} ({savedIds.length})
          </button>

          {results && (
            <button onClick={handleEditProfile} className="btn-secondary !px-4 !py-2 text-sm">
              <RotateCcw size={14} /> {t("editProfile")}
            </button>
          )}
        </div>
      </div>

      {isViewingGlobalSaved ? (
        // Global saved schemes view when form is not filled
        displayedResults.length === 0 ? (
          <div className="card text-center p-8 border border-dashed border-neutral-300 dark:border-white/10 max-w-md mx-auto">
            <Bookmark size={32} className="mx-auto text-neutral-400 dark:text-saffron-50/40 mb-3" />
            <p className="text-sm text-ink-900/60 dark:text-saffron-50/60 font-medium">You haven't saved any schemes yet.</p>
            <button onClick={() => setShowSavedOnly(false)} className="btn-primary !px-4 !py-2 text-xs mt-3 mx-auto">
              Go to Eligibility Form
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {displayedResults.map((s) => (
              <SchemeCard key={s.id} scheme={s} onBookmarkChange={loadSavedIds} />
            ))}
          </div>
        )
      ) : !results ? (
        // Regular Form View
        <EligibilityForm onSubmit={handleSubmit} />
      ) : (
        // Results View
        displayedResults.length === 0 ? (
          <p className="text-center text-ink-900/60 dark:text-saffron-50/60 py-8">
            {showSavedOnly
              ? "No saved schemes match your profile."
              : t("noMatches")}
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {displayedResults.map((s) => (
              <SchemeCard key={s.id} scheme={s} onBookmarkChange={loadSavedIds} />
            ))}
          </div>
        )
      )}
    </div>
  );
}
