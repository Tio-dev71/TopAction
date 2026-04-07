'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Copy, Check } from 'lucide-react'

export function MediaGrid({ assets }: { assets: any[] }) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {assets.map((asset: any) => (
        <MediaCard key={asset.id} asset={asset} />
      ))}
    </div>
  )
}

function MediaCard({ asset }: { asset: any }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(asset.public_url)
      setCopied(true)
      toast.success('Đã copy URL')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Không thể copy')
    }
  }

  return (
    <div className="group rounded-lg border border-border/60 bg-card overflow-hidden">
      <div className="aspect-square overflow-hidden bg-secondary/30">
        <img
          src={asset.public_url}
          alt={asset.alt_text || ''}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-2 flex items-center justify-between">
        <p className="text-xs text-muted-foreground truncate flex-1">{asset.storage_path}</p>
        <button onClick={handleCopy} className="ml-1 shrink-0 text-primary hover:text-primary/80">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  )
}
