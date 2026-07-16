"use client";

import Link from "next/link";
import { Landmark, Settings } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const SettingsModal = dynamic(() => import("./SettingsModal"), {
  ssr: false,
});

export default function Navbar() {
  const { t } = useLanguage();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
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

            {/* Unified Settings Gear Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="rounded-full p-2 transition-colors hover:bg-saffron-100 dark:hover:bg-white/10 text-ink-900/60 dark:text-saffron-50/60"
              aria-label="Open settings"
              title="Open Settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Settings Modal overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal onClose={() => setIsSettingsOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
