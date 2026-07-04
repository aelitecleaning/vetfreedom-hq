import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import {
  buildSystemPrompt,
  type BattleBuddyMode,
  MODE_LABELS,
} from "@/ai/system-prompt";
import { screenUserMessage } from "@/ai/guard";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { resolveEntitlement, FREE_AI_DAILY_CAP } from "@/lib/tiers";

export const runtime = "nodejs";

const MODEL = "claude-sonnet-5";

interface ChatBody {
  mode: BattleBuddyMode;
  messages: { role: "user" | "assistant"; content: string }[];
  firstName?: string;
}

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { mode, messages, firstName } = body;
  if (!mode || !MODE_LABELS[mode] || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return NextResponse.json({ error: "No user message" }, { status: 400 });
  }

  // ── Layer 1: deterministic compliance guard (runs before any model call) ──
  const screen = screenUserMessage(lastUser.content);
  if (screen.blocked) {
    return NextResponse.json({
      role: "assistant",
      content: screen.reply,
      blockedBy: "guard",
      category: screen.category,
    });
  }

  // ── Metering: free tier is capped; paid/free-launch is unlimited ──
  const meter = await checkAndCountMessage();
  if (!meter.allowed) {
    return NextResponse.json(
      {
        error: "daily_limit",
        message: `You've used your ${FREE_AI_DAILY_CAP} free Battle Buddy messages today. Upgrade to Field Grade for unlimited — or come back tomorrow. Your calculator and claim tracker stay free either way.`,
      },
      { status: 429 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Graceful degradation before the key is configured.
    return NextResponse.json({
      role: "assistant",
      content:
        "Battle Buddy isn't switched on yet (the AI key isn't configured). In the meantime, your rating calculator and claim tracker are fully working.",
      blockedBy: "not-configured",
    });
  }

  const anthropic = new Anthropic({ apiKey });
  const system = buildSystemPrompt(mode, {
    firstName,
    bookKnowledge: process.env.MTFF_BOOK_KNOWLEDGE, // owner supplies later
  });

  try {
    const completion = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });
    const text = completion.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("\n");

    return NextResponse.json({ role: "assistant", content: text });
  } catch (err) {
    console.error("Anthropic error", err);
    return NextResponse.json(
      { error: "ai_error", message: "Battle Buddy hit a snag. Try again in a moment." },
      { status: 502 }
    );
  }
}

// Counts a message against the signed-in user's daily quota. Degrades to
// "allowed" when Supabase isn't configured or the user is anonymous, so local
// dev and the free launch always work.
async function checkAndCountMessage(): Promise<{ allowed: boolean }> {
  if (!isSupabaseConfigured()) return { allowed: true };

  try {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { allowed: true };

    const { data: profile } = await supabase
      .from("profiles")
      .select("tier, grandfathered_until")
      .eq("id", user.id)
      .maybeSingle();

    const ent = resolveEntitlement({
      tier: (profile?.tier as "recruit" | "field-grade" | "founding") ?? "recruit",
      grandfatheredUntil: profile?.grandfathered_until ?? null,
    });
    if (ent.unlimitedAi) return { allowed: true };

    // Count today's messages via the RPC defined in schema.sql.
    const { data: count } = await supabase.rpc("increment_ai_usage", {
      p_user: user.id,
    });
    return { allowed: (count as number) <= ent.aiDailyCap };
  } catch {
    return { allowed: true };
  }
}
