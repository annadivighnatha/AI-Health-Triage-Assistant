"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SymptomCombobox } from "@/components/symptom-combobox"
import { TriageResultView } from "@/components/triage-result-view"
import { useToast } from "@/hooks/use-toast"
import { COMMON_SYMPTOMS, type TriageResult, type Consultation } from "@/lib/triage-data"
import { downloadReport } from "@/lib/report"
import { saveConsultation } from "@/lib/history-store"
import { predictSymptoms } from "@/lib/prediction"
import { explainPrediction } from "@/lib/explain"
import { createConsultation } from "@/lib/consultation"
import { X, Stethoscope, FileText, Save, RotateCcw, ArrowRight, Check, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = ["Symptoms", "Results"]

export default function ConsultPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(0)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [duration, setDuration] = useState("")
  const [loading, setLoading] = useState(false)
  const [processingStage, setProcessingStage] = useState("")
  const [result, setResult] = useState<TriageResult | null>(null)
  const [saved, setSaved] = useState(false)

  const toggleSymptom = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handlePredict = async () => {
    setLoading(true)
    setStep(1)
    setProcessingStage("Predicting diseases...")

    try {
      const predictionResponse = await predictSymptoms({ symptoms })
      const topPrediction = predictionResponse.predictions[0]

      if (!topPrediction) {
        throw new Error("No prediction returned from /predict")
      }

      setProcessingStage("Generating explanation...")
      const explanationResponse = await explainPrediction({
        disease: topPrediction.disease,
        confidence: topPrediction.final_score,
        matched_symptoms: topPrediction.matched_symptoms,
        missing_symptoms: topPrediction.missing_symptoms,
        all_symptoms: symptoms,
        age: Number(age) || undefined,
        gender: gender || undefined,
        duration: duration || undefined,
      })

      const mapped: TriageResult = {
        predictions: predictionResponse.predictions.map((item) => ({
          disease: item.disease,
          confidence: item.final_score,
          matchedSymptoms: item.matched_symptoms,
          missingSymptoms: item.missing_symptoms,
          similarity: item.similarity,
        })),
        urgency:
          topPrediction.final_score >= 0.7
            ? "High"
            : topPrediction.final_score >= 0.55
              ? "Moderate"
              : "Low",
        explanation: explanationResponse.explanation,
        precautions: explanationResponse.precautions,
        recommendedTests: explanationResponse.recommended_tests,
      }

      setProcessingStage("Saving consultation...")
      const consultationResponse = await createConsultation({
        symptoms,
        age: Number(age) || 0,
        gender: gender || "unspecified",
        duration: duration || "unspecified",
        prediction: {
          disease: topPrediction.disease,
          confidence: topPrediction.final_score,
        },
        explanation: explanationResponse,
        urgency: mapped.urgency,
      })

      const consultation: Consultation = {
        id: `cons_${consultationResponse.consultation_id}`,
        date: consultationResponse.created_at.slice(0, 10),
        symptoms,
        topPrediction: topPrediction.disease,
        confidence: topPrediction.final_score,
        urgency: mapped.urgency,
        result: mapped,
      }

      saveConsultation(consultation)
      setResult(mapped)
      setSaved(true)
      toast({ title: "Consultation saved", description: "Prediction, explanation, and consultation were recorded." })
    } catch (error) {
      console.error("Prediction failed:", error)
      toast({ title: "Consultation failed", description: "Unable to complete the prediction workflow.", variant: "destructive" })
    } finally {
      setProcessingStage("")
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0)
    setSymptoms([])
    setAge("")
    setGender("")
    setDuration("")
    setResult(null)
    setSaved(false)
  }

  const buildConsultation = (): Consultation | null => {
    if (!result) return null
    return {
      id: "cons_" + Math.random().toString(36).slice(2, 8),
      date: new Date().toISOString().slice(0, 10),
      symptoms,
      topPrediction: result.predictions[0].disease,
      confidence: result.predictions[0].confidence,
      urgency: result.urgency,
      result,
    }
  }

  const handleSave = () => {
    const consultation = buildConsultation()
    if (!consultation) return
    saveConsultation(consultation)
    setSaved(true)
    toast({ title: "Saved to history", description: "This consultation is now in your history." })
  }

  const handleDownload = () => {
    if (!result) return
    downloadReport({ symptoms, age, gender, duration, result })
  }

  return (
    <main className="container max-w-4xl py-10 md:py-14">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter">New Consultation</h1>
        <p className="text-muted-foreground">
          Tell us about your symptoms. The ML model will predict likely conditions and the LLM will explain them.
        </p>
      </div>

      {/* Stepper */}
      <ol className="mb-8 flex items-center gap-4">
        {STEPS.map((label, i) => {
          const isActive = i === step
          const isComplete = i < step
          return (
            <li key={label} className="flex flex-1 items-center gap-3">
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isComplete && "border-border text-muted-foreground",
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("text-sm font-medium", isActive ? "text-foreground" : "text-muted-foreground")}>
                Step {i + 1}: {label}
              </span>
              {i < STEPS.length - 1 && <span className="hidden h-px flex-1 bg-border sm:block" />}
            </li>
          )
        })}
      </ol>

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              Symptom intake
            </CardTitle>
            <CardDescription>Select all symptoms that apply, then add a few basic details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Symptoms</Label>
              <SymptomCombobox options={COMMON_SYMPTOMS} selected={symptoms} onToggle={toggleSymptom} />
              {symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {symptoms.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 py-1 pl-3 pr-1.5 text-sm font-normal">
                      {s}
                      <button
                        type="button"
                        onClick={() => toggleSymptom(s)}
                        className="rounded-full p-0.5 hover:bg-foreground/10"
                        aria-label={`Remove ${s}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="pt-1 text-sm text-muted-foreground">No symptoms selected yet.</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  max={120}
                  placeholder="e.g. 29"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g. 3 days"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>
            </div>

            {symptoms.length >= 2 && (symptoms.includes("Chest pain") || symptoms.includes("Shortness of breath")) && (
              <Alert className="border-amber-300 bg-amber-50 text-amber-800 [&>svg]:text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  Follow-up: Are the chest pain and breathing difficulty sudden or severe? If so, seek emergency care now.
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={handlePredict} disabled={symptoms.length === 0} size="lg" className="w-full sm:w-auto">
              Get Prediction
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <div className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="space-y-6 py-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Stethoscope className="h-5 w-5 animate-pulse text-primary" />
                  {processingStage || "Running ML prediction and generating explanation..."}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="space-y-3 rounded-lg border p-4">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ) : result ? (
            <>
              <TriageResultView result={result} />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button onClick={handleDownload}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF Report
                </Button>
                <Button variant="outline" onClick={handleSave} disabled={saved} className="bg-transparent">
                  {saved ? <Check className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                  {saved ? "Saved to History" : "Save to History"}
                </Button>
                <Button variant="ghost" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Consultation
                </Button>
                <Link href="/history" className="sm:ml-auto">
                  <Button variant="link">View history</Button>
                </Link>
              </div>
            </>
          ) : null}
        </div>
      )}
    </main>
  )
}
