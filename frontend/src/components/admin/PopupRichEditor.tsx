import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo2,
  Redo2,
  Link2,
  ImageIcon,
  Minus,
} from 'lucide-react';
import { uploadImageBlob } from '../../lib/uploadImageBlob';
import { isPopupHtmlEmpty } from '../../lib/sanitizePopupHtml';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded border border-neutral-200 text-neutral-700 hover:bg-neutral-50 disabled:opacity-40 ${
        active ? 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-800' : ''
      }`}
    >
      {children}
    </button>
  );
}

export function PopupRichEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-neutral-900 underline underline-offset-2',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Placeholder.configure({
        placeholder:
          'Skriv text, rubriker och lägg in bilder. Använd verktygsraden för formatering.',
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class:
          'tiptap min-h-[200px] px-3 py-3 focus:outline-none prose-headings:font-serif [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-sm',
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (isPopupHtmlEmpty(value) && isPopupHtmlEmpty(editor.getHTML())) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Länk (URL)', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImageFromFile = useCallback(
    async (file: File | undefined) => {
      if (!file || !editor) return;
      try {
        const url = await uploadImageBlob(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Kunde inte ladda upp bilden');
      }
    },
    [editor]
  );

  if (!editor) {
    return (
      <div className="border border-neutral-200 bg-neutral-50 min-h-[240px] flex items-center justify-center text-sm text-neutral-500">
        Laddar redigerare…
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 bg-white">
      <div className="flex flex-wrap gap-1 p-2 border-b border-neutral-200 bg-neutral-50">
        <ToolbarButton
          title="Fet"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Kursiv"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
        >
          <Italic size={18} />
        </ToolbarButton>
        <span className="w-px h-6 bg-neutral-200 mx-1 self-center" />
        <ToolbarButton
          title="Rubrik 1"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Rubrik 2"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Rubrik 3"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
        >
          <Heading3 size={18} />
        </ToolbarButton>
        <span className="w-px h-6 bg-neutral-200 mx-1 self-center" />
        <ToolbarButton
          title="Punktlista"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Numrerad lista"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarButton
          title="Citat"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton title="Horisontell linje" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus size={18} />
        </ToolbarButton>
        <span className="w-px h-6 bg-neutral-200 mx-1 self-center" />
        <ToolbarButton title="Länk" onClick={setLink} active={editor.isActive('link')}>
          <Link2 size={18} />
        </ToolbarButton>
        <ToolbarButton title="Bild" onClick={() => fileRef.current?.click()}>
          <ImageIcon size={18} />
        </ToolbarButton>
        <span className="w-px h-6 bg-neutral-200 mx-1 self-center" />
        <ToolbarButton title="Ångra" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 size={18} />
        </ToolbarButton>
        <ToolbarButton title="Gör om" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 size={18} />
        </ToolbarButton>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          void addImageFromFile(f);
        }}
      />
      <EditorContent editor={editor} />
    </div>
  );
}
