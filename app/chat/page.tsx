"use client";

import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

// Lazy-loaded so the chat bundle (and its dependencies) only load when this page is visited.
const ChatWindow = dynamic(() => import("@/components/ChatWindow"), {
  ssr: false,
  loading: () => <p className="text-center text-ink-900/60 dark:text-saffron-50/60">Loading chat…</p>,
});

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-6">
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

      <div>
        <h1 className="mb-8 text-center font-display text-2xl font-bold">Ask SarkarGPT</h1>
        <ChatWindow />
      </div>
    </div>
  );
}
