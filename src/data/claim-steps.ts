// The 8 stages VA.gov shows for a disability claim, with field-manual-voice
// education for each. Purely informational — average timelines change, so every
// entry points back to VA.gov. Nothing here prepares or files a claim.

export interface ClaimStep {
  id: number;
  key: string;
  title: string;
  whatItMeans: string;
  whatUsuallyHappens: string;
  whatYouCanDo: string;
  source: string;
}

export const CLAIM_STEPS: ClaimStep[] = [
  {
    id: 1,
    key: "claim-received",
    title: "Claim Received",
    whatItMeans: "The VA has your claim in hand. The clock is running.",
    whatUsuallyHappens:
      "This is a short administrative stage — usually days. The VA logs your claim and routes it to a team.",
    whatYouCanDo:
      "Confirm your Intent to File (ITF) date is protected. Make sure your contact info and direct deposit are current on VA.gov.",
    source: "https://www.va.gov/disability/after-you-file-claim/",
  },
  {
    id: 2,
    key: "initial-review",
    title: "Initial Review",
    whatItMeans: "A reviewer checks that your claim is complete and understands what you filed for.",
    whatUsuallyHappens:
      "The VA decides whether it needs more evidence. Most claims move to 'Evidence Gathering' quickly.",
    whatYouCanDo:
      "Nothing is required, but this is a good time to make sure a free accredited VSO is representing you if you want help.",
    source: "https://www.va.gov/disability/after-you-file-claim/",
  },
  {
    id: 3,
    key: "evidence-gathering",
    title: "Evidence Gathering, Review & Decision",
    whatItMeans:
      "The VA collects records (VA, private, service) and may order an exam. This is usually the longest stage.",
    whatUsuallyHappens:
      "The VA requests records and may schedule a C&P exam. This phase can take weeks to many months.",
    whatYouCanDo:
      "Respond fast to any VA request. If you have private medical records, submitting them can help. A VSO can advise on what evidence matters.",
    source: "https://www.va.gov/disability/how-to-file-claim/evidence-needed/",
  },
  {
    id: 4,
    key: "cp-exam",
    title: "C&P Exam (if needed)",
    whatItMeans:
      "A Compensation & Pension exam — a clinician documents your condition for the VA. Not every claim needs one.",
    whatUsuallyHappens:
      "You'll be scheduled by VA or a contractor. Missing it can delay or sink your claim. Sometimes the VA decides on records alone (the ACE process).",
    whatYouCanDo:
      "Show up. Describe your symptoms honestly and completely, including how you are on your worst days. Never exaggerate — accuracy is what protects you.",
    source: "https://www.va.gov/resources/va-claim-exam/",
  },
  {
    id: 5,
    key: "preparation-for-decision",
    title: "Preparation for Decision",
    whatItMeans: "A rater has reviewed the evidence and is recommending a decision.",
    whatUsuallyHappens:
      "The recommendation moves up for review. Sometimes it bounces back to gather more evidence.",
    whatYouCanDo:
      "Usually just wait. Avoid submitting new evidence now unless it's important — it can restart earlier steps.",
    source: "https://www.va.gov/disability/after-you-file-claim/",
  },
  {
    id: 6,
    key: "pending-decision-approval",
    title: "Pending Decision Approval",
    whatItMeans: "A senior reviewer is signing off on the proposed decision.",
    whatUsuallyHappens: "Final quality checks. This stage is typically short.",
    whatYouCanDo: "Wait. Make sure your direct deposit info is correct so any award pays out smoothly.",
    source: "https://www.va.gov/disability/after-you-file-claim/",
  },
  {
    id: 7,
    key: "preparation-for-notification",
    title: "Preparation for Notification",
    whatItMeans: "The decision is made and the VA is preparing your decision letter.",
    whatUsuallyHappens: "Your decision packet is assembled and mailed / posted to VA.gov.",
    whatYouCanDo: "Watch VA.gov and your mail. Your decision letter explains the rating and effective date.",
    source: "https://www.va.gov/disability/after-you-file-claim/",
  },
  {
    id: 8,
    key: "complete",
    title: "Complete",
    whatItMeans: "A decision has been made. You can read the full decision letter.",
    whatUsuallyHappens: "Payment (if awarded) generally starts the month after the effective date.",
    whatYouCanDo:
      "Read the letter carefully. If you disagree, you have appeal options (Supplemental Claim, Higher-Level Review, or Board appeal) — usually within one year. A free accredited VSO can help you appeal.",
    source: "https://www.va.gov/decision-reviews/",
  },
];

export function stepById(id: number): ClaimStep | undefined {
  return CLAIM_STEPS.find((s) => s.id === id);
}
