'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Pilcrow,
  Quote,
  Redo2,
  Trash2,
  Undo2,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  name: string
  label: string
  defaultValue?: string
  placeholder?: string
  folder?: string
}

interface ToolbarButtonProps {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ active = false, onClick, disabled = false, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-xl border text-muted-foreground transition-all',
        active
          ? 'border-primary/40 bg-primary/10 text-primary shadow-sm'
          : 'border-border/60 bg-background hover:border-primary/30 hover:text-foreground',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  )
}

export function RichTextEditor({
  name,
  label,
  defaultValue = '',
  placeholder = 'Nhập nội dung bài viết...',
  folder = 'posts',
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'mx-auto my-6 h-auto max-w-full rounded-2xl shadow-md',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline underline-offset-4',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    [placeholder]
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          'prose prose-slate min-h-[360px] max-w-none px-5 py-4 focus:outline-none prose-headings:font-extrabold prose-headings:tracking-tight prose-p:leading-8 prose-li:leading-8 prose-img:rounded-2xl prose-a:text-primary',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (defaultValue !== editor.getHTML()) {
      editor.commands.setContent(defaultValue || '', { emitUpdate: false })
      setContent(defaultValue || '')
    }
  }, [defaultValue, editor])

  const promptForLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href || ''
    const url = window.prompt('Nhập đường dẫn liên kết', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const insertImageByUrl = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Nhập URL ảnh muốn chèn vào nội dung')
    if (!url) return

    editor.chain().focus().setImage({ src: url, alt: 'Ảnh bài viết' }).run()
  }, [editor])

  const uploadImage = useCallback(
    async (file: File) => {
      if (!editor) return

      setUploading(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Upload thất bại')
        }

        editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
      } catch (error) {
        window.alert(error instanceof Error ? error.message : 'Không thể tải ảnh lên')
      } finally {
        setUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [editor, folder]
  )

  const handleSelectFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return
      await uploadImage(file)
    },
    [uploadImage]
  )

  if (!editor) {
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-border/60 bg-muted/20 text-sm text-muted-foreground">
          Đang khởi tạo trình soạn thảo...
        </div>
        <input type="hidden" name={name} value={content} />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={name}>{label}</Label>
        <div className="text-xs text-muted-foreground">
          Chèn ảnh vào đúng vị trí con trỏ để tạo bài viết như thông cáo/bài báo.
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-card shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-border/60 bg-secondary/20 p-3">
          <ToolbarButton title="Đoạn văn" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
            <Pilcrow className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Tiêu đề 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Tiêu đề 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Tiêu đề 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="In đậm" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="In nghiêng" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Danh sách chấm" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Danh sách số" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Trích dẫn" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Chèn liên kết" active={editor.isActive('link')} onClick={promptForLink}>
            <LinkIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Chèn ảnh từ URL" onClick={insertImageByUrl}>
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-border/60"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            Tải ảnh
          </Button>
          <ToolbarButton title="Hoàn tác" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
            <Undo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Làm lại" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
            <Redo2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton title="Xóa định dạng" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
            <Trash2 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>

      <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleSelectFile} />
      <input type="hidden" id={name} name={name} value={content} />

      <div className="rounded-2xl border border-border/60 bg-secondary/15 p-4 text-sm text-muted-foreground">
        Mẹo: đặt con trỏ vào đúng dòng trước khi bấm <strong>Tải ảnh</strong> hoặc <strong>Chèn ảnh từ URL</strong> để ảnh xuất hiện chính xác tại vị trí mong muốn trong bài viết.
      </div>
    </div>
  )
}
