"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { MapPin, Calendar, Key, Car, Heart, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import { useSession } from "@/lib/auth-client"

interface Vehicle {
  id: string
  ownerId: string
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
  createdAt: string
}

const typeLabels: Record<string, string> = {
  citadine: "Citadine",
  berline: "Berline",
  suv: "SUV",
  utilitaire: "Utilitaire",
  luxe: "Luxe",
  cabriolet: "Cabriolet",
}

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPhoto, setCurrentPhoto] = useState(0)
  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicle(data)
        setLoading(false)
      })
  }, [id])

  // Check favorite status
  useEffect(() => {
    if (!session) return
    fetch("/api/favorites")
      .then((r) => r.json())
      .then((favs: Array<{ vehicleId: string }>) => {
        setIsFav(favs.some((f) => f.vehicleId === id))
      })
      .catch(() => {})
  }, [session, id])

  async function toggleFavorite() {
    await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId: id }),
    })
    setIsFav(!isFav)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-80 bg-secondary rounded-2xl" />
            <div className="h-6 bg-secondary rounded w-1/3" />
            <div className="h-4 bg-secondary rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">Vehicule introuvable</p>
        </div>
      </div>
    )
  }

  const isOwner = session && session.user.id === vehicle.ownerId

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-5xl mx-auto px-6 py-8">
        <Link
          href="/search"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour a la recherche
        </Link>

        {/* Photo carousel */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-secondary mb-8">
          {vehicle.photos.length > 0 ? (
            <>
              <Image
                src={vehicle.photos[currentPhoto]}
                alt={vehicle.name}
                fill
                className="object-cover"
                priority
              />
              {vehicle.photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicle.photos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhoto(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentPhoto ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Car className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono text-muted-foreground">
                  {typeLabels[vehicle.type] ?? vehicle.type}
                </span>
                <h1 className="text-3xl font-serif mt-1">{vehicle.name}</h1>
                {vehicle.address && (
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    {vehicle.address}
                  </p>
                )}
              </div>
              {session && !isOwner && (
                <button
                  onClick={toggleFavorite}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                </button>
              )}
            </div>

            {vehicle.description && (
              <div>
                <h2 className="text-sm font-mono text-muted-foreground mb-2">DESCRIPTION</h2>
                <p className="text-sm text-foreground leading-relaxed">{vehicle.description}</p>
              </div>
            )}

            {vehicle.accessMethod && (
              <div>
                <h2 className="text-sm font-mono text-muted-foreground mb-2">
                  <Key className="w-3 h-3 inline mr-1" />
                  METHODE D&apos;ACCES
                </h2>
                <p className="text-sm text-foreground">{vehicle.accessMethod}</p>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif">{(vehicle.pricePerDay / 100).toFixed(0)} EUR</span>
                <span className="text-sm text-muted-foreground">/jour</span>
              </div>

              {!isOwner && session && (
                <Link
                  href={`/vehicles/${vehicle.id}/book`}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Reserver
                </Link>
              )}

              {!session && (
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Connectez-vous pour reserver
                </Link>
              )}

              {isOwner && (
                <Link
                  href={`/dashboard/vehicles/${vehicle.id}`}
                  className="flex items-center justify-center gap-2 w-full border border-border px-4 py-3 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
                >
                  Modifier mon vehicule
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
