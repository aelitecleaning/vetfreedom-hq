// Deterministic pre-screen for the AI Battle Buddy. Defense in depth: before a
// message ever reaches the model, we catch the clearest line-crossing requests
// (draft my statement, fill my form, coach me to a target rating) and answer
// with a compliant refusal + redirect. The model's system prompt is the second
// layer; this is the first and is fully testable offline.

import { VSO_FINDER_URL } from "@/components/Disclaimer";

export interface GuardResult {
  blocked: boolean;
  category?: "draft-claim-doc" | "fill-form" | "coach-rating" | "predict-outcome";
  reply?: string;
}

const REDIRECT = `A free VA-accredited VSO can do this with you at no cost — that's what they're for, and the law reserves this kind of help for accredited reps. Find one here: ${VSO_FINDER_URL}`;

// Each rule: if an "action" pattern and a "claim-object" pattern both appear,
// it's a request to do individualized claims work — block it.
const ACTION = /\b(write|draft|fill(?:\s*out)?|complete|compose|create|prepare|edit|revise|improve|fix|review|proofread|do)\b/i;
const CLAIM_DOC =
  /\b(personal statement|buddy statement|lay statement|nexus (?:letter|statement)|statement in support|21-?526|20-?0995|20-?0996|10182|my claim|my application|my appeal|my form)\b/i;

const COACH_RATING =
  /\b(what (should|do) i (say|tell|write)|how (do|should) i (describe|word|phrase|present))\b[\s\S]*\b(c&?p|comp and pen|examiner|exam|va)\b|\b(get|reach|hit|bump|qualify for|so i get)\b[\s\S]*\b\d{1,3}\s?%|\bincrease my rating to\b/i;

const PREDICT =
  /\b(what|which) (rating|percentage|%).*\b(will|would|should) i\b|\bwhat('| a)?s my claim worth\b|\bhow much will i get\b|\bwill i (get|be) (approved|rated|awarded)\b/i;

export function screenUserMessage(message: string): GuardResult {
  const text = message.toLowerCase();

  if (ACTION.test(text) && CLAIM_DOC.test(text)) {
    const category = /21-?526|20-?0995|20-?0996|10182|form/.test(text)
      ? "fill-form"
      : "draft-claim-doc";
    return {
      blocked: true,
      category,
      reply:
        `I can't write, fill out, or edit any part of your VA claim, form, or statement — doing that would be individualized claims assistance, and MTFF is an educational tool, not an accredited representative. ${REDIRECT}\n\n` +
        `What I *can* do: walk you through, in general, how this part of the process works and what the VA is looking for. Want that?`,
    };
  }

  if (COACH_RATING.test(text)) {
    return {
      blocked: true,
      category: "coach-rating",
      reply:
        `I won't coach you on what to say to reach a specific rating — the only right approach at a C&P exam is to describe your symptoms honestly and completely, including on your worst days. Scripting answers isn't something I'll do, and it can hurt your credibility. ` +
        `In general, I can explain what a C&P exam is and what examiners assess under 38 CFR. For help with your specific case, ${REDIRECT}`,
    };
  }

  if (PREDICT.test(text)) {
    return {
      blocked: true,
      category: "predict-outcome",
      reply:
        `I can't predict a rating, percentage, or dollar amount for your claim — no honest tool can, and only the VA decides. ` +
        `I can show you how the VA's combined-ratings math works (try the in-app calculator) and explain the process in general. For an individualized read, ${REDIRECT}`,
    };
  }

  return { blocked: false };
}
