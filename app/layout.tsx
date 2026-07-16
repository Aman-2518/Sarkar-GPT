import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/languageContext";
import dynamic from "next/dynamic";

const FloatingVoiceGuide = dynamic(() => import("@/components/FloatingVoiceGuide"), {
  ssr: false,
});

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "SarkarGPT — Find Government Schemes for You",
  description: "AI assistant that helps Indian citizens discover government schemes they're eligible for.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <SplashScreen>
            <Navbar />
            <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-10">
              <PageTransition>{children}</PageTransition>
            </main>
            <FloatingVoiceGuide />
            <Footer />
          </SplashScreen>
        </LanguageProvider>
      </body>
    </html>
  );
}
