"use client"

import { vehicleTypes } from "@/lib/validators"
import DateRangePicker from "./date-range-picker"

const typeLabels: Record<string, string> = {
  citadine: "Citadine",
  berline: "Berline",
  suv: "SUV",
  utilitaire: "Utilitaire",
  luxe: "Luxe",
  cabriolet: "Cabriolet",
}

interface SearchFiltersProps {
  filters: {
    type: string
    minPrice: string
    maxPrice: string
    dateRange: { from?: Date; to?: Date }
    radius: string
  }
  onChange: (filters: SearchFiltersProps["filters"]) => void
}

export default function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  function update(partial: Partial<SearchFiltersProps["filters"]>) {
    onChange({ ...filters, ...partial })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">TYPE</label>
        <select
          value={filters.type}
          onChange={(e) => update({ type: e.target.value })}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Tous les types</option>
          {vehicleTypes.map((t) => (
            <option key={t} value={t}>{typeLabels[t]}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">DATES</label>
        <DateRangePicker
          value={filters.dateRange}
          onChange={(dateRange) => update({ dateRange })}
        />
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">PRIX (EUR/JOUR)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-mono text-muted-foreground mb-1 block">RAYON (KM)</label>
        <select
          value={filters.radius}
          onChange={(e) => update({ radius: e.target.value })}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="10">10 km</option>
          <option value="25">25 km</option>
          <option value="50">50 km</option>
          <option value="100">100 km</option>
        </select>
      </div>
    </div>
  )
}
