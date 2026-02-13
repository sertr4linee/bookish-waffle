"use client"

import { useEffect, useRef } from "react"

interface Vehicle {
  id: string
  name: string
  lat: number | null
  lng: number | null
  pricePerDay: number
}

interface SearchMapProps {
  vehicles: Vehicle[]
  center?: { lat: number; lng: number }
  onVehicleClick?: (id: string) => void
}

declare global {
  interface Window {
    H: typeof H
  }
}

declare namespace H {
  class Map {
    constructor(element: HTMLElement, layer: unknown, options: Record<string, unknown>)
    getViewModel(): { setLookAtData(data: Record<string, unknown>): void }
    addObject(obj: unknown): void
    removeObjects(objs: unknown[]): void
    getObjects(): unknown[]
    dispose(): void
  }
  namespace map {
    class Marker {
      constructor(coords: { lat: number; lng: number })
      addEventListener(event: string, cb: () => void): void
      setData(data: unknown): void
      getData(): unknown
    }
  }
  namespace service {
    class Platform {
      constructor(options: Record<string, unknown>)
      createDefaultLayers(): Record<string, Record<string, unknown>>
    }
  }
  namespace mapevents {
    class MapEvents {
      constructor(map: H.Map)
    }
    class Behavior {
      constructor(events: MapEvents)
    }
  }
  namespace ui {
    class UI {
      static createDefault(map: H.Map, layers: unknown): UI
    }
  }
}

export default function SearchMap({ vehicles, center, onVehicleClick }: SearchMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<H.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_HERE_API_KEY
    if (!apiKey) return

    // Load HERE Maps scripts
    const scripts = [
      "https://js.api.here.com/v3/3.1/mapsjs-core.js",
      "https://js.api.here.com/v3/3.1/mapsjs-service.js",
      "https://js.api.here.com/v3/3.1/mapsjs-ui.js",
      "https://js.api.here.com/v3/3.1/mapsjs-mapevents.js",
    ]

    let loaded = 0
    const existing = document.querySelectorAll('script[src*="mapsjs"]')
    if (existing.length >= 4) {
      initMap()
      return
    }

    scripts.forEach((src) => {
      const script = document.createElement("script")
      script.src = src
      script.async = false
      script.onload = () => {
        loaded++
        if (loaded === scripts.length) initMap()
      }
      document.head.appendChild(script)
    })

    // Load CSS
    if (!document.querySelector('link[href*="mapsjs-ui"]')) {
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://js.api.here.com/v3/3.1/mapsjs-ui.css"
      document.head.appendChild(link)
    }

    function initMap() {
      if (!mapRef.current || !window.H) return

      const platform = new window.H.service.Platform({ apikey: apiKey })
      const layers = platform.createDefaultLayers()

      const map = new window.H.Map(mapRef.current, layers.vector.normal, {
        zoom: 12,
        center: center || { lat: 48.8566, lng: 2.3522 },
      })

      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map))
      window.H.ui.UI.createDefault(map, layers)

      mapInstanceRef.current = map
    }

    return () => {
      mapInstanceRef.current?.dispose()
      mapInstanceRef.current = null
    }
  }, [])

  // Update markers when vehicles change
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    // Clear existing markers
    const objects = map.getObjects()
    if (objects.length > 0) {
      map.removeObjects(objects)
    }

    // Add markers
    vehicles.forEach((v) => {
      if (v.lat == null || v.lng == null) return
      const marker = new window.H.map.Marker({ lat: v.lat, lng: v.lng })
      marker.setData(v.id)
      marker.addEventListener("tap", () => onVehicleClick?.(v.id))
      map.addObject(marker)
    })

    // Center on first vehicle if no center specified
    if (!center && vehicles.length > 0) {
      const first = vehicles.find((v) => v.lat != null && v.lng != null)
      if (first) {
        map.getViewModel().setLookAtData({
          position: { lat: first.lat, lng: first.lng },
          zoom: 12,
        })
      }
    }
  }, [vehicles, center, onVehicleClick])

  // Update center
  useEffect(() => {
    if (center && mapInstanceRef.current) {
      mapInstanceRef.current.getViewModel().setLookAtData({
        position: center,
        zoom: 12,
      })
    }
  }, [center])

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-xl" />
}
