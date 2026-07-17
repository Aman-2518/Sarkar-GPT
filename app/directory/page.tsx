"use client";

import { Scheme } from "@/lib/types";
import schemesData from "@/data/schemes.json";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const schemes = schemesData as Scheme[];

export default function DirectoryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract all unique categories
  const categories = Array.from(new Set(schemes.map((s) => s.category)));

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Back Button */}
      <div className="flex items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-saffron-600 dark:text-saffron-300 dark:hover:text-saffron-400 transition-colors group"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      <div className="text-center flex flex-col gap-2 mb-4">
        <h1 className="font-display text-3xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          Directory of 60+ Government Schemes
        </h1>
        <p className="text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto">
          Explore our complete catalog categorized by sector. Select a category below to see detailed scheme listings.
        </p>
      </div>

      {/* Category selector chips */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`text-xs font-bold px-4.5 py-2.5 rounded-full border transition-all ${
            selectedCategory === null
              ? "bg-saffron-500 border-saffron-500 text-white shadow-md"
              : "border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-saffron-500/40 hover:bg-saffron-500/5 hover:text-saffron-600 dark:hover:text-saffron-400"
          }`}
        >
          All Categories ({schemes.length})
        </button>
        {categories.map((cat) => {
          const count = schemes.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-bold px-4.5 py-2.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? "bg-saffron-500 border-saffron-500 text-white shadow-md"
                  : "border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 hover:border-saffron-500/40 hover:bg-saffron-500/5 hover:text-saffron-600 dark:hover:text-saffron-400"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid of Schemes */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories
          .filter((cat) => selectedCategory === null || selectedCategory === cat)
          .map((category) => {
            const catSchemes = schemes.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl border-2 border-neutral-300 dark:border-zinc-700 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md flex flex-col gap-4 hover:shadow-lg hover:border-saffron-500/60 transition-all duration-300"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-2.5">
                  <span className="font-extrabold text-base text-saffron-600 dark:text-saffron-400 uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="text-xs bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 px-2.5 py-0.5 rounded-full font-bold border border-saffron-500/20">
                    {catSchemes.length}
                  </span>
                </div>
                <ul className="flex flex-col gap-3 text-sm">
                  {catSchemes.map((s) => (
                    <li
                      key={s.id}
                      className="text-neutral-800 dark:text-neutral-200 transition-colors flex items-start gap-2.5 leading-snug font-medium border-b border-neutral-100 dark:border-white/5 last:border-b-0 pb-2.5 last:pb-0"
                    >
                      <span className="text-saffron-500 mt-1 flex-shrink-0">•</span>
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-900 dark:text-white leading-tight">{s.name}</span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{s.ministry}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
      </div>
    </div>
  );
}
