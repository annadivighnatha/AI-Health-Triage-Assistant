import Link from "next/link"
import { Activity } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-bold tracking-tight">AI Health Triage</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An ML-powered symptom triage and decision-support tool built for the Lemma SDK Hackathon.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/consult" className="text-muted-foreground hover:text-foreground">
              Consultation
            </Link>
            <Link href="/history" className="text-muted-foreground hover:text-foreground">
              History
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Medical disclaimer:</strong> This product is a triage and
            decision-support tool. It does not replace professional medical diagnosis. The ML model predicts likely
            conditions and the LLM only explains results in plain language. Always consult a qualified doctor for
            confirmation and treatment.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AI Health Triage Assistant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
