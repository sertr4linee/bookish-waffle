"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { Car, CalendarDays, TrendingUp } from "lucide-react"
import Link from "next/link"

interface Stats {
  totalVehicles: number
  activeVehicles: number
  totalBookings: number
  pendingBookings: number
  revenue: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentBookings, setRecentBookings] = useState<Array<Record<string, unknown>>>([])

  useEffect(() => {
    if (!session) return

    // Fetch vehicles for stats
    fetch(`/api/vehicles?ownerId=${session.user.id}`)
      .then((r) => r.json())
      .then((vehicles: Array<Record<string, unknown>>) => {
        setStats((prev) => ({
          ...prev!,
          totalVehicles: vehicles.length,
          activeVehicles: vehicles.filter((v) => v.isActive).length,
          totalBookings: prev?.totalBookings ?? 0,
          pendingBookings: prev?.pendingBookings ?? 0,
          revenue: prev?.revenue ?? 0,
        }))
      })

    // Fetch bookings
    fetch("/api/bookings?role=owner")
      .then((r) => r.json())
      .then((bookings: Array<Record<string, unknown>>) => {
        setRecentBookings(bookings.slice(0, 5))
        const totalRevenue = bookings
          .filter((b) => b.status === "completed" || b.status === "confirmed")
          .reduce((sum, b) => sum + (b.totalPrice as number), 0)
        setStats((prev) => ({
          totalVehicles: prev?.totalVehicles ?? 0,
          activeVehicles: prev?.activeVehicles ?? 0,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === "pending").length,
          revenue: totalRevenue,
        }))
      })
      .catch(() => {})
  }, [session])

  const statCards = [
    { label: "Vehicules actifs", value: stats?.activeVehicles ?? 0, icon: Car },
    { label: "Reservations", value: stats?.totalBookings ?? 0, icon: CalendarDays },
    { label: "En attente", value: stats?.pendingBookings ?? 0, icon: CalendarDays },
    { label: "Revenus", value: `${((stats?.revenue ?? 0) / 100).toFixed(0)} EUR`, icon: TrendingUp },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif">Bonjour, {session?.user.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Voici un apercu de votre activite</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono text-muted-foreground">{card.label.toUpperCase()}</span>
            </div>
            <p className="text-2xl font-serif">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/dashboard/vehicles/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Car className="w-4 h-4" />
          Ajouter un vehicule
        </Link>
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 border border-border px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
        >
          Voir les reservations
        </Link>
      </div>

      {/* Recent bookings */}
      {recentBookings.length > 0 && (
        <div>
          <h2 className="text-sm font-mono text-muted-foreground mb-3">RESERVATIONS RECENTES</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {recentBookings.map((booking) => (
              <Link
                key={booking.id as string}
                href={`/dashboard/bookings/${booking.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{booking.startDate as string} → {booking.endDate as string}</p>
                  <p className="text-xs text-muted-foreground">{((booking.totalPrice as number) / 100).toFixed(0)} EUR</p>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                  booking.status === "pending" ? "bg-amber-100 text-amber-700" :
                  booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                  booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {(booking.status as string).toUpperCase()}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
