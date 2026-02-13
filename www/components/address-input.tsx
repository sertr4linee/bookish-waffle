"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface AddressInputProps {
  value: string
  onChange: (address: string, lat?: number, lng?: number) => void
}

export default function AddressInput({ value, onChange }: AddressInputProps) {
  const [query, setQuery] = useState(value)
  const [suggestions, setSuggestions] = useState<Array<{ id: string; label: string }>>([])
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setQuery(value)
  }, [value])

  function handleInput(val: string) {
    setQuery(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (val.length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(val)}`)
      const data = await res.json()
      if (Array.isArray(data)) {
        setSuggestions(data)
        setOpen(data.length > 0)
      }
    }, 300)
  }

  async function selectSuggestion(label: string) {
    setQuery(label)
    setOpen(false)

    // Geocode the selected address
    const res = await fetch(`/api/geocode?q=${encodeURIComponent(label)}&mode=geocode`)
    const data = await res.json()
    if (data.lat && data.lng) {
      onChange(data.address || label, data.lat, data.lng)
    } else {
      onChange(label)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="Rechercher une adresse..."
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSuggestion(s.label)}
              className="w-full text-left px-3 py-2 text-sm hover:bg-secondary transition-colors flex items-center gap-2"
            >
              <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
