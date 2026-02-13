"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { ArrowLeft, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import BookingStatusBadge from "@/components/booking-status-badge"
import MessageThread from "@/components/message-thread"

interface Booking {
  id: string
  vehicleId: string
  vehicleName: string
  vehiclePhotos: string[]
  vehicleType: string
  vehicleAddress: string
  customerId: string
  ownerId: string
  startDate: string
  endDate: string
  totalPrice: number
  status: string
  createdAt: string
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/bookings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data)
        setLoading(false)
      })
  }, [id])

  async function updateStatus(status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const data = await res.json()
      setBooking((prev) => prev ? { ...prev, status: data.status } : prev)
    }
  }

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  const isOwner = session?.user.id === booking.ownerId
  const isCustomer = session?.user.id === booking.customerId

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link
          href={isOwner ? "/dashboard/bookings" : "/bookings"}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-serif">Reservation</h1>
            <p className="text-xs font-mono text-muted-foreground mt-1">REF: {booking.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Vehicle info */}
        <div className="flex gap-4 bg-card border border-border rounded-xl p-4 mb-6">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary shrink-0">
            {booking.vehiclePhotos[0] ? (
              <Image src={booking.vehiclePhotos[0]} alt={booking.vehicleName} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="flex items-center justify-center h-full"><Car className="w-6 h-6 text-muted-foreground" /></div>
            )}
          </div>
          <div>
            <Link href={`/vehicles/${booking.vehicleId}`} className="font-medium hover:text-primary transition-colors">
              {booking.vehicleName}
            </Link>
            <p className="text-sm text-muted-foreground">{booking.vehicleAddress}</p>
          </div>
        </div>

        {/* Details */}
        <div className="bg-card border border-border rounded-xl divide-y divide-border mb-6">
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Dates</span>
            <span className="text-sm font-medium">{booking.startDate} → {booking.endDate}</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-sm font-semibold">{(booking.totalPrice / 100).toFixed(0)} EUR</span>
          </div>
          <div className="flex justify-between px-4 py-3">
            <span className="text-sm text-muted-foreground">Creee le</span>
            <span className="text-sm">{new Date(booking.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          {isOwner && booking.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus("confirmed")}
                className="flex-1 bg-green-600 text-white py-2.5 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Accepter
              </button>
              <button
                onClick={() => updateStatus("cancelled")}
                className="flex-1 border border-border py-2.5 rounded-full text-sm font-medium hover:bg-secondary transition-colors"
              >
                Refuser
              </button>
            </>
          )}
          {isOwner && booking.status === "confirmed" && (
            <button
              onClick={() => updateStatus("completed")}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Marquer comme terminee
            </button>
          )}
          {isCustomer && (booking.status === "pending" || booking.status === "confirmed") && (
            <button
              onClick={() => updateStatus("cancelled")}
              className="flex-1 border border-red-200 text-red-700 py-2.5 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
            >
              Annuler la reservation
            </button>
          )}
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-sm font-mono text-muted-foreground mb-3">MESSAGES</h2>
          <MessageThread bookingId={booking.id} />
        </div>
      </div>
    </div>
  )
}
