import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Health Triage Assistant",
  description:
    "ML predicts likely diseases from your symptoms and an LLM explains them in plain language. A doctor-ready triage and decision-support tool.",
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#0a73b8",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <div className="flex-1">{children}</div>
              <SiteFooter />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
