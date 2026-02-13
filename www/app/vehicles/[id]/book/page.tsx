"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { format, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"
import { ArrowLeft, Car } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import DateRangePicker from "@/components/date-range-picker"
import Header from "@/components/header"

interface Vehicle {
  id: string
  name: string
  type: string
  pricePerDay: number
  photos: string[]
  address: string
}

export default function BookVehiclePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in")
      return
    }
    fetch(`/api/vehicles/${id}`)
      .then((r) => r.json())
      .then(setVehicle)
  }, [id, session, isPending, router])

  const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 0
  const totalPrice = vehicle ? (days * vehicle.pricePerDay) / 100 : 0

  async function handleBook() {
    if (!dateRange.from || !dateRange.to) {
      setError("Veuillez selectionner les dates")
      return
    }
    setError("")
    setLoading(true)

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: id,
        startDate: format(dateRange.from, "yyyy-MM-dd"),
        endDate: format(dateRange.to, "yyyy-MM-dd"),
      }),
    })
    const data = await res.json()

    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Une erreur est survenue")
      setLoading(false)
      return
    }

    router.push(`/bookings/${data.id}`)
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-lg mx-auto px-6 py-12">
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-lg mx-auto px-6 py-8">
        <Link
          href={`/vehicles/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au vehicule
        </Link>

        <h1 className="text-2xl font-serif mb-6">Reserver</h1>

        {/* Vehicle summary */}
        <div className="flex gap-4 bg-card border border-border rounded-xl p-4 mb-6">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary shrink-0">
            {vehicle.photos[0] ? (
              <Image src={vehicle.photos[0]} alt={vehicle.name} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex items-center justify-center h-full"><Car className="w-5 h-5 text-muted-foreground" /></div>
            )}
          </div>
          <div>
            <h2 className="font-medium">{vehicle.name}</h2>
            <p className="text-sm text-muted-foreground">{vehicle.address}</p>
            <p className="text-sm font-semibold mt-1">{(vehicle.pricePerDay / 100).toFixed(0)} EUR/jour</p>
          </div>
        </div>

        {/* Date selection */}
        <div className="space-y-4 mb-6">
          <label className="text-sm font-medium">Dates de location</label>
          <DateRangePicker value={dateRange} onChange={setDateRange} />
        </div>

        {/* Price summary */}
        {days > 0 && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {(vehicle.pricePerDay / 100).toFixed(0)} EUR x {days} jour{days > 1 ? "s" : ""}
              </span>
              <span>{totalPrice.toFixed(0)} EUR</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{totalPrice.toFixed(0)} EUR</span>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <button
          onClick={handleBook}
          disabled={loading || days <= 0}
          className="w-full bg-primary text-primary-foreground py-3 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? "Reservation en cours..." : `Confirmer — ${totalPrice.toFixed(0)} EUR`}
        </button>
      </div>
    </div>
  )
}
