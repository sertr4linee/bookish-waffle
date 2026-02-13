"use client"

import { useState, useEffect } from "react"
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slot {
  id: string
  startDate: string
  endDate: string
  reason: "blocked" | "booked"
}

interface AvailabilityCalendarProps {
  vehicleId: string
}

export default function AvailabilityCalendar({ vehicleId }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [slots, setSlots] = useState<Slot[]>([])
  const [selecting, setSelecting] = useState<{ start: string; end: string | null } | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSlots()
  }, [vehicleId])

  async function fetchSlots() {
    const res = await fetch(`/api/vehicles/${vehicleId}/availability`)
    const data = await res.json()
    setSlots(data)
  }

  function isDateBlocked(dateStr: string) {
    return slots.some(
      (s) => s.reason === "blocked" && dateStr >= s.startDate && dateStr <= s.endDate
    )
  }

  function isDateBooked(dateStr: string) {
    return slots.some(
      (s) => s.reason === "booked" && dateStr >= s.startDate && dateStr <= s.endDate
    )
  }

  function handleDayClick(dateStr: string) {
    if (isDateBooked(dateStr)) return
    if (isBefore(new Date(dateStr), startOfDay(new Date()))) return

    if (isDateBlocked(dateStr)) {
      // Find and unblock the slot containing this date
      const slot = slots.find(
        (s) => s.reason === "blocked" && dateStr >= s.startDate && dateStr <= s.endDate
      )
      if (slot) {
        toggleBlock(slot.startDate, slot.endDate, "unblock")
      }
      return
    }

    if (!selecting) {
      setSelecting({ start: dateStr, end: null })
    } else if (!selecting.end) {
      const start = selecting.start < dateStr ? selecting.start : dateStr
      const end = selecting.start < dateStr ? dateStr : selecting.start
      setSelecting(null)
      toggleBlock(start, end, "block")
    }
  }

  async function toggleBlock(startDate: string, endDate: string, action: "block" | "unblock") {
    setLoading(true)
    await fetch(`/api/vehicles/${vehicleId}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate, action }),
    })
    await fetchSlots()
    setLoading(false)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startDay = monthStart.getDay() || 7 // Monday = 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="font-medium capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h3>
        <button
          type="button"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <div key={d} className="text-xs font-mono text-muted-foreground py-2">{d}</div>
        ))}

        {/* Empty cells for offset */}
        {Array.from({ length: startDay - 1 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd")
          const blocked = isDateBlocked(dateStr)
          const booked = isDateBooked(dateStr)
          const past = isBefore(day, startOfDay(new Date()))
          const isSelecting = selecting?.start === dateStr

          return (
            <button
              key={dateStr}
              type="button"
              disabled={past || loading}
              onClick={() => handleDayClick(dateStr)}
              className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors
                ${past ? "text-muted-foreground/30 cursor-default" : "hover:bg-secondary cursor-pointer"}
                ${blocked ? "bg-red-100 text-red-700 hover:bg-red-200" : ""}
                ${booked ? "bg-blue-100 text-blue-700 cursor-not-allowed" : ""}
                ${isSelecting ? "ring-2 ring-primary" : ""}
                ${isToday(day) ? "font-bold" : ""}
              `}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          <span className="text-muted-foreground">Bloque</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
          <span className="text-muted-foreground">Reserve</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-card border border-border" />
          <span className="text-muted-foreground">Disponible</span>
        </div>
      </div>

      {selecting && (
        <p className="text-xs text-primary">
          Selectionnez la date de fin pour bloquer la periode
        </p>
      )}
    </div>
  )
}
