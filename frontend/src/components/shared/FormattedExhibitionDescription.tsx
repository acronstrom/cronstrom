import type { ReactNode } from 'react';

const COLLAPSE_WS = /\s+/g;

/**
 * Split the blob after "Öppettider" into rows at common Swedish period/day labels.
 * Lookahead keeps the label on the following segment.
 */
const HOURS_ROW_SPLIT =
  /\s+(?=(?:Påskhelgen|Julafton|Juldagen|Nyårsafton|Midsommarafton|Vardagar|Helg(?:veckan)?|Lör(?:dag)?\.?\s*\+|Lörd(?:ag)?\.?\s*\+|Lör\.|Lörd|sönd\.|Sön(?:dag)?\.?|Mån(?:dag)?\.?|Tis(?:dag)?\.?|Ons(?:dag)?\.?|Tors(?:dag)?\.?|Fre(?:dag)?\.?)(?=\s|$))/i;

const OPPETTIDER_SPLIT = /^([\s\S]+?)\b(Öppettider)\b\s+([\s\S]+)$/i;

function highlightVernissage(intro: string): ReactNode[] {
  const parts = intro.split(/(\bVernissage\b)/gi);
  return parts.map((part, i) =>
    /^vernissage$/i.test(part) ? (
      <strong key={i} className="font-semibold text-neutral-800">
        {part}
      </strong>
    ) : (
      part
    )
  );
}

function plainParagraphs(text: string): ReactNode {
  const paras = text.split(/\n+/).map((p) => p.replace(COLLAPSE_WS, ' ').trim()).filter(Boolean);
  if (paras.length <= 1) {
    return <p className="leading-relaxed">{text.trim()}</p>;
  }
  return (
    <div className="space-y-2">
      {paras.map((p, i) => (
        <p key={i} className="leading-relaxed">
          {p}
        </p>
      ))}
    </div>
  );
}

type Props = {
  text: string;
  className?: string;
};

/**
 * Formats exhibition description text: if it contains "Öppettider", shows intro + a titled list of hour rows.
 * Otherwise respects newlines as paragraphs or a single block.
 */
export function FormattedExhibitionDescription({ text, className }: Props) {
  const normalized = text.replace(COLLAPSE_WS, ' ').trim();
  if (!normalized) return null;

  const match = normalized.match(OPPETTIDER_SPLIT);

  const wrap = (inner: ReactNode) => (
    <div className={className ?? ''}>{inner}</div>
  );

  if (!match) {
    return wrap(
      <div className="text-sm text-neutral-600 leading-relaxed">{plainParagraphs(text.trim())}</div>
    );
  }

  const [, before, heading, hoursBlob] = match;
  const intro = before.trim();
  const rows = hoursBlob.split(HOURS_ROW_SPLIT).map((r) => r.trim()).filter(Boolean);

  return wrap(
    <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
      {intro && <p className="leading-relaxed">{highlightVernissage(intro)}</p>}
      <div className="space-y-2.5">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          {heading}
        </p>
        {rows.length > 0 ? (
          <ul className="m-0 list-none space-y-2.5 p-0">
            {rows.map((row, i) => (
              <li key={i} className="flex gap-3 text-[0.9375rem] leading-snug text-neutral-700">
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400/90"
                  aria-hidden
                />
                <span className="min-w-0">{row}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-600">{hoursBlob.trim()}</p>
        )}
      </div>
    </div>
  );
}
