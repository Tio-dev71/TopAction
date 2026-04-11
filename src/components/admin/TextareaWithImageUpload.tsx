'use client'

import React, { useRef, useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface TextareaWithImageUploadProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  folder?: string
  onValueChange?: (value: string) => void
}

export function TextareaWithImageUpload({
  folder = 'general',
  onChange,
  onValueChange,
  defaultValue,
  value,
  ...props
}: TextareaWithImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [internalValue, setInternalValue] = useState(value || defaultValue || '')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value)
    if (onChange) onChange(e)
    if (onValueChange) onValueChange(e.target.value)
  }

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const startPos = textarea.selectionStart
    const endPos = textarea.selectionEnd
    const currentVal = textarea.value

    const newVal = currentVal.substring(0, startPos) + textToInsert + currentVal.substring(endPos)
    
    setInternalValue(newVal)
    
    // Simulate an onChange event so the parent form logic gets the new value
    const event = {
      target: { value: newVal, name: props.name || '' },
      currentTarget: { value: newVal, name: props.name || '' }
    } as unknown as React.ChangeEvent<HTMLTextAreaElement>
    
    if (onChange) onChange(event)
    if (onValueChange) onValueChange(newVal)

    // Restore focus and cursor position after React re-render
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(startPos + textToInsert.length, startPos + textToInsert.length)
    }, 0)
  }

  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
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
        toast.error(data.error || 'Upload thất bại')
        return
      }

      // Insert HTML image tag
      const imageHtml = `\n<img src="${data.url}" alt="Image" style="width: 100%; max-width: 800px; border-radius: 8px; margin: 16px auto; display: block;" />\n`
      insertTextAtCursor(imageHtml)
      toast.success('Đã tải ảnh lên thành công!')
    } catch (e) {
      toast.error('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [folder])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="relative border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring">
      <div className="flex items-center px-3 py-2 border-b border-input bg-muted/30">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 font-medium"
          onClick={() => !isUploading && fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <ImageIcon className="h-3.5 w-3.5" />
          )}
          Chèn ảnh
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <Textarea
        ref={textareaRef}
        {...props}
        value={internalValue}
        onChange={handleChange}
        className={`border-0 focus-visible:ring-0 rounded-none resize-y min-h-[200px] ${props.className || ''}`}
      />
    </div>
  )
}
