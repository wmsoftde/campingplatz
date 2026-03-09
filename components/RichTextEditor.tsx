'use client';

import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import clsx from 'clsx';
import { Extension } from '@tiptap/core';
import { useState } from 'react';

type MediaFile = {
  id: string;
  originalName: string;
  mimeType: string;
  path: string;
  createdAt?: string;
};

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => (element as HTMLElement).getAttribute('data-width') || (element as HTMLElement).style.width || null,
        renderHTML: (attributes) => {
          if (!attributes.width) return {};
          return { 'data-width': attributes.width };
        }
      },
      align: {
        default: 'center',
        parseHTML: (element) => (element as HTMLElement).getAttribute('data-align') || 'center',
        renderHTML: (attributes) => ({ 'data-align': attributes.align || 'center' })
      },
      gap: {
        default: 'md',
        parseHTML: (element) => (element as HTMLElement).getAttribute('data-gap') || 'md',
        renderHTML: (attributes) => ({ 'data-gap': attributes.gap || 'md' })
      }
    };
  },
  renderHTML({ HTMLAttributes }) {
    const width = (HTMLAttributes as any)['data-width'] as string | undefined;
    const align = ((HTMLAttributes as any)['data-align'] as string | undefined) || 'center';
    const gap = ((HTMLAttributes as any)['data-gap'] as string | undefined) || 'md';

    const gapMap: Record<string, { top: number; bottom: number; side: number }> = {
      none: { top: 0, bottom: 0, side: 0 },
      sm: { top: 6, bottom: 10, side: 12 },
      md: { top: 8, bottom: 12, side: 16 },
      lg: { top: 10, bottom: 16, side: 20 }
    };
    const g = gapMap[gap] || gapMap.md;

    const style: string[] = ['max-width:100%', 'height:auto'];
    if (width) {
      style.push(`width:${width}`);
    }

    if (align === 'left') {
      style.push('float:left');
      style.push(`margin:${g.top}px ${g.side}px ${g.bottom}px 0`);
    } else if (align === 'right') {
      style.push('float:right');
      style.push(`margin:${g.top}px 0 ${g.bottom}px ${g.side}px`);
    } else {
      style.push('display:block');
      style.push('margin-left:auto');
      style.push('margin-right:auto');
      style.push(`margin-top:${g.top}px`);
      style.push(`margin-bottom:${g.bottom}px`);
    }

    const attrs = {
      ...HTMLAttributes,
      style: style.join(';')
    };

    return ['img', attrs];
  }
});

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => (element as HTMLElement).style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            }
          }
        }
      }
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: any }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: any }) =>
          chain().setMark('textStyle', { fontSize: null }).run()
    } as any;
  }
});

type Props = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

function ToolbarButton({
  active,
  disabled,
  onClick,
  children
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'px-2 py-1 rounded text-sm border transition-colors',
        active ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({ value, onChange, className }: Props) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaFile[]>([]);
  const [mediaQuery, setMediaQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4]
        }
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      Highlight.configure({ multicolor: false }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank'
        }
      }),
      CustomImage.configure({ inline: false })
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none min-h-[220px] px-4 py-3'
      }
    }
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || '';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className={clsx('border border-gray-200 rounded-lg bg-white', className)}>
        <div className="p-4 text-sm text-gray-500">Editor wird geladen...</div>
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previousUrl || '');
    if (url === null) return;
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt('Bild URL (https://...)', '');
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  const openMedia = async () => {
    setMediaOpen(true);
    if (mediaItems.length > 0) return;
    setMediaLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      const images = (Array.isArray(data) ? data : []).filter((m: any) => (m.mimeType || '').startsWith('image/'));
      setMediaItems(images);
    } catch {
      setMediaItems([]);
    } finally {
      setMediaLoading(false);
    }
  };

  const uploadToMedia = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      const created = await res.json();
      if (created && created.mimeType?.startsWith('image/')) {
        setMediaItems((prev) => [created, ...prev]);
      }
    } finally {
      setUploading(false);
    }
  };

  const insertMediaImage = (src: string) => {
    const normalized = src.startsWith('/uploads/') ? src.replace('/uploads/', '/api/uploads/') : src;
    editor.chain().focus().setImage({ src: normalized }).run();
    // Add a new paragraph after the image for nicer editing
    editor.chain().focus().enter().run();
    setMediaOpen(false);
  };

  const swatches = ['#111827', '#1f2937', '#0f766e', '#0ea5e9', '#2563eb', '#7c3aed', '#be123c', '#b45309'];
  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '28px'];
  const imageSizes = ['', '25%', '33%', '50%', '66%', '75%', '100%', '300px', '400px', '500px'];
  const imageGaps: Array<{ value: string; label: string }> = [
    { value: 'none', label: 'No Gap' },
    { value: 'sm', label: 'Small Gap' },
    { value: 'md', label: 'Medium Gap' },
    { value: 'lg', label: 'Large Gap' }
  ];

  const isImageSelected = editor.isActive('image');
  const imageAttrs = editor.getAttributes('image') as any;

  return (
    <div className={clsx('border border-gray-200 rounded-lg bg-white overflow-hidden', className)}>
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          Underline
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          Highlight
        </ToolbarButton>

        <div className="w-px bg-gray-200 mx-1" />

        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </ToolbarButton>

        <div className="w-px bg-gray-200 mx-1" />

        <ToolbarButton
          active={editor.isActive('link')}
          onClick={setLink}
        >
          Link
        </ToolbarButton>
        <ToolbarButton onClick={addImage}>Image URL</ToolbarButton>
        <ToolbarButton onClick={openMedia}>Media</ToolbarButton>

        {isImageSelected && (
          <>
            <div className="w-px bg-gray-200 mx-1" />
            <label className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded bg-white">
              Img
              <select
                className="text-sm bg-transparent"
                value={imageAttrs.width || ''}
                onChange={(e) => editor.chain().focus().updateAttributes('image', { width: e.target.value || null }).run()}
              >
                {imageSizes.map((s) => (
                  <option key={s || 'auto'} value={s}>{s || 'Auto'}</option>
                ))}
              </select>
            </label>
            <ToolbarButton
              active={imageAttrs.align === 'left'}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()}
            >
              Left
            </ToolbarButton>
            <ToolbarButton
              active={!imageAttrs.align || imageAttrs.align === 'center'}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()}
            >
              Center
            </ToolbarButton>
            <ToolbarButton
              active={imageAttrs.align === 'right'}
              onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()}
            >
              Right
            </ToolbarButton>
            <label className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded bg-white">
              Gap
              <select
                className="text-sm bg-transparent"
                value={imageAttrs.gap || 'md'}
                onChange={(e) => editor.chain().focus().updateAttributes('image', { gap: e.target.value }).run()}
              >
                {imageGaps.map((g) => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </label>
          </>
        )}

        <label className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded bg-white">
          Color
          <input
            type="color"
            value={(editor.getAttributes('textStyle').color as string) || '#1f2937'}
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
            className="h-6 w-8 p-0 border-0"
            aria-label="Textfarbe"
          />
        </label>

        <div className="flex items-center gap-1 px-2 py-1 border border-gray-200 rounded bg-white">
          {swatches.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => editor.chain().focus().setColor(c).run()}
              className="h-5 w-5 rounded border border-gray-200"
              style={{ backgroundColor: c }}
              aria-label={`Farbe ${c}`}
              title={c}
            />
          ))}
        </div>

        <label className="flex items-center gap-2 px-2 py-1 text-sm text-gray-700 border border-gray-200 rounded bg-white">
          Size
          <select
            className="text-sm bg-transparent"
            value={(editor.getAttributes('textStyle').fontSize as string) || ''}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) {
                (editor.commands as any).unsetFontSize();
              } else {
                (editor.commands as any).setFontSize(v);
              }
            }}
          >
            <option value="">Default</option>
            {fontSizes.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetColor().run()}
        >
          Clear Color
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          Clear
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />

      {mediaOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div>
                <div className="font-heading font-bold text-primary">Medien einfuegen</div>
                <div className="text-xs text-gray-500">Bilder aus der Medienverwaltung</div>
              </div>
              <button
                type="button"
                onClick={() => setMediaOpen(false)}
                className="px-3 py-1 rounded border border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                Schliessen
              </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3 px-4 py-3 border-b bg-gray-50">
              <input
                value={mediaQuery}
                onChange={(e) => setMediaQuery(e.target.value)}
                className="input-field md:max-w-sm"
                placeholder="Suchen..."
              />
              <label className="text-sm text-gray-700 flex items-center gap-3">
                <span className="px-3 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer">
                  {uploading ? 'Upload...' : '+ Upload'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadToMedia(f);
                    e.currentTarget.value = '';
                  }}
                />
              </label>
              <a
                className="text-sm text-primary hover:underline"
                href="/admin/media"
                target="_blank"
                rel="noopener noreferrer"
              >
                Medienverwaltung oeffnen
              </a>
            </div>

            <div className="p-4 overflow-y-auto max-h-[65vh]">
              {mediaLoading ? (
                <div className="text-sm text-gray-500">Laedt...</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {mediaItems
                    .filter((m) => m.originalName.toLowerCase().includes(mediaQuery.toLowerCase()))
                    .map((m) => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => insertMediaImage(m.path)}
                        className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-primary hover:shadow transition-all"
                        title={m.originalName}
                      >
                        <div className="aspect-square bg-gray-100 overflow-hidden">
                          <img src={m.path} alt={m.originalName} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                        </div>
                        <div className="px-2 py-2 text-[11px] text-gray-600 truncate">
                          {m.originalName}
                        </div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
