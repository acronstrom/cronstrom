/** Public routes allowed for the popup CTA (internal navigation only). */
export const POPUP_BUTTON_DESTINATIONS: { path: string; label: string }[] = [
  { path: '/', label: 'Startsida' },
  { path: '/galleri', label: 'Galleri' },
  { path: '/utstallningar', label: 'Utställningar' },
  { path: '/nobel', label: 'Nobel' },
  { path: '/glasfusing', label: 'Glasfusing' },
  { path: '/textilmaleri', label: 'Textilmåleri' },
  { path: '/utbildning', label: 'Utbildning' },
  { path: '/kontakt', label: 'Kontakt' },
];

const ALLOWED_PATHS = new Set(POPUP_BUTTON_DESTINATIONS.map((d) => d.path));

export function isAllowedPopupButtonPath(path: string): boolean {
  return ALLOWED_PATHS.has(path);
}

/**
 * Resolves stored path; falls back to legacy popupButtonTarget (exhibitions | gallery).
 */
export function sanitizePopupButtonPath(
  raw: string | undefined | null,
  legacyButtonTarget?: string
): string {
  if (raw && isAllowedPopupButtonPath(raw)) return raw;
  if (legacyButtonTarget === 'gallery') return '/galleri';
  return '/utstallningar';
}

type PopupSettingsRecord = {
  popupShowExhibitionsInPopup?: string;
  popupButtonTarget?: string;
};

/** Whether to fetch and render exhibition blocks in the popup. */
export function parseShowExhibitionsInPopup(settings: PopupSettingsRecord): boolean {
  const v = settings.popupShowExhibitionsInPopup;
  if (v !== undefined && v !== '') {
    return v !== 'false';
  }
  // Default on: CTA may still point at Galleri; lists and button are independent.
  return true;
}
