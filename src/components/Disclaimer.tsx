// The single source of truth for our compliance disclaimer text. Rendered in the
// footer, the AI chat header, and the onboarding acceptance step. Keep this
// wording in sync with the AI system prompt (src/ai/system-prompt.ts).

export const DISCLAIMER_TEXT =
  "Military to Financial Freedom is an educational tool. We are not a VSO, law firm, " +
  "or VA-accredited representative. We do not file, prepare, or prosecute claims, and " +
  "we never charge for claims help — accredited VSOs will help you file for FREE. " +
  "Nothing here is legal, medical, or financial advice. We never promise a rating or outcome.";

export const VSO_FINDER_URL =
  "https://www.va.gov/ogc/apps/accreditation/index.asp";

export function DisclaimerBlock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="note"
      className={`rounded-md border border-base-700 bg-base-900/80 text-olive-400 ${
        compact ? "p-3 text-xs" : "p-4 text-sm"
      }`}
    >
      <p>
        {DISCLAIMER_TEXT}{" "}
        <a
          className="font-semibold text-signal-400 underline"
          href={VSO_FINDER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Find a free accredited VSO →
        </a>
      </p>
    </div>
  );
}
