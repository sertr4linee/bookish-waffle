"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Plus } from "lucide-react"
import Link from "next/link"
import VehicleCard from "@/components/vehicle-card"

export default function DashboardVehiclesPage() {
  const { data: session } = useSession()
  const [vehicles, setVehicles] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) return
    fetch(`/api/vehicles?ownerId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicles(data)
        setLoading(false)
      })
  }, [session])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif">Mes vehicules</h1>
          <p className="text-sm text-muted-foreground mt-1">{vehicles.length} vehicule{vehicles.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </Link>
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
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground mb-4">Aucun vehicule pour le moment</p>
          <Link
            href="/dashboard/vehicles/new"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter mon premier vehicule
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id as string}
              vehicle={v as Parameters<typeof VehicleCard>[0]["vehicle"]}
              href={`/dashboard/vehicles/${v.id}`}
              showStatus
            />
          ))}
        </div>
      )}
    </div>
  )
}
