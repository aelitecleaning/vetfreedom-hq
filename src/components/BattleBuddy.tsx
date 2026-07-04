"use client";

import { useRef, useState } from "react";
import { MODE_LABELS, type BattleBuddyMode } from "@/ai/system-prompt";
import { VSO_FINDER_URL } from "@/components/Disclaimer";
import { track } from "@/lib/analytics";

interface Msg {
  role: "user" | "assistant";
  content: string;
  note?: string;
}

const MODES = Object.entries(MODE_LABELS) as [BattleBuddyMode, string][];

const STARTERS: Record<BattleBuddyMode, string> = {
  "claims-education": "How does the VA combined ratings math actually work?",
  "cp-exam-prep": "What is a C&P exam and what happens during one?",
  "va-loan": "How does the VA loan funding-fee exemption work for disabled vets?",
  "education-benefits": "What's the difference between the GI Bill and VR&E?",
  "business-launch": "What are the MTFF five income pillars?",
};

export function BattleBuddy() {
  const [mode, setMode] = useState<BattleBuddyMode>("claims-education");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setError(null);
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    void track("ai_message_sent", { mode });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Something went wrong. Try again.");
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.content,
            note: data.blockedBy === "guard" ? "Compliance guard" : undefined,
          },
        ]);
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
      requestAnimationFrame(() =>
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
      );
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[220px,1fr]">
      {/* Mode selector */}
      <div className="space-y-2">
        <p className="field-label">Mode</p>
        <div className="flex flex-wrap gap-2 md:flex-col">
          {MODES.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              aria-pressed={mode === key}
              className={`min-h-[44px] rounded-md border px-3 py-2 text-left text-sm ${
                mode === key
                  ? "border-signal-500 bg-base-800 text-sand"
                  : "border-base-700 text-olive-400 hover:bg-base-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-col rounded-lg border border-base-700 bg-base-900">
        <div
          ref={listRef}
          className="max-h-[52vh] min-h-[280px] space-y-3 overflow-y-auto p-4"
        >
          {messages.length === 0 && (
            <div className="space-y-3 text-sm text-olive-400">
              <p>Pick a mode and ask away. A good place to start:</p>
              <button
                className="btn-ghost text-left text-sm"
                onClick={() => send(STARTERS[mode])}
              >
                “{STARTERS[mode]}”
              </button>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg p-3 text-sm ${
                m.role === "user"
                  ? "ml-8 bg-base-700 text-sand"
                  : "mr-8 border border-base-700 bg-base-950 text-sand"
              }`}
            >
              {m.note && (
                <p className="mb-1 font-stencil text-[10px] uppercase tracking-widest text-signal-400">
                  {m.note}
                </p>
              )}
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
          ))}
          {busy && <p className="text-sm text-olive-400">Battle Buddy is thinking…</p>}
        </div>

        {error && (
          <p className="border-t border-base-700 px-4 py-2 text-sm text-signal-400">
            {error}{" "}
            <a className="underline" href="/pricing">
              See membership →
            </a>
          </p>
        )}

        <form
          className="flex gap-2 border-t border-base-700 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
        >
          <label htmlFor="bb-input" className="sr-only">
            Ask Battle Buddy
          </label>
          <input
            id="bb-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask about ${MODE_LABELS[mode]}…`}
            className="min-h-[44px] flex-1 rounded-md border border-base-700 bg-base-950 px-3 text-sand placeholder:text-base-600"
          />
          <button type="submit" className="btn-primary" disabled={busy}>
            Send
          </button>
        </form>
        <p className="px-4 pb-3 text-xs text-olive-400">
          For help filing or appealing, a free accredited VSO represents you at no
          cost →{" "}
          <a className="underline" href={VSO_FINDER_URL} target="_blank" rel="noopener noreferrer">
            find one here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
