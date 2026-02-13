"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import VehicleForm from "@/components/vehicle-form"
import Link from "next/link"
import { CalendarDays, Trash2 } from "lucide-react"

export default function EditVehiclePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setVehicle(data)
        setLoading(false)
      })
  }, [id])

  async function handleToggleActive() {
    await fetch(`/api/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !vehicle?.isActive }),
    })
    setVehicle((prev) => prev ? { ...prev, isActive: prev.isActive ? 0 : 1 } : prev)
  }

  async function handleDelete() {
    if (!confirm("Supprimer ce vehicule ? Cette action est irreversible.")) return
    setDeleting(true)
    await fetch(`/api/vehicles/${id}`, { method: "DELETE" })
    router.push("/dashboard/vehicles")
  }

  if (loading) {
    return <div className="text-sm text-muted-foreground">Chargement...</div>
  }

  if (!vehicle) {
    return <div className="text-sm text-destructive">Vehicule introuvable</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif">Modifier le vehicule</h1>
          <p className="text-sm text-muted-foreground mt-1">{vehicle.name as string}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/vehicles/${id}/availability`}
            className="inline-flex items-center gap-2 border border-border px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            <CalendarDays className="w-4 h-4" />
            Disponibilites
          </Link>
          <button
            onClick={handleToggleActive}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              vehicle.isActive ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-700 hover:bg-green-100"
            }`}
          >
            {vehicle.isActive ? "Desactiver" : "Activer"}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <VehicleForm vehicle={vehicle as Parameters<typeof VehicleForm>[0]["vehicle"]} />
    </div>
  )
}
