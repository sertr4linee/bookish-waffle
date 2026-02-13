"use client"

import { useParams } from "next/navigation"
import AvailabilityCalendar from "@/components/availability-calendar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function VehicleAvailabilityPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <Link
          href={`/dashboard/vehicles/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au vehicule
        </Link>
        <h1 className="text-2xl font-serif">Disponibilites</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Cliquez sur une date pour la bloquer. Cliquez deux dates pour bloquer une periode.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <AvailabilityCalendar vehicleId={id} />
      </div>
    </div>
  )
}
