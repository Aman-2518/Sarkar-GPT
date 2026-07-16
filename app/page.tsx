"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Wallet,
  GraduationCap,
  Tractor,
  HeartPulse,
  Users,
  Briefcase,
  HelpCircle,
  CheckCircle,
  FileText
} from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import schemesData from "@/data/schemes.json";
import { Scheme } from "@/lib/types";

const schemes = schemesData as Scheme[];

const CATEGORIES = [
  { icon: Wallet, label: "Finance", color: "from-blue-500/20 to-indigo-500/20 text-blue-600 dark:text-blue-400" },
  { icon: Tractor, label: "Agriculture", color: "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400" },
  { icon: GraduationCap, label: "Education & Skills", color: "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400" },
  { icon: HeartPulse, label: "Healthcare", color: "from-rose-500/20 to-pink-500/20 text-rose-600 dark:text-rose-400" },
  { icon: Briefcase, label: "Entrepreneurship", color: "from-violet-500/20 to-purple-500/20 text-violet-600 dark:text-violet-400" },
];

export default function Home() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>("Finance");
  const [filteredSchemes, setFilteredSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    setFilteredSchemes(
      schemes.filter(
        (s) => s.category.toLowerCase().includes(activeCategory.toLowerCase().split(" ")[0])
      )
    );
  }, [activeCategory]);

  const stats = [
    { value: "30+", label: "Government Schemes" },
    { value: "15", label: "Indian Languages" },
    { value: "100%", label: "Local Privacy" },
  ];

  return (
    <div className="relative flex flex-col gap-24 overflow-hidden min-h-screen">
      {/* Animated Background Decorative Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-300/20 dark:bg-saffron-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[6000ms]" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl -z-10 animate-pulse duration-[8000ms] delay-1000" />

      {/* Hero Section */}
      <section className="grid items-center gap-10 pt-8 md:grid-cols-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 md:col-span-7"
        >
          <span className="w-fit rounded-full bg-saffron-100 dark:bg-white/10 px-3.5 py-1 text-xs font-semibold text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-white/5">
            ✨ India's First Voice-Guided Scheme Assistant
          </span>
          <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl tracking-tight">
            Find government schemes <br className="hidden md:inline" />
            <span className="bg-warm-gradient bg-clip-text text-transparent">you actually qualify for</span>
          </h1>
          <p className="text-base md:text-lg text-ink-900/70 dark:text-saffron-50/70 max-w-xl leading-relaxed">
            {t("heroSubtitle")} Translate into 15 Indian languages, listen to requirements out loud, or navigate via voice commands.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/find-schemes" className="btn-primary flex items-center gap-2">
              {t("findMySchemesBtn")} <ArrowRight size={18} />
            </Link>
            <Link href="/chat" className="btn-secondary flex items-center gap-2">
              <MessageCircle size={18} /> {t("askSarkarGptBtn")}
            </Link>
          </div>
        </motion.div>

        {/* Right side Hero Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center md:col-span-5"
        >
          <div className="card w-full max-w-sm border border-neutral-200 dark:border-white/10 shadow-2xl relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg">
            <div className="absolute -top-3 -right-3 rounded-xl bg-warm-gradient text-white p-2.5 shadow-lg">
              <Sparkles size={20} className="animate-spin duration-3000" />
            </div>
            <p className="font-display font-bold text-lg text-neutral-800 dark:text-white flex items-center gap-2">
              Interactive Explorer
            </p>
            <p className="mt-1 text-xs text-ink-900/60 dark:text-saffron-50/60 leading-normal">
              Click a category card below to browse current demo schemes instantly.
            </p>
            
            <div className="mt-6 flex flex-col gap-2">
              {CATEGORIES.map(({ icon: Icon, label, color }) => (
                <button
                  key={label}
                  onClick={() => setActiveCategory(label)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
                    activeCategory === label
                      ? "border-saffron-500 bg-saffron-500/10 text-saffron-800 dark:text-saffron-300 shadow-md translate-x-1"
                      : "border-neutral-200 dark:border-white/10 hover:border-saffron-500/30 hover:bg-neutral-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`p-1.5 rounded-lg bg-gradient-to-tr ${color}`}>
                      <Icon size={16} />
                    </span>
                    <span>{label}</span>
                  </div>
                  <ArrowRight size={14} className={activeCategory === label ? "text-saffron-500" : "text-neutral-400"} />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Dynamic Interactive Drawer Showcase */}
      <section className="border-y border-neutral-200 dark:border-white/10 py-12">
        <h2 className="text-center font-display text-2xl font-extrabold mb-8 text-neutral-800 dark:text-white flex items-center justify-center gap-2">
          ⚡ Schemes inside <span className="text-saffron-600 dark:text-saffron-400">"{activeCategory}"</span> Category
        </h2>
        
        <div className="grid gap-6 md:grid-cols-3 max-w-6xl mx-auto px-2">
          <AnimatePresence mode="wait">
            {filteredSchemes.slice(0, 3).map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="card flex flex-col justify-between border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 shadow-md hover:shadow-lg"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 px-2 py-0.5 rounded-full bg-saffron-500/10 w-fit mb-2 block">
                    {s.category}
                  </span>
                  <h3 className="font-display font-extrabold text-base mb-1.5 text-neutral-800 dark:text-white">{s.name}</h3>
                  <p className="text-xs text-ink-900/60 dark:text-saffron-50/60 mb-3">{s.ministry}</p>
                  <p className="text-xs text-ink-900/80 dark:text-saffron-50/80 leading-relaxed mb-4">{s.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-4 border-t border-neutral-100 dark:border-white/5 pt-3">
                  {s.documents.slice(0, 2).map((d) => (
                    <span key={d} className="text-[10px] bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-saffron-50/70 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <FileText size={10} /> {d}
                    </span>
                  ))}
                  {s.documents.length > 2 && (
                    <span className="text-[10px] text-saffron-600 font-bold px-1.5 py-1">+{s.documents.length - 2} more</span>
                  )}
                </div>

                <Link href="/find-schemes" className="btn-secondary !py-2 !px-3 text-xs w-full text-center hover:bg-saffron-500 hover:text-white hover:border-saffron-500">
                  Check Eligibility
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto w-full border border-saffron-500/20 bg-saffron-500/5 rounded-2xl p-6 md:p-8 backdrop-blur-md">
        {stats.map((stat, i) => (
          <div key={i} className="text-center flex flex-col gap-1 md:gap-2">
            <h3 className="font-display text-2xl md:text-4xl font-extrabold text-saffron-600 dark:text-saffron-400">
              {stat.value}
            </h3>
            <p className="text-[10px] md:text-sm font-semibold text-ink-900/70 dark:text-saffron-50/70 uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </section>

      {/* Key Benefits Grid */}
      <section className="flex flex-col gap-8">
        <h2 className="text-center font-display text-3xl font-extrabold text-neutral-800 dark:text-white">Why SarkarGPT?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">100% Local Privacy</h3>
            <p className="mt-2 text-xs text-ink-900/70 dark:text-saffron-50/70 leading-relaxed">
              We process your age, occupation, and state filters completely local in your browser. None of your demographic data is uploaded to external tracking servers.
            </p>
          </div>

          <div className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
              <MessageCircle size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">Multi-Language Chatbot</h3>
            <p className="mt-2 text-xs text-ink-900/70 dark:text-saffron-50/70 leading-relaxed">
              Chat with SarkarGPT in Hindi, Bengali, Tamil, Telugu, and 11 other Indian languages. The AI responds directly in your chosen language.
            </p>
          </div>

          <div className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">Illiteracy Assisted Guides</h3>
            <p className="mt-2 text-xs text-ink-900/70 dark:text-saffron-50/70 leading-relaxed">
              Equipped with a floating voice guide helper and audio speaker read-outs. Makes discovery simple for citizens who cannot read or write easily.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
