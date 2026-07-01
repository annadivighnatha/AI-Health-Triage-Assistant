"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Activity, ShieldCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type AuthPageShellProps = {
  title: string
  description: string
  children: ReactNode
  footer: ReactNode
  eyebrow: string
  className?: string
}

export function AuthPageShell({
  title,
  description,
  children,
  footer,
  eyebrow,
  className,
}: AuthPageShellProps) {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(10,115,184,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.12),_transparent_28%)]" />
      <div className="container py-12 md:py-20">
        <div className={cn("mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12", className)}>
          <div className="flex flex-col justify-between gap-8 rounded-3xl border bg-gradient-to-br from-primary/10 via-background to-background p-8 shadow-sm md:p-10">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/20">
                  <Activity className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">AI Health Triage Assistant</p>
                  <p className="text-lg font-semibold tracking-tight">Secure patient access</p>
                </div>
              </Link>

              <div className="space-y-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {eyebrow}
                </span>
                <h1 className="max-w-xl text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
                  {title}
                </h1>
                <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground md:text-lg">
                  {description}
                </p>
              </div>
            </div>

            <Card className="border-primary/15 bg-background/80">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    ["Fast", "Register and sign in with the same design system used across the app."],
                    ["Secure", "Recommended production path is httpOnly session cookies for auth state."],
                    ["Consistent", "Blue medical theme, rounded cards, and compact enterprise spacing."],
                  ].map(([label, body]) => (
                    <div key={label} className="space-y-2">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-sm leading-6 text-muted-foreground">{body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center">
            <div className="w-full">{children}</div>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-6xl">{footer}</div>
      </div>
    </main>
  )
}
