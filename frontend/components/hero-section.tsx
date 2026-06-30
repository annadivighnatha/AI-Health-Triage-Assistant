import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Stethoscope, Brain, FileText } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full border-b bg-gradient-to-b from-accent to-background py-16 md:py-24 lg:py-28">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:gap-12 xl:grid-cols-[1fr_520px]">
          <div className="flex flex-col justify-center space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <Stethoscope className="h-4 w-4" />
              Lemma SDK Hackathon
            </span>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter text-balance sm:text-5xl xl:text-6xl/none">
                AI Health Triage Assistant
              </h1>
              <p className="max-w-[600px] text-pretty text-muted-foreground md:text-xl leading-relaxed">
                ML predicts likely diseases from your symptoms. An LLM explains the results in plain language, assigns an
                urgency level, and prepares a doctor-ready summary.
              </p>
            </div>
            <div className="flex flex-col gap-3 min-[400px]:flex-row">
              <Link href="/consult">
                <Button size="lg" className="w-full min-[400px]:w-auto">
                  Start Free Consultation
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="w-full min-[400px]:w-auto bg-transparent">
                  How it works
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full rounded-2xl border bg-card p-6 shadow-sm">
              <p className="mb-4 text-sm font-medium text-muted-foreground">How a consultation flows</p>
              <ol className="space-y-4">
                {[
                  { icon: Stethoscope, title: "Describe symptoms", desc: "Search and select from a symptom vocabulary." },
                  { icon: Brain, title: "ML prediction", desc: "Top-3 likely conditions with confidence scores." },
                  { icon: FileText, title: "Plain-language report", desc: "LLM explanation, urgency, and next steps." },
                ].map((step, i) => (
                  <li key={step.title} className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-medium">
                        {i + 1}. {step.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
