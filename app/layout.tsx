import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/lib/languageContext";

export const metadata: Metadata = {
  title: "SarkarGPT — Find Government Schemes for You",
  description: "AI assistant that helps Indian citizens discover government schemes they're eligible for.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          <main className="mx-auto min-h-[70vh] max-w-6xl px-6 py-10">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
