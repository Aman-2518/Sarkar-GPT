"use client";

import { useState } from "react";
import EligibilityForm from "@/components/EligibilityForm";
import SchemeCard from "@/components/SchemeCard";
import schemesData from "@/data/schemes.json";
import { filterSchemes } from "@/lib/filterSchemes";
import { Scheme, UserProfile } from "@/lib/types";
import { RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const schemes = schemesData as Scheme[];

export default function FindSchemesPage() {
  const [results, setResults] = useState<Scheme[] | null>(null);
  const { t } = useLanguage();

  function handleSubmit(profile: UserProfile) {
    setResults(filterSchemes(schemes, profile));
  }

  if (!results) {
    return (
      <div>
        <h1 className="mb-8 text-center font-display text-3xl font-bold">{t("findMySchemesBtn")}</h1>
        <EligibilityForm onSubmit={handleSubmit} />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">
          {results.length} {t("matchedText")}
        </h1>
        <button onClick={() => setResults(null)} className="btn-secondary !px-4 !py-2 text-sm">
          <RotateCcw size={14} /> {t("editProfile")}
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-ink-900/60 dark:text-saffron-50/60">
          {t("noMatches")}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {results.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      )}
    </div>
  );
}
