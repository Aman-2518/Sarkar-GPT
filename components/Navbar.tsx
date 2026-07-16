"use client";

import Link from "next/link";
import { Landmark, Languages } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from "@/lib/languageContext";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/30">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-warm-gradient text-white">
            <Landmark size={16} />
          </span>
          SarkarGPT
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/find-schemes" className="text-sm font-medium hover:text-saffron-600 transition-colors">
            {t("findSchemes")}
          </Link>
          <Link href="/chat" className="text-sm font-medium hover:text-saffron-600 transition-colors">
            {t("aiChat")}
          </Link>

          {/* Language Dropdown Selector */}
          <div className="relative flex items-center gap-1 text-xs">
            <Languages size={15} className="text-ink-900/60 dark:text-saffron-50/60" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent font-medium border-0 focus:ring-0 cursor-pointer pr-5 py-1 text-ink-900 dark:text-white rounded-md hover:bg-neutral-100 dark:hover:bg-white/10"
              style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-neutral-900 bg-white">
                  {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
