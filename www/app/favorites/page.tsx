"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import Header from "@/components/header"
import VehicleCard from "@/components/vehicle-card"

export default function FavoritesPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
      return
    }
    if (!session) return

    fetch("/api/favorites")
      .then((r) => r.json())
      .then((data) => {
        setFavorites(data)
        setLoading(false)
      })
  }, [session, isPending, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5" />
          <h1 className="text-2xl font-serif">Mes favoris</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-secondary" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-secondary rounded w-1/3" />
                  <div className="h-4 bg-secondary rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucun favori pour le moment</p>
            <p className="text-xs text-muted-foreground mt-1">Explorez les vehicules et ajoutez vos preferes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((f) => (
              <VehicleCard
                key={f.vehicleId as string}
                vehicle={{
                  id: f.vehicleId as string,
                  name: f.name as string,
                  type: f.type as string,
                  pricePerDay: f.pricePerDay as number,
                  photos: f.photos as string[],
                  address: f.address as string,
                  isActive: f.isActive as number,
                }}
                href={`/vehicles/${f.vehicleId}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
