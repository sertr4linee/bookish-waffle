"use client"

import VehicleForm from "@/components/vehicle-form"

export default function NewVehiclePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif">Nouveau vehicule</h1>
        <p className="text-sm text-muted-foreground mt-1">Remplissez les informations de votre vehicule</p>
      </div>
      <VehicleForm />
    </div>
  )
}
