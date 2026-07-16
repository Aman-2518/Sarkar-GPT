"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { UserProfile } from "@/lib/types";
import { useLanguage } from "@/lib/languageContext";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const DEFAULT_PROFILE: UserProfile = {
  state: "",
  age: 0,
  gender: "male",
  occupation: "",
  income: 0,
  isStudent: false,
  isFarmer: false,
  isStartupFounder: false,
  isMsmeOwner: false,
  isWomanEntrepreneur: false,
  hasDisability: false,
  isSeniorCitizen: false,
};

export default function EligibilityForm({ onSubmit }: { onSubmit: (p: UserProfile) => void }) {
  const { t, currentSpeechLang } = useLanguage();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [error, setError] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);

  const STEPS = [t("basics"), t("workIncome"), t("specialCategories")];

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function update<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function validateStep(): boolean {
    if (step === 0 && (!profile.state || profile.age <= 0)) {
      setError("Please select your state and enter a valid age.");
      return false;
    }
    if (step === 1 && (!profile.occupation || profile.income < 0)) {
      setError("Please enter your occupation and income.");
      return false;
    }
    setError("");
    return true;
  }

  function next() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      setStep(step + 1);
    }
    else onSubmit(profile);
  }

  function back() {
    setError("");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    if (step > 0) setStep(step - 1);
  }

  const speakStep = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      let text = `${STEPS[step]}. `;
      if (step === 0) {
        text += `${t("state")}. ${t("age")}. ${t("gender")}`;
      } else if (step === 1) {
        text += `${t("occupation")}. ${t("incomeLabel")}`;
      } else if (step === 2) {
        text += `${t("studentCheck")}. ${t("farmerCheck")}. ${t("startupCheck")}. ${t("msmeCheck")}. ${t("womanCheck")}. ${t("disabilityCheck")}. ${t("seniorCheck")}`;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentSpeechLang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="card mx-auto max-w-xl border border-neutral-200 dark:border-white/10 relative">
      {/* Speaker helper button */}
      <button
        onClick={speakStep}
        className={`absolute top-4 right-4 p-2 rounded-full border transition-all ${
          isSpeaking ? "text-red-500 border-red-500/30 bg-red-500/5" : "text-saffron-600 border-saffron-500/20 bg-saffron-500/5 hover:bg-saffron-500/10"
        }`}
        title={t("readAloud")}
        aria-label={t("readAloud")}
      >
        {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Progress bar */}
      <div className="mb-6 mr-10">
        <div className="mb-2 flex justify-between text-xs font-medium text-ink-900/60 dark:text-saffron-50/60">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= step ? "text-saffron-600 font-semibold" : ""}>{s}</span>
          ))}
        </div>
        <div className="h-2 rounded-full bg-saffron-100 dark:bg-white/10">
          <motion.div
            className="h-2 rounded-full bg-warm-gradient"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="flex flex-col gap-4"
        >
          {step === 0 && (
            <>
              <Field label={t("state")}>
                <select className="input" value={profile.state} onChange={(e) => update("state", e.target.value)}>
                  <option value="">{t("selectState")}</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label={t("age")}>
                <input type="number" min={0} className="input" value={profile.age || ""} onChange={(e) => update("age", Number(e.target.value))} />
              </Field>
              <Field label={t("gender")}>
                <select className="input" value={profile.gender} onChange={(e) => update("gender", e.target.value as UserProfile["gender"])}>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <Field label={t("occupation")}>
                <select className="input" value={profile.occupation} onChange={(e) => update("occupation", e.target.value)}>
                  <option value="">{t("selectOccupation")}</option>
                  <option value="farmer">{t("farmer")}</option>
                  <option value="student">{t("student")}</option>
                  <option value="salaried">{t("salaried")}</option>
                  <option value="self-employed">{t("selfEmployed")}</option>
                  <option value="unemployed">{t("unemployed")}</option>
                </select>
              </Field>
              <Field label={t("incomeLabel")}>
                <input type="number" min={0} className="input" value={profile.income || ""} onChange={(e) => update("income", Number(e.target.value))} />
              </Field>
            </>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Checkbox label={t("studentCheck")} checked={profile.isStudent} onChange={(v) => update("isStudent", v)} />
              <Checkbox label={t("farmerCheck")} checked={profile.isFarmer} onChange={(v) => update("isFarmer", v)} />
              <Checkbox label={t("startupCheck")} checked={profile.isStartupFounder} onChange={(v) => update("isStartupFounder", v)} />
              <Checkbox label={t("msmeCheck")} checked={profile.isMsmeOwner} onChange={(v) => update("isMsmeOwner", v)} />
              <Checkbox label={t("womanCheck")} checked={profile.isWomanEntrepreneur} onChange={(v) => update("isWomanEntrepreneur", v)} />
              <Checkbox label={t("disabilityCheck")} checked={profile.hasDisability} onChange={(v) => update("hasDisability", v)} />
              <Checkbox label={t("seniorCheck")} checked={profile.isSeniorCitizen} onChange={(v) => update("isSeniorCitizen", v)} />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <div className="mt-6 flex justify-between">
        <button onClick={back} disabled={step === 0} className="btn-secondary !px-4 !py-2 text-sm disabled:opacity-30">
          <ChevronLeft size={16} /> {t("backBtn")}
        </button>
        <button onClick={next} className="btn-primary !px-5 !py-2 text-sm">
          {step === STEPS.length - 1 ? t("seeSchemesBtn") : t("nextBtn")} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-white/10 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="accent-saffron-500 h-4 w-4" />
      <span className="text-ink-900 dark:text-saffron-50/90 font-medium">{label}</span>
    </label>
  );
}
