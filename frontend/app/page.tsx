import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Stethoscope, AlertTriangle, FileText, ArrowRight, ShieldCheck, Brain } from "lucide-react"
import Link from "next/link"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  return (
    <main className="flex flex-col">
      {/* Sticky medical disclaimer */}
      <div className="sticky top-16 z-40 border-b border-amber-300 bg-amber-50">
        <div className="container py-2">
          <Alert className="border-0 bg-transparent p-0 text-amber-800 [&>svg]:text-amber-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-amber-800">
              Not medical advice. The ML model predicts diseases and the LLM explains only. Always consult a doctor.
            </AlertDescription>
          </Alert>
        </div>
      </div>

      <HeroSection />

      <section className="container py-14 md:py-20">
        <div className="mb-12 flex flex-col items-center justify-center space-y-3 text-center">
          <h2 className="text-3xl font-bold tracking-tighter text-balance sm:text-4xl">What the assistant does</h2>
          <p className="max-w-[700px] text-pretty text-muted-foreground md:text-lg">
            A structured intake and decision-support workflow built for patients and the doctors who see them.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Stethoscope className="h-8 w-8 text-primary" />}
            title="Symptom Analysis"
            description="Select symptoms from a curated vocabulary and get the top-3 most likely conditions with confidence scores."
          />
          <FeatureCard
            icon={<AlertTriangle className="h-8 w-8 text-primary" />}
            title="Urgency Detection"
            description="Every result is scored Green, Yellow, Orange, or Red so you know whether to self-care or seek immediate help."
          />
          <FeatureCard
            icon={<FileText className="h-8 w-8 text-primary" />}
            title="Doctor-Ready Reports"
            description="Generate a concise, downloadable summary that prepares you and your doctor before the consultation begins."
          />
        </div>
      </section>

      <section className="border-y bg-muted/40 py-14 md:py-20">
        <div className="container">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="space-y-5">
              <h2 className="text-3xl font-bold tracking-tighter text-balance sm:text-4xl">
                Prediction by ML. Explanation by LLM.
              </h2>
              <p className="text-pretty text-muted-foreground md:text-lg leading-relaxed">
                The AI never diagnoses in free text. A deterministic machine-learning classifier handles disease
                prediction, keeping outputs auditable. The language model is limited to explanation, precautions, and
                report drafting.
              </p>
              <ul className="space-y-3">
                {[
                  "Deterministic Top-3 disease prediction with confidence",
                  "Matched-symptom highlights for every prediction",
                  "Color-coded urgency from symptom severity rules",
                  "Saved consultation history you can revisit anytime",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
                <Link href="/consult">
                  <Button size="lg">
                    Start Free Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="bg-background">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Built on the Lemma SDK</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  Lemma orchestrates the full pipeline: save the consultation, run prediction, generate the explanation,
                  produce the report, and persist history as one auditable workflow.
                </p>
                <Link href="/about" className="inline-flex items-center font-medium text-primary hover:underline">
                  Learn how it works
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
