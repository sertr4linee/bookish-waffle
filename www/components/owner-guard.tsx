"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OwnerGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending) {
      if (!session) {
        router.push("/sign-in")
      } else if ((session.user as Record<string, unknown>).userType !== "owner") {
        router.push("/")
      }
    }
  }, [isPending, session, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!session || (session.user as Record<string, unknown>).userType !== "owner") {
    return null
  }

  return <>{children}</>
}
