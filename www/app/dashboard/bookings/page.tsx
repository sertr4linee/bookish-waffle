"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import BookingStatusBadge from "@/components/booking-status-badge"

export default function DashboardBookingsPage() {
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    fetch("/api/bookings?role=owner")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Reservations</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerez les reservations de vos vehicules</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { value: "all", label: "Toutes" },
          { value: "pending", label: "En attente" },
          { value: "confirmed", label: "Confirmees" },
          { value: "completed", label: "Terminees" },
          { value: "cancelled", label: "Annulees" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === tab.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
              <div className="h-3 bg-secondary rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 bg-card border border-dashed border-border rounded-2xl">
          <p className="text-muted-foreground text-sm">Aucune reservation</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl divide-y divide-border">
          {filtered.map((b) => (
            <Link
              key={b.id as string}
              href={`/dashboard/bookings/${b.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors"
            >
              <div>
                <p className="font-medium text-sm">{b.vehicleName as string}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {b.startDate as string} → {b.endDate as string} — {((b.totalPrice as number) / 100).toFixed(0)} EUR
                </p>
              </div>
              <BookingStatusBadge status={b.status as string} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
