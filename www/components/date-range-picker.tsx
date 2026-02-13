"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarDays } from "lucide-react"
import { DayPicker, type DateRange } from "react-day-picker"

interface DateRangePickerProps {
  value: { from?: Date; to?: Date }
  onChange: (range: { from?: Date; to?: Date }) => void
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)

  const label =
    value.from && value.to
      ? `${format(value.from, "d MMM", { locale: fr })} - ${format(value.to, "d MMM", { locale: fr })}`
      : "Choisir les dates"

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-left hover:border-primary/50 transition-colors"
      >
        <CalendarDays className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className={value.from ? "text-foreground" : "text-muted-foreground"}>{label}</span>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 bg-card border border-border rounded-xl shadow-lg p-3">
          <DayPicker
            mode="range"
            selected={value as DateRange}
            onSelect={(range) => {
              onChange({ from: range?.from, to: range?.to })
              if (range?.from && range?.to) setOpen(false)
            }}
            locale={fr}
            disabled={{ before: new Date() }}
            numberOfMonths={2}
          />
        </div>
      )}
    </div>
  )
}
