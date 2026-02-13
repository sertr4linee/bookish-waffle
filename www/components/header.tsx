"use client"

import Link from "next/link"
import { useSession, signOut } from "@/lib/auth-client"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-foreground rounded-sm flex items-center justify-center">
            <span className="text-xs font-mono">A</span>
          </div>
          <span className="font-serif text-lg tracking-tight">AutoLoc</span>
        </Link>

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

        {session ? (
          <div className="flex items-center gap-4">
            <Link
              href="/profile"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {session.user.name}
            </Link>
            <button
              onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })}
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Deconnexion
            </button>
          </div>
        ) : (
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
        )}
      </div>
    </header>
  )
}
