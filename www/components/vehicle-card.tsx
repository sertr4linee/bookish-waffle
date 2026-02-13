"use client"

import { MapPin, Car } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface VehicleCardProps {
  vehicle: {
    id: string
    name: string
    type: string
    pricePerDay: number
    photos: string[]
    address: string
    isActive: number
  }
  href?: string
  showStatus?: boolean
}

const typeLabels: Record<string, string> = {
  citadine: "Citadine",
  berline: "Berline",
  suv: "SUV",
  utilitaire: "Utilitaire",
  luxe: "Luxe",
  cabriolet: "Cabriolet",
}

export default function VehicleCard({ vehicle, href, showStatus }: VehicleCardProps) {
  const content = (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3] bg-secondary">
        {vehicle.photos[0] ? (
          <Image
            src={vehicle.photos[0]}
            alt={vehicle.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Car className="w-8 h-8 text-muted-foreground" />
          </div>
        )}
        {showStatus && (
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-mono ${
            vehicle.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {vehicle.isActive ? "ACTIF" : "INACTIF"}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-muted-foreground">
            {typeLabels[vehicle.type] ?? vehicle.type}
          </span>
          <span className="text-sm font-semibold">
            {(vehicle.pricePerDay / 100).toFixed(0)} EUR<span className="text-xs text-muted-foreground font-normal">/jour</span>
          </span>
        </div>
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {vehicle.name}
        </h3>
        {vehicle.address && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="w-3 h-3" />
            {vehicle.address}
          </p>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}
