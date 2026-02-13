"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "@/lib/auth-client"
import { Search, CalendarDays, Heart, LayoutDashboard, User, LogOut, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function Header() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userType = (session?.user as Record<string, unknown> | undefined)?.userType as string | undefined
  const isLanding = pathname === "/"

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-foreground rounded-sm flex items-center justify-center">
            <span className="text-xs font-mono">A</span>
          </div>
          <span className="font-serif text-lg tracking-tight">AutoLoc</span>
        </Link>

        {/* Navigation by role */}
        {!session ? (
          // Unauthenticated
          <>
            {isLanding && (
              <nav className="hidden md:flex items-center gap-8">
                <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Avantages
                </Link>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Tarifs
                </Link>
                <Link href="#manifesto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Comment ca marche
                </Link>
              </nav>
            )}
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                Connexion
              </Link>
              <Link
                href="/sign-up"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Commencer
              </Link>
            </div>
          </>
        ) : userType === "customer" ? (
          // Customer navigation
          <>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="/search" icon={Search} label="Rechercher" pathname={pathname} />
              <NavLink href="/bookings" icon={CalendarDays} label="Reservations" pathname={pathname} />
              <NavLink href="/favorites" icon={Heart} label="Favoris" pathname={pathname} />
            </nav>
            <ProfileDropdown name={session.user.name ?? "Profil"} />
          </>
        ) : userType === "owner" ? (
          // Owner navigation
          <>
            <nav className="hidden md:flex items-center gap-6">
              <NavLink href="/search" icon={Search} label="Rechercher" pathname={pathname} />
              <NavLink href="/dashboard" icon={LayoutDashboard} label="Tableau de bord" pathname={pathname} />
            </nav>
            <ProfileDropdown name={session.user.name ?? "Profil"} />
          </>
        ) : (
          // Authenticated but no role yet (pre-onboarding)
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Deconnexion
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

function NavLink({ href, icon: Icon, label, pathname }: { href: string; icon: React.ElementType; label: string; pathname: string }) {
  const active = pathname === href || pathname.startsWith(href + "/")
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 text-sm transition-colors ${
        active ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}

function ProfileDropdown({ name }: { name: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium hover:text-primary transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          {name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline">{name}</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg py-1 z-50">
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
          >
            <User className="w-4 h-4" />
            Mon profil
          </Link>
          <button
            onClick={() => {
              setOpen(false)
              signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })
            }}
            className="flex items-center gap-2 px-3 py-2 text-sm w-full text-left hover:bg-secondary transition-colors text-red-600"
          >
            <LogOut className="w-4 h-4" />
            Deconnexion
          </button>
        </div>
      )}
    </div>
  )
}
