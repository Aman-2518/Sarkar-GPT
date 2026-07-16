"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Wallet, GraduationCap, Tractor } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";

const CATEGORIES = [
  { icon: Wallet, label: "Finance" },
  { icon: Tractor, label: "Agriculture" },
  { icon: GraduationCap, label: "Education" },
];

export default function Home() {
  const { t } = useLanguage();

  const FEATURES = [
    { icon: ShieldCheck, title: t("basics"), desc: t("heroSubtitle") },
    { icon: MessageCircle, title: t("aiChat"), desc: t("suggestedTitle") },
    { icon: Sparkles, title: t("quickPreview"), desc: t("categoriesCovered") },
  ];

  return (
    <div className="flex flex-col gap-24">
      {/* Hero */}
      <section className="grid items-center gap-10 pt-8 md:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="w-fit rounded-full bg-saffron-100 dark:bg-white/10 px-3 py-1 text-xs font-semibold text-saffron-700 dark:text-saffron-300">
            Built for Indian citizens
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="text-ink-900/70 dark:text-saffron-50/70">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/find-schemes" className="btn-primary">
              {t("findMySchemesBtn")} <ArrowRight size={16} />
            </Link>
            <Link href="/chat" className="btn-secondary">
              {t("askSarkarGptBtn")}
            </Link>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="card w-full max-w-sm border border-neutral-200 dark:border-white/10 shadow-lg">
            <p className="font-display font-semibold">{t("quickPreview")}</p>
            <p className="mt-1 text-sm text-ink-900/60 dark:text-saffron-50/60">{t("categoriesCovered")}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {CATEGORIES.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 rounded-full bg-saffron-100 dark:bg-white/10 px-3 py-1.5 text-xs font-medium text-saffron-800 dark:text-saffron-300">
                  <Icon size={14} className="text-saffron-600" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-6 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card border border-neutral-200 dark:border-white/10">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-warm-gradient text-white">
              <Icon size={18} />
            </span>
            <h3 className="mt-3 font-display font-bold">{title}</h3>
            <p className="mt-1 text-sm text-ink-900/70 dark:text-saffron-50/70">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
