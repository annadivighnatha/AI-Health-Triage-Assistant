"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, ShieldCheck, Stethoscope, History, LogOut } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { clearAuthSession, loadAuthSession, type UserResponse } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = loadAuthSession()
    if (!session?.token) {
      router.replace("/login")
      return
    }

    setUser(session.user ?? null)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    clearAuthSession()
    router.push("/login")
  }

  if (loading) {
    return <main className="container py-12 md:py-20" />
  }

  return (
    <main className="container py-12 md:py-20">
      <div className="mb-10 space-y-3">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <ShieldCheck className="h-3.5 w-3.5" />
          Protected area
        </span>
        <h1 className="text-4xl font-bold tracking-tighter text-balance">Dashboard</h1>
        <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
          Welcome{user?.name ? `, ${user.name}` : ""}. Start a consultation or review your triage history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-primary/15">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Stethoscope className="h-6 w-6" />
            </div>
            <CardTitle>New consultation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Submit symptoms and get the hybrid ML + similarity-based top-3 predictions.</p>
            <Link href="/consult">
              <Button>
                Start consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary/15">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <History className="h-6 w-6" />
            </div>
            <CardTitle>Consultation history</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Review previous triage sessions and revisit saved results.</p>
            <Link href="/history">
              <Button variant="outline" className="bg-transparent">
                View history
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </main>
  )
}
