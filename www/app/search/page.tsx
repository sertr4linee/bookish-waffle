"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { Search, SlidersHorizontal, Map, List } from "lucide-react"
import SearchFilters from "@/components/search-filters"
import SearchMap from "@/components/search-map"
import VehicleCard from "@/components/vehicle-card"
import Header from "@/components/header"

interface Vehicle {
  id: string
  name: string
  type: string
  pricePerDay: number
  photos: string[]
  address: string
  lat: number | null
  lng: number | null
  isActive: number
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-sm text-muted-foreground">Chargement...</p></div>}>
      <SearchPageInner />
    </Suspense>
  )
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [mobileView, setMobileView] = useState<"list" | "map">("list")
  const [query, setQuery] = useState(searchParams.get("q") || "")
  const [center, setCenter] = useState<{ lat: number; lng: number } | undefined>()

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    dateRange: {} as { from?: Date; to?: Date },
    radius: searchParams.get("radius") || "25",
  })

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()

    if (filters.type) params.set("type", filters.type)
    if (filters.minPrice) params.set("minPrice", String(Number(filters.minPrice) * 100))
    if (filters.maxPrice) params.set("maxPrice", String(Number(filters.maxPrice) * 100))
    if (filters.dateRange.from) params.set("startDate", format(filters.dateRange.from, "yyyy-MM-dd"))
    if (filters.dateRange.to) params.set("endDate", format(filters.dateRange.to, "yyyy-MM-dd"))
    if (center) {
      params.set("lat", String(center.lat))
      params.set("lng", String(center.lng))
      params.set("radius", filters.radius)
    }

    const res = await fetch(`/api/vehicles?${params}`)
    const data = await res.json()
    setVehicles(data)
    setLoading(false)
  }, [filters, center])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Geocode search query
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}&mode=geocode`)
    const data = await res.json()
    if (data.lat && data.lng) {
      setCenter({ lat: data.lat, lng: data.lng })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Search bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher une ville ou un lieu..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors hidden sm:block"
            >
              Rechercher
            </button>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg sm:hidden"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden border border-border px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6">
          {/* Left: Filters + List */}
          <div className={`w-full md:w-1/2 lg:w-2/5 space-y-4 md:space-y-6 ${mobileView === "map" ? "hidden md:block" : ""}`}>
            {/* Filters */}
            <div className={`bg-card border border-border rounded-xl p-4 ${showFilters ? "block" : "hidden md:block"}`}>
              <h3 className="text-xs font-mono text-muted-foreground mb-3">FILTRES</h3>
              <SearchFilters filters={filters} onChange={setFilters} />
            </div>

            {/* Results */}
            <div>
              <p className="text-xs font-mono text-muted-foreground mb-3">
                {loading ? "RECHERCHE..." : `${vehicles.length} RESULTAT${vehicles.length !== 1 ? "S" : ""}`}
              </p>
              <div className="space-y-3">
                {vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    href={`/vehicles/${v.id}`}
                  />
                ))}
                {!loading && vehicles.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Aucun vehicule trouve. Essayez d&apos;elargir vos criteres.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div className={`md:w-1/2 lg:w-3/5 sticky top-24 h-[calc(100vh-8rem)] ${mobileView === "map" ? "w-full" : "hidden md:block"}`}>
            <SearchMap
              vehicles={vehicles}
              center={center}
              onVehicleClick={(id) => router.push(`/vehicles/${id}`)}
            />
          </div>
        </div>
      </div>

      {/* Mobile view toggle */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full text-sm font-medium shadow-lg hover:bg-primary/90 transition-colors"
        >
          {mobileView === "list" ? (
            <>
              <Map className="w-4 h-4" />
              Carte
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              Liste
            </>
          )}
        </button>
      </div>
    </div>
  )
}
