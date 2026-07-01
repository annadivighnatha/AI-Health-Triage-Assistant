import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquareText, Workflow, ShieldAlert, Stethoscope, FileText, Mail } from "lucide-react"
import Link from "next/link"

const TECH_STACK = ["React", "Next.js", "TypeScript", "Material UI", "Tailwind CSS", "Lemma SDK"]

const PIPELINE = [
  { icon: Stethoscope, title: "Collect", desc: "Structured symptom intake with autocomplete and basic patient details." },
  { icon: Brain, title: "Predict", desc: "A deterministic ML classifier returns the top-3 conditions with confidence." },
  { icon: MessageSquareText, title: "Explain", desc: "The LLM converts model output into a plain-language explanation only." },
  { icon: FileText, title: "Report", desc: "A doctor-ready summary is generated and saved to your history." },
]

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-20">
      <div className="mb-14 flex flex-col items-center justify-center space-y-4 text-center">
        <Badge variant="secondary" className="px-3 py-1">
          Lemma SDK Hackathon
        </Badge>
        <h1 className="text-3xl font-bold tracking-tighter text-balance sm:text-5xl">
          About the AI Health Triage Assistant
        </h1>
        <p className="max-w-[720px] text-pretty text-muted-foreground md:text-xl leading-relaxed">
          A structured intake and decision-support workflow that helps people understand their symptoms and prepare for
          a doctor&apos;s visit, while saving clinicians intake time.
        </p>
      </div>

      {/* ML vs LLM */}
      <div className="mb-16 grid gap-6 md:grid-cols-2">
        <Card className="border-primary/30">
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Brain className="h-6 w-6" />
            </div>
            <CardTitle>The ML model predicts</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            A trained classifier (Random Forest / XGBoost) on the Kaggle Disease and Symptoms dataset handles all disease
            prediction. It returns deterministic, auditable Top-3 results with confidence scores and the exact matched
            symptoms that drove each prediction.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <MessageSquareText className="h-6 w-6" />
            </div>
            <CardTitle>The LLM explains only</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground leading-relaxed">
            The language model (Gemini Flash) never diagnoses. Its role is strictly limited to explanation,
            summarization, precautions, and report drafting. This keeps outputs auditable and reduces hallucination
            risk.
          </CardContent>
        </Card>
      </div>

      {/* Lemma workflow */}
      <div className="mb-16">
        <div className="mb-8 flex items-center gap-3">
          <Workflow className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">How the Lemma SDK orchestrates it</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PIPELINE.map((step, i) => (
            <Card key={step.title}>
              <CardHeader className="pb-2">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Lemma ties these services into one auditable pipeline &mdash; save consultation, run prediction, generate
          explanation, produce the PDF report, and persist history &mdash; and exposes it as a hostable pod for judging.
        </p>
      </div>

      {/* Tech stack */}
      <div className="mb-16">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Technology stack</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <Badge key={tech} variant="outline" className="px-3 py-1.5 text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Alert className="mb-16 border-amber-300 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="text-amber-900">Medical disclaimer</AlertTitle>
        <AlertDescription className="text-amber-800 leading-relaxed">
          This product is a triage and decision-support tool. It does not replace professional medical diagnosis, and
          users are always directed to consult a doctor for confirmation and treatment. In an emergency, contact your
          local emergency services immediately.
        </AlertDescription>
      </Alert>

      {/* Team / contact */}
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center rounded-xl border bg-muted/40 p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Team &amp; contact</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Built by the AI Health Triage team for the Lemma SDK Hackathon. Judging access and questions can be directed
            to the project maintainers.
          </p>
          <p className="text-sm text-muted-foreground">Contact: team@aihealthtriage.example</p>
        </div>
        <Link href="/consult">
          <Button size="lg">Try a consultation</Button>
        </Link>
      </div>
    </main>
  )
}
