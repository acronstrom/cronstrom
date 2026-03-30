import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'strike',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'a',
  'img',
  'blockquote',
  'div',
  'span',
  'hr',
];

const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'width', 'height', 'target', 'rel'];

/** Returns true if HTML has no visible content (empty editor output). */
export function isPopupHtmlEmpty(html: string | undefined | null): boolean {
  if (!html?.trim()) return true;
  const normalized = html
    .replace(/<p><br\s*\/?><\/p>/gi, '')
    .replace(/<p>\s*<\/p>/gi, '')
    .replace(/<br\s*\/?>/gi, '')
    .trim();
  return normalized === '';
}

export function sanitizePopupHtml(html: string): string {
  if (!html?.trim()) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ADD_ATTR: ['target'],
    ALLOW_DATA_ATTR: false,
  });
}
