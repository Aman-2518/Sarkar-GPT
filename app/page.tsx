"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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
  FileText,
  Search,
  ExternalLink,
  X
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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Scheme[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results = schemes.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.ministry.toLowerCase().includes(q) ||
        s.documents.some((d) => d.toLowerCase().includes(q))
    );
    setSearchResults(results.slice(0, 8));
    setShowSearchResults(true);
  }, [searchQuery]);

  useEffect(() => {
    setFilteredSchemes(
      schemes.filter(
        (s) => s.category.toLowerCase().includes(activeCategory.toLowerCase().split(" ")[0])
      )
    );
  }, [activeCategory]);

  const stats = [
    { value: "60+", label: "Government Schemes" },
    { value: "15", label: "Indian Languages" },
    { value: "100%", label: "Local Privacy" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="relative flex flex-col gap-24 overflow-hidden min-h-screen">
      {/* Animated Floating Background Decorative Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-saffron-300/20 dark:bg-saffron-500/10 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-1/4 w-96 h-96 bg-orange-300/20 dark:bg-orange-500/10 rounded-full blur-3xl -z-10"
      />

      {/* Scheme Search Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-20 max-w-3xl mx-auto w-full"
        ref={searchRef}
      >
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setSelectedScheme(null); }}
            onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
            placeholder="Search any government scheme by name, category, or document..."
            className="w-full pl-12 pr-12 py-4 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl text-base text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500/40 shadow-lg transition-all duration-300"
          />
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(""); setSearchResults([]); setShowSearchResults(false); setSelectedScheme(null); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showSearchResults && searchResults.length > 0 && !selectedScheme && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 w-full rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden max-h-[420px] overflow-y-auto"
            >
              <div className="p-3 border-b border-neutral-100 dark:border-white/5">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {searchResults.length} scheme{searchResults.length !== 1 ? "s" : ""} found
                </span>
              </div>
              {searchResults.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedScheme(s); setShowSearchResults(false); }}
                  className="w-full text-left px-4 py-3.5 hover:bg-saffron-500/5 dark:hover:bg-white/5 border-b border-neutral-100 dark:border-white/5 last:border-0 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors truncate">
                        {s.name}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.ministry}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-500/10 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                      {s.category}
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Scheme Detail Card */}
        <AnimatePresence>
          {selectedScheme && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full mt-2 w-full rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 bg-saffron-500/10 px-2.5 py-1 rounded-full">
                      {selectedScheme.category}
                    </span>
                    <h3 className="font-display font-extrabold text-lg text-neutral-900 dark:text-white mt-2">
                      {selectedScheme.name}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{selectedScheme.ministry}</p>
                  </div>
                  <button
                    onClick={() => setSelectedScheme(null)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1"
                  >
                    <X size={18} />
                  </button>
                </div>

                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-4">
                  {selectedScheme.description}
                </p>

                {/* Benefits */}
                {selectedScheme.benefits.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Key Benefits</h4>
                    <ul className="space-y-1.5">
                      {selectedScheme.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="text-sm text-neutral-700 dark:text-neutral-300 flex items-start gap-2">
                          <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Documents Required */}
                <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                    <FileText size={14} /> Documents Required
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedScheme.documents.map((d) => (
                      <span key={d} className="text-xs bg-white dark:bg-white/10 text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-lg font-medium border border-amber-200 dark:border-amber-500/10">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <a
                    href={selectedScheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary !py-2.5 !px-5 text-sm flex items-center gap-2 flex-1 justify-center"
                  >
                    Apply Now <ExternalLink size={14} />
                  </a>
                  <Link
                    href="/find-schemes"
                    className="btn-secondary !py-2.5 !px-5 text-sm flex items-center gap-2 flex-1 justify-center"
                  >
                    Check Eligibility <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results Message */}
        <AnimatePresence>
          {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute top-full mt-2 w-full rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-2xl p-6 text-center"
            >
              <HelpCircle size={28} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
              <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">No schemes found for "{searchQuery}"</p>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">Try searching by scheme name, category, or document type</p>
              <Link href="/chat" className="inline-flex items-center gap-1.5 mt-3 text-sm font-bold text-saffron-600 dark:text-saffron-400 hover:underline">
                <MessageCircle size={14} /> Ask SarkarGPT instead
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      {/* Hero Section */}
      <section className="grid items-center gap-10 pt-8 md:grid-cols-12">
        {/* Left column hero texts with staggered entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 md:col-span-7"
        >
          <motion.span
            variants={itemVariants}
            className="w-fit rounded-full bg-saffron-100 dark:bg-white/10 px-3.5 py-1 text-xs font-semibold text-saffron-700 dark:text-saffron-300 border border-saffron-200 dark:border-white/5"
          >
            ✨ India's First Voice-Guided Scheme Assistant
          </motion.span>
          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl font-extrabold leading-tight md:text-6xl tracking-tight"
          >
            Find government schemes <br className="hidden md:inline" />
            <span className="bg-warm-gradient bg-clip-text text-transparent">you actually qualify for</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-base md:text-lg text-ink-900/70 dark:text-saffron-50/70 max-w-xl leading-relaxed"
          >
            {t("heroSubtitle")} Translate into 15 Indian languages, listen to requirements out loud, or navigate via voice commands.
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <Link href="/find-schemes" className="btn-primary flex items-center gap-2">
              {t("findMySchemesBtn")} <ArrowRight size={18} />
            </Link>
            <Link href="/chat" className="btn-secondary flex items-center gap-2">
              <MessageCircle size={18} /> {t("askSarkarGptBtn")}
            </Link>
          </motion.div>
        </motion.div>

        {/* Right side Hero Card with scale hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex items-center justify-center md:col-span-5"
        >
          <motion.div
            whileHover={{ scale: 1.015 }}
            className="card w-full max-w-sm border border-neutral-200 dark:border-white/10 shadow-2xl relative bg-white/70 dark:bg-zinc-900/70 backdrop-blur-lg"
          >
            <div className="absolute -top-3 -right-3 rounded-xl bg-warm-gradient text-white p-2.5 shadow-lg">
              <Sparkles size={20} className="animate-spin duration-3000" />
            </div>
            <p className="font-display font-extrabold text-xl text-neutral-900 dark:text-white flex items-center gap-2">
              Interactive Explorer
            </p>
            <p className="mt-1.5 text-sm text-ink-900/80 dark:text-saffron-50/75 leading-relaxed">
              Click a category card below to browse current demo schemes instantly.
            </p>
            
            <div className="mt-6 flex flex-col gap-2">
              {CATEGORIES.map(({ icon: Icon, label, color }) => {
                const count = schemes.filter((s) => s.category.toLowerCase().includes(label.toLowerCase().split(" ")[0])).length;
                return (
                  <motion.button
                    key={label}
                    onClick={() => setActiveCategory(label)}
                    onMouseEnter={() => setHoveredCategory(label)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    whileHover={{ scale: 1.02, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-sm font-bold transition-all duration-300 ${
                      activeCategory === label
                        ? "border-saffron-500 bg-saffron-500/10 text-saffron-800 dark:text-saffron-300 shadow-md"
                        : "border-neutral-200 dark:border-white/10 hover:border-saffron-500/30 hover:bg-neutral-50 dark:hover:bg-white/5 text-neutral-700 dark:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg bg-gradient-to-tr ${color}`}>
                        <Icon size={18} />
                      </span>
                      <span>{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AnimatePresence>
                        {hoveredCategory === label && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-xs bg-saffron-500 text-white font-bold px-2.5 py-0.5 rounded-full"
                          >
                            {count} schemes
                          </motion.span>
                        )}
                      </AnimatePresence>
                      <ArrowRight size={14} className={activeCategory === label ? "text-saffron-500" : "text-neutral-400"} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Dynamic Interactive Drawer Showcase */}
      <section className="border-y border-neutral-200 dark:border-white/10 py-12">
        <h2 className="text-center font-display text-3xl font-extrabold mb-8 text-neutral-900 dark:text-white flex items-center justify-center gap-2">
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
                whileHover={{ scale: 1.025, y: -4 }}
                transition={{ duration: 0.25 }}
                className="card flex flex-col justify-between border border-neutral-200 dark:border-white/10 bg-white/50 dark:bg-zinc-900/50 hover:bg-white dark:hover:bg-zinc-900 shadow-md hover:shadow-lg cursor-pointer"
              >
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-600 dark:text-saffron-400 px-2.5 py-1 rounded-full bg-saffron-500/10 w-fit mb-2.5 block">
                    {s.category}
                  </span>
                  <h3 className="font-display font-extrabold text-lg mb-1.5 text-neutral-900 dark:text-white">{s.name}</h3>
                  <p className="text-sm text-ink-900/70 dark:text-saffron-50/70 mb-3 font-medium">{s.ministry}</p>
                  <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed mb-4">{s.description}</p>
                </div>
                
                <div>
                  <div className="flex flex-wrap gap-1.5 mb-4 border-t border-neutral-100 dark:border-white/5 pt-3">
                    {s.documents.slice(0, 2).map((d) => (
                      <span key={d} className="text-xs bg-neutral-100 dark:bg-white/8 text-neutral-700 dark:text-saffron-50/80 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium">
                        <FileText size={12} /> {d}
                      </span>
                    ))}
                    {s.documents.length > 2 && (
                      <span className="text-xs text-saffron-600 font-bold px-1.5 py-1">+{s.documents.length - 2} more</span>
                    )}
                  </div>

                  <Link href="/find-schemes" className="btn-secondary !py-2.5 !px-4 text-sm font-bold w-full text-center hover:bg-saffron-500 hover:text-white hover:border-saffron-500">
                    Check Eligibility
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Stats Counter Section with staggered entries */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-3 gap-4 md:gap-8 max-w-4xl mx-auto w-full border border-saffron-500/20 bg-saffron-500/5 rounded-2xl p-6 md:p-8 backdrop-blur-md"
      >
        {stats.map((stat, i) => (
          <div key={i} className="text-center flex flex-col gap-1 md:gap-2">
            <h3 className="font-display text-2xl md:text-4xl font-extrabold text-saffron-600 dark:text-saffron-400">
              {stat.value}
            </h3>
            <p className="text-xs md:text-sm font-bold text-ink-900/80 dark:text-saffron-50/80 uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.section>

      {/* Key Benefits Grid */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
      >
        <h2 className="text-center font-display text-3xl font-extrabold text-neutral-800 dark:text-white">Why SarkarGPT?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">100% Local Privacy</h3>
            <p className="mt-2 text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
              We process your age, occupation, and state filters completely local in your browser. None of your demographic data is uploaded to external tracking servers.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
              <MessageCircle size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">Multi-Language Chatbot</h3>
            <p className="mt-2 text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
              Chat with SarkarGPT in Hindi, Bengali, Tamil, Telugu, and 11 other Indian languages. The AI responds directly in your chosen language.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="card border border-neutral-200 dark:border-white/10 hover:border-saffron-500/40 shadow-md"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Sparkles size={20} />
            </span>
            <h3 className="mt-4 font-display font-bold text-lg text-neutral-800 dark:text-white">Illiteracy Assisted Guides</h3>
            <p className="mt-2 text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
              Equipped with a floating voice guide helper and audio speaker read-outs. Makes discovery simple for citizens who cannot read or write easily.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* 60+ Schemes Directory Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 max-w-6xl mx-auto px-4 pb-16"
      >
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-display text-3xl font-extrabold text-neutral-800 dark:text-white">
            Directory of 60+ Monitored Government Schemes
          </h2>
          <p className="text-base text-ink-900/75 dark:text-saffron-50/75 max-w-2xl mx-auto">
            Browse our complete live catalog of government schemes across multiple sectors and ministries.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from(new Set(schemes.map((s) => s.category))).map((category) => {
            const catSchemes = schemes.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md flex flex-col gap-3.5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2.5">
                  <span className="font-extrabold text-base text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="text-xs bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 px-2.5 py-0.5 rounded-full font-bold">
                    {catSchemes.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-2.5 text-sm">
                  {catSchemes.map((s) => (
                    <li key={s.id} className="text-neutral-800 dark:text-saffron-50/85 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors flex items-start gap-2 leading-snug font-medium">
                      <span className="text-saffron-500 mt-0.5">•</span>
                      <span>{s.name}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Upcoming Features & Roadmap Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 max-w-4xl mx-auto px-4 pb-20 border-t border-neutral-200 dark:border-white/10 pt-16"
      >
        <div className="text-center flex flex-col gap-2">
          <span className="w-fit mx-auto rounded-full bg-saffron-100 dark:bg-white/10 px-3 py-1 text-[10px] font-bold text-saffron-700 dark:text-saffron-300 uppercase tracking-widest">
            Future Roadmap
          </span>
          <h2 className="font-display text-3xl font-extrabold text-neutral-800 dark:text-white">
            What's Coming Next to SarkarGPT?
          </h2>
          <p className="text-base text-ink-900/75 dark:text-saffron-50/75">
            We are continuously building new features to make government scheme discovery more accessible to every citizen.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 mt-4">
          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="flex gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30"
          >
            <span className="text-2xl mt-1">💬</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">WhatsApp & SMS Assistant</h3>
              <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
                Query eligibility and receive step-by-step application guidelines directly on WhatsApp, tailored for remote village areas.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="flex gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30"
          >
            <span className="text-2xl mt-1">📡</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">100% Offline Mode (PWA)</h3>
              <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
                Full offline database availability, allowing citizens to search schemes and verify documents in zero-connectivity areas.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="flex gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30"
          >
            <span className="text-2xl mt-1">🎙️</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">Regional Dialect Support</h3>
              <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
                Expanding voice synthesis readouts to include regional local accents and localized dialects of major Indian states.
              </p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.025, y: -4 }}
            className="flex gap-4 p-5 rounded-2xl border border-neutral-200 dark:border-white/5 bg-white/30 dark:bg-zinc-900/30"
          >
            <span className="text-2xl mt-1">📝</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-neutral-900 dark:text-white">Direct Form Pre-filling</h3>
              <p className="text-sm text-ink-900/80 dark:text-saffron-50/80 leading-relaxed">
                Use your local saved demographic profile to automatically pre-fill official scheme application forms with one click.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
