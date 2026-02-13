"use client"

import { useState, useEffect } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { CalendarDays } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import BookingStatusBadge from "@/components/booking-status-badge"

export default function BookingsPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
      return
    }
    if (!session) return

    fetch("/api/bookings?role=customer")
      .then((r) => r.json())
      .then((data) => {
        setBookings(data)
        setLoading(false)
      })
  }, [session, isPending, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-6">
          <CalendarDays className="w-5 h-5" />
          <h1 className="text-2xl font-serif">Mes reservations</h1>
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
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl">
            <CalendarDays className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Aucune reservation</p>
            <Link href="/search" className="text-sm text-primary hover:underline mt-2 inline-block">
              Rechercher un vehicule
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((b) => (
              <Link
                key={b.id as string}
                href={`/bookings/${b.id}`}
                className="flex items-center justify-between bg-card border border-border rounded-xl p-4 hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{b.vehicleName as string}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {b.startDate as string} → {b.endDate as string}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((b.totalPrice as number) / 100).toFixed(0)} EUR
                  </p>
                </div>
                <BookingStatusBadge status={b.status as string} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
