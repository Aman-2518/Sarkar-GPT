"use client";

import { useState, useEffect } from "react";
import EligibilityForm from "@/components/EligibilityForm";
import SchemeCard from "@/components/SchemeCard";
import schemesData from "@/data/schemes.json";
import { filterSchemes } from "@/lib/filterSchemes";
import { Scheme, UserProfile } from "@/lib/types";
import { RotateCcw, Bookmark, FileDown, CheckCircle } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const schemes = schemesData as Scheme[];

export default function FindSchemesPage() {
  const [results, setResults] = useState<Scheme[] | null>(null);
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const { t } = useLanguage();

  // Load saved schemes and profile from localStorage on mount
  const loadSavedData = () => {
    if (typeof window !== "undefined") {
      const ids = JSON.parse(localStorage.getItem("sarkargpt_saved_schemes") || "[]") as string[];
      setSavedIds(ids);

      const savedProfile = localStorage.getItem("sarkargpt_profile");
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile) as UserProfile;
          setActiveProfile(parsed);
          setResults(filterSchemes(schemes, parsed));
        } catch (e) {
          console.error("Failed to parse saved profile", e);
        }
      }
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  function handleSubmit(profile: UserProfile) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sarkargpt_profile", JSON.stringify(profile));
    }
    setActiveProfile(profile);
    setResults(filterSchemes(schemes, profile));
  }

  const displayedResults = showSavedOnly
    ? (results || schemes).filter((s) => savedIds.includes(s.id))
    : (results || []);

  const handleEditProfile = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("sarkargpt_profile");
    }
    setResults(null);
    setActiveProfile(null);
    setShowSavedOnly(false);
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Compile unique documents checklist across all matched schemes for the report
  const uniqueDocuments = Array.from(
    new Set((results || []).flatMap((s) => s.documents))
  );

  const isViewingGlobalSaved = !results && showSavedOnly;

  return (
    <div className="relative">
      {/* 1. Main Page Contents (visible on screen, hidden on print via no-print class) */}
      <div className="no-print">
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
            {/* Download PDF button */}
            {results && (
              <button
                onClick={handlePrint}
                className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1.5"
                title="Save schemes report as PDF"
              >
                <FileDown size={14} /> Download PDF
              </button>
            )}

            {/* Saved Schemes Toggle */}
            <button
              onClick={() => {
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
                <SchemeCard key={s.id} scheme={s} onBookmarkChange={loadSavedData} />
              ))}
            </div>
          )
        ) : !results ? (
          <EligibilityForm onSubmit={handleSubmit} />
        ) : (
          displayedResults.length === 0 ? (
            <p className="text-center text-ink-900/60 dark:text-saffron-50/60 py-8">
              {showSavedOnly
                ? "No saved schemes match your profile."
                : t("noMatches")}
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {displayedResults.map((s) => (
                <SchemeCard key={s.id} scheme={s} onBookmarkChange={loadSavedData} />
              ))}
            </div>
          )
        )}
      </div>

      {/* 2. Hidden Print-Only A4 Document Layout (compiled only on window.print()) */}
      {results && activeProfile && (
        <div className="print-only report-page">
          {/* Header block */}
          <div style={{ borderBottom: "3px solid #ea580c", paddingBottom: "15px", marginBottom: "25px" }}>
            <h1 style={{ fontSize: "24pt", fontWeight: "bold", color: "#ea580c", margin: 0 }}>SarkarGPT</h1>
            <p style={{ fontSize: "10pt", color: "#4b5563", margin: "2px 0 0 0" }}>
              Official Scheme Eligibility Summary Report • Generated on {new Date().toLocaleDateString()}
            </p>
          </div>

          {/* Demographic Parameters table */}
          <div style={{ marginBottom: "25px", background: "#f9fafb", padding: "15px", borderRadius: "8px" }}>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "1px solid #e5e7eb", paddingBottom: "5px", marginBottom: "10px", color: "#111827" }}>
              User Demographic Profile
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10pt" }}>
              <tbody>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold", width: "15%" }}>State:</td>
                  <td style={{ padding: "4px 0", color: "#374151" }}>{activeProfile.state || "India"}</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold", width: "15%" }}>Age:</td>
                  <td style={{ padding: "4px 0", color: "#374151" }}>{activeProfile.age} Years</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>Gender:</td>
                  <td style={{ padding: "4px 0", color: "#374151", textTransform: "capitalize" }}>{activeProfile.gender}</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>Occupation:</td>
                  <td style={{ padding: "4px 0", color: "#374151", textTransform: "capitalize" }}>{activeProfile.occupation || "Not Specified"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>Annual Income:</td>
                  <td style={{ padding: "4px 0", color: "#374151" }}>₹{activeProfile.income.toLocaleString()}/year</td>
                  <td style={{ padding: "4px 0", fontWeight: "bold" }}>Category details:</td>
                  <td style={{ padding: "4px 0", color: "#374151" }}>
                    {[
                      activeProfile.isFarmer && "Farmer",
                      activeProfile.isStudent && "Student",
                      activeProfile.isSeniorCitizen && "Senior Citizen",
                      activeProfile.hasDisability && "Differently Abled",
                      activeProfile.isMsmeOwner && "MSME Owner",
                      activeProfile.isStartupFounder && "Startup Founder",
                    ]
                      .filter(Boolean)
                      .join(", ") || "None"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Consolidated documents checklist */}
          {uniqueDocuments.length > 0 && (
            <div style={{ marginBottom: "30px", border: "1px solid #e5e7eb", padding: "15px", borderRadius: "8px" }}>
              <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "1px solid #e5e7eb", paddingBottom: "5px", marginBottom: "10px", color: "#111827" }}>
                Consolidated Documents Checklist
              </h2>
              <p style={{ fontSize: "9pt", color: "#6b7280", marginTop: 0, marginBottom: "12px" }}>
                Ensure you gather these documents before applying. You can inspect acquisition guides on the website.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "10pt" }}>
                {uniqueDocuments.map((doc) => (
                  <div key={doc} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ border: "1px solid #9ca3af", width: "14px", height: "14px", display: "inline-block", borderRadius: "3px" }} />
                    <span style={{ color: "#374151" }}>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Schemes detailed list */}
          <div>
            <h2 style={{ fontSize: "14pt", fontWeight: "bold", borderBottom: "1px solid #e5e7eb", paddingBottom: "5px", marginBottom: "15px", color: "#111827" }}>
              Matched Government Schemes ({results.length})
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {results.map((scheme, index) => (
                <div
                  key={scheme.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    pageBreakInside: "avoid",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "between", alignItems: "start", marginBottom: "6px" }}>
                    <div>
                      <span style={{ fontSize: "8pt", fontWeight: "bold", color: "#ea580c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        {scheme.category}
                      </span>
                      <h3 style={{ fontSize: "12pt", fontWeight: "bold", margin: "2px 0 0 0", color: "#111827" }}>
                        {index + 1}. {scheme.name}
                      </h3>
                      <p style={{ fontSize: "8.5pt", color: "#6b7280", margin: "2px 0" }}>{scheme.ministry}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: "9.5pt", color: "#4b5563", margin: "8px 0" }}>{scheme.description}</p>
                  
                  {scheme.amountDetails && (
                    <div style={{ marginTop: "8px", padding: "8px", background: "#fff7ed", border: "1px solid #ffedd5", borderRadius: "5px", fontSize: "9pt" }}>
                      <strong style={{ color: "#c2410c" }}>Benefit Amount:</strong> {scheme.amountDetails}
                    </div>
                  )}

                  <div style={{ marginTop: "10px" }}>
                    <strong style={{ fontSize: "9pt", color: "#111827" }}>Key Benefits:</strong>
                    <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "8.5pt", color: "#374151" }}>
                      {scheme.benefits.map((benefit, bi) => (
                        <li key={bi} style={{ marginBottom: "2px" }}>{benefit}</li>
                      ))}
                    </ul>
                  </div>

                  {scheme.eligibilityCriteria && scheme.eligibilityCriteria.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong style={{ fontSize: "9pt", color: "#111827" }}>Detailed Eligibility:</strong>
                      <ul style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "8.5pt", color: "#374151" }}>
                        {scheme.eligibilityCriteria.map((c, ci) => (
                          <li key={ci} style={{ marginBottom: "2px" }}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {scheme.applicationSteps && scheme.applicationSteps.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <strong style={{ fontSize: "9pt", color: "#111827" }}>Application Steps:</strong>
                      <ol style={{ margin: "3px 0 0 0", paddingLeft: "18px", fontSize: "8.5pt", color: "#374151" }}>
                        {scheme.applicationSteps.map((step, si) => (
                          <li key={si} style={{ marginBottom: "2px" }}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div style={{ marginTop: "10px", fontSize: "9pt" }}>
                    <strong style={{ color: "#111827" }}>Required Documents:</strong>{" "}
                    <span style={{ color: "#4b5563" }}>{scheme.documents.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer page descriptor */}
          <div style={{ marginTop: "40px", borderTop: "1px solid #e5e7eb", paddingTop: "10px", textAlign: "center", fontSize: "8pt", color: "#9ca3af" }}>
            This report was auto-generated by SarkarGPT. For direct online applications, visit the respective scheme links on sarkar-gpt.vercel.app.
          </div>
        </div>
      )}
    </div>
  );
}
