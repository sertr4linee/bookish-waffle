const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-700" },
  confirmed: { label: "Confirmee", className: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulee", className: "bg-red-100 text-red-700" },
  completed: { label: "Terminee", className: "bg-blue-100 text-blue-700" },
}

export default function BookingStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: "bg-secondary text-muted-foreground" }
  return (
    <span className={`text-xs font-mono px-2 py-1 rounded-full ${config.className}`}>
      {config.label.toUpperCase()}
    </span>
  )
}
