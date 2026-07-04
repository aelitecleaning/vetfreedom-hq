// Privacy-light analytics. Fire-and-forget events written to a Postgres table
// (see supabase/schema.sql -> analytics_events). No third-party trackers, no PII
// beyond an optional user id. Safe to call from client components.

export type AnalyticsEvent =
  | "signup"
  | "briefing_completed"
  | "calculator_used"
  | "ai_message_sent"
  | "upgrade_clicked"
  | "tracker_claim_added";

export async function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>
): Promise<void> {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event, props: props ?? {} }),
      keepalive: true,
    });
  } catch {
    // Analytics must never break the UX.
  }
}
