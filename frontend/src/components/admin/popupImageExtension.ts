import { Image as BaseImage } from '@tiptap/extension-image';

function parseDimAttr(value: string | null): number | null {
  if (!value) return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

/**
 * Image node with width/height parsed from saved HTML, plus resizable handles in the editor.
 */
export const PopupImage = BaseImage.extend({
  addAttributes() {
    const parent = this.parent?.() ?? {};
    return {
      ...parent,
      width: {
        default: null,
        parseHTML: (element) => parseDimAttr(element.getAttribute('width')),
        renderHTML: (attributes) =>
          attributes.width == null ? {} : { width: String(attributes.width) },
      },
      height: {
        default: null,
        parseHTML: (element) => parseDimAttr(element.getAttribute('height')),
        renderHTML: (attributes) =>
          attributes.height == null ? {} : { height: String(attributes.height) },
      },
    };
  },
}).configure({
  inline: false,
  allowBase64: false,
  resize: {
    enabled: true,
    minWidth: 64,
    minHeight: 48,
    alwaysPreserveAspectRatio: true,
  },
});
