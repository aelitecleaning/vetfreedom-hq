import type { Metadata } from "next";
import { BattleBuddy } from "@/components/BattleBuddy";
import { DisclaimerBlock } from "@/components/Disclaimer";

export const metadata: Metadata = {
  title: "Battle Buddy — AI education for veterans",
  description:
    "Ask general educational questions about VA claims, C&P exams, VA loans, and school benefits. Battle Buddy never fills out or files your claim — free accredited VSOs do that at no cost.",
};

export default function ChatPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="field-label">Section 04 · AI Guidance</p>
        <h1 className="mt-1 text-3xl font-bold">Battle Buddy</h1>
        <p className="mt-2 max-w-2xl text-olive-400">
          A squared-away AI that explains how the VA system and post-service money
          work — in plain English, 24/7. It teaches; it never prepares or files your
          claim. For that, a free accredited VSO has your six.
        </p>
      </div>
      <DisclaimerBlock compact />
      <BattleBuddy />
    </div>
  );
}
