"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, LayoutDashboard, CalendarDays, MessageSquare } from "lucide-react"
import OwnerGuard from "@/components/owner-guard"

const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/vehicles", label: "Vehicules", icon: Car },
  { href: "/dashboard/bookings", label: "Reservations", icon: CalendarDays },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <OwnerGuard>
      <div className="min-h-screen bg-background">
        {/* Top bar */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 border-2 border-foreground rounded-sm flex items-center justify-center">
                <span className="text-xs font-mono">A</span>
              </div>
              <span className="font-serif text-lg tracking-tight">AutoLoc</span>
            </Link>
            <span className="text-xs font-mono text-muted-foreground">TABLEAU DE BORD</span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
          {/* Sidebar */}
          <nav className="hidden md:flex flex-col w-56 shrink-0 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </OwnerGuard>
  )
}
