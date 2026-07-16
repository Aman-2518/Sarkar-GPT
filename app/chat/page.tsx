"use client";

import dynamic from "next/dynamic";

// Lazy-loaded so the chat bundle (and its dependencies) only load when this page is visited.
const ChatWindow = dynamic(() => import("@/components/ChatWindow"), {
  ssr: false,
  loading: () => <p className="text-center text-ink-900/60 dark:text-saffron-50/60">Loading chat…</p>,
});

export default function ChatPage() {
  return (
    <div>
      <h1 className="mb-8 text-center font-display text-2xl font-bold">Ask SarkarGPT</h1>
      <ChatWindow />
    </div>
  );
}
