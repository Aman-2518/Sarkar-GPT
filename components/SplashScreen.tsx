"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash was already shown this session
    if (typeof window !== "undefined" && sessionStorage.getItem("sarkargpt_splash_shown")) {
      setShowSplash(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("sarkargpt_splash_shown", "true");
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-saffron-50 via-orange-50 to-amber-50 dark:from-ink-950 dark:via-zinc-900 dark:to-ink-900"
          >
            {/* Animated decorative rings */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.05, 0.15] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-[500px] h-[500px] rounded-full border-2 border-saffron-400/20"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.03, 0.1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute w-[700px] h-[700px] rounded-full border border-saffron-300/10"
            />

            {/* Logo container */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center gap-5"
            >
              {/* Ashoka Chakra inspired logo mark */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-full bg-warm-gradient flex items-center justify-center shadow-[0_0_60px_rgba(249,115,22,0.3)]">
                  <motion.svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    {/* Stylized building/government icon */}
                    <path d="M3 21h18" />
                    <path d="M5 21V7l7-4 7 4v14" />
                    <path d="M9 21v-4h6v4" />
                    <path d="M10 10h.01" />
                    <path d="M14 10h.01" />
                    <path d="M12 14h.01" />
                  </motion.svg>
                </div>
              </motion.div>

              {/* Brand name with staggered letter reveal */}
              <div className="flex items-baseline gap-0.5">
                {"SarkarGPT".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.4, ease: "easeOut" }}
                    className={`font-display text-4xl font-extrabold tracking-tight ${
                      i >= 6
                        ? "bg-warm-gradient bg-clip-text text-transparent"
                        : "text-neutral-800 dark:text-white"
                    }`}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400 tracking-widest uppercase"
              >
                India's Scheme Discovery Engine
              </motion.p>

              {/* Loading bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut", delay: 0.2 }}
                className="h-0.5 bg-warm-gradient rounded-full mt-2"
                style={{ maxWidth: "180px" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content fades in after splash */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.4, delay: showSplash ? 0 : 0.1 }}
      >
        {children}
      </motion.div>
    </>
  );
}
