"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Activity, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/consult", label: "Consultation" },
  { href: "/history", label: "History" },
  { href: "/about", label: "About" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">AI Health Triage</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden md:block">
          <Link href="/consult">
            <Button>Start Consultation</Button>
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-md px-3 py-2 text-base font-medium transition-colors",
                      active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link href="/consult" onClick={() => setOpen(false)} className="mt-4">
                <Button className="w-full">Start Consultation</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
