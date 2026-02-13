"use client"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface PhotoUploadProps {
  vehicleId?: string
  photos: string[]
  onPhotosChange: (photos: string[]) => void
  maxPhotos?: number
}

export default function PhotoUpload({ vehicleId, photos, onPhotosChange, maxPhotos = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(files: FileList) {
    if (!vehicleId) return
    setUploading(true)

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append("photos", file))

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}/photos`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      if (data.photos) {
        onPhotosChange(data.photos)
      }
    } finally {
      setUploading(false)
    }
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index)
    onPhotosChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {photos.map((url, i) => (
          <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-border">
            <Image src={url} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="120px" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || !vehicleId}
            className="aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">AJOUTER</span>
              </>
            )}
          </button>
        )}
      </div>
      {!vehicleId && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          Sauvegardez le vehicule d&apos;abord pour ajouter des photos
        </p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
      />
    </div>
  )
}
