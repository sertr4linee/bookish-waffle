"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AddressInput from "./address-input"
import PhotoUpload from "./photo-upload"
import { vehicleTypes } from "@/lib/validators"

const typeLabels: Record<string, string> = {
  citadine: "Citadine",
  berline: "Berline",
  suv: "SUV",
  utilitaire: "Utilitaire",
  luxe: "Luxe",
  cabriolet: "Cabriolet",
}

interface VehicleFormProps {
  vehicle?: {
    id: string
    name: string
    type: string
    description: string
    pricePerDay: number
    photos: string[]
    address: string
    lat: number | null
    lng: number | null
    accessMethod: string
    isActive: number
  }
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter()
  const isEdit = !!vehicle

  const [name, setName] = useState(vehicle?.name ?? "")
  const [type, setType] = useState(vehicle?.type ?? "citadine")
  const [description, setDescription] = useState(vehicle?.description ?? "")
  const [priceEur, setPriceEur] = useState(vehicle ? (vehicle.pricePerDay / 100).toString() : "")
  const [address, setAddress] = useState(vehicle?.address ?? "")
  const [lat, setLat] = useState<number | undefined>(vehicle?.lat ?? undefined)
  const [lng, setLng] = useState<number | undefined>(vehicle?.lng ?? undefined)
  const [accessMethod, setAccessMethod] = useState(vehicle?.accessMethod ?? "")
  const [photos, setPhotos] = useState<string[]>(vehicle?.photos ?? [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const pricePerDay = Math.round(parseFloat(priceEur) * 100)
    if (isNaN(pricePerDay) || pricePerDay < 100) {
      setError("Prix minimum : 1 EUR/jour")
      setLoading(false)
      return
    }

    const body = { name, type, description, pricePerDay, address, lat, lng, accessMethod }

    try {
      const url = isEdit ? `/api/vehicles/${vehicle.id}` : "/api/vehicles"
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Une erreur est survenue")
        setLoading(false)
        return
      }

      router.push("/dashboard/vehicles")
      router.refresh()
    } catch {
      setError("Erreur de connexion")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nom du vehicule</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Ex: Renault Clio 2022"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {vehicleTypes.map((t) => (
              <option key={t} value={t}>{typeLabels[t]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Decrivez votre vehicule..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Prix par jour (EUR)</label>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={priceEur}
            onChange={(e) => setPriceEur(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="45"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
          <AddressInput
            value={address}
            onChange={(addr, newLat, newLng) => {
              setAddress(addr)
              if (newLat) setLat(newLat)
              if (newLng) setLng(newLng)
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Methode d&apos;acces</label>
          <textarea
            value={accessMethod}
            onChange={(e) => setAccessMethod(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            placeholder="Ex: Boite a cles sous le porche, code 1234"
          />
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Photos</label>
        <PhotoUpload
          vehicleId={vehicle?.id}
          photos={photos}
          onPhotosChange={setPhotos}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : isEdit ? "Mettre a jour" : "Creer le vehicule"}
        </button>
      </div>
    </form>
  )
}
