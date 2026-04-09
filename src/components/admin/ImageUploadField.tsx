'use client'

import { useState, useRef, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, X, ImageIcon, Loader2, Link as LinkIcon } from 'lucide-react'

interface ImageUploadFieldProps {
  name: string
  label: string
  defaultValue?: string
  folder?: string
  /** Show a preview of the current image */
  showPreview?: boolean
  /** Called when the URL changes (from either upload or manual input) */
  onValueChange?: (url: string) => void
}

export function ImageUploadField({
  name,
  label,
  defaultValue = '',
  folder = 'general',
  showPreview = true,
  onValueChange,
}: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    setError(null)
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
        setError(data.error || 'Upload thất bại')
        return
      }

      setValue(data.url)
      onValueChange?.(data.url)
    } catch {
      setError('Lỗi kết nối. Vui lòng thử lại.')
    } finally {
      setUploading(false)
    }
  }, [folder, onValueChange])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }, [handleUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleUpload(file)
    }
  }, [handleUpload])

  const handleClear = () => {
    setValue('')
    onValueChange?.('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>

      {/* Mode toggle */}
      <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-0.5 w-fit">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            mode === 'upload'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="h-3 w-3" />
          Tải lên
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
            mode === 'url'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LinkIcon className="h-3 w-3" />
          Nhập URL
        </button>
      </div>

      {/* Hidden input to hold the final URL value for the form */}
      <input type="hidden" name={name} value={value} />

      {mode === 'upload' ? (
        <>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
              dragOver
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-border/60 hover:border-primary/40 hover:bg-muted/30'
            } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <div className="flex flex-col items-center justify-center gap-2 py-6 px-4">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Đang tải lên...</p>
                </>
              ) : (
                <>
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">
                      Kéo thả ảnh vào đây hoặc <span className="text-primary">chọn file</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, WebP, GIF, SVG · Tối đa 5MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </>
      ) : (
        /* URL input mode */
        <Input
          placeholder="https://example.com/image.jpg"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            onValueChange?.(e.target.value)
          }}
        />
      )}

      {/* Error message */}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <X className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Preview */}
      {showPreview && value && (
        <div className="relative mt-2 inline-block group">
          <img
            src={value}
            alt="Preview"
            className="h-32 w-auto rounded-lg object-cover border border-border/40 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
          <p className="text-xs text-muted-foreground mt-1 max-w-[300px] truncate">{value}</p>
        </div>
      )}
    </div>
  )
}
