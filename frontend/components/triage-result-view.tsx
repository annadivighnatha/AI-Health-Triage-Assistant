import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { UrgencyBadge } from "@/components/urgency-badge"
import { URGENCY_META, type TriageResult } from "@/lib/triage-data"
import { CheckCircle2, Sparkles, FlaskConical } from "lucide-react"

export function TriageResultView({ result }: { result: TriageResult }) {
  return (
    <div className="space-y-6">
      {/* Urgency */}
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Assigned urgency</p>
          <p className="text-sm text-muted-foreground">{URGENCY_META[result.urgency].description}</p>
        </div>
        <UrgencyBadge level={result.urgency} showMeaning />
      </div>

      {/* Predictions */}
      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Top predicted conditions
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {result.predictions.map((p, i) => (
            <Card key={p.disease} className={i === 0 ? "border-primary/40" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                  <span className="text-lg font-bold text-primary">{Math.round(p.confidence * 100)}%</span>
                </div>
                <p className="text-base font-semibold leading-tight">{p.disease}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={Math.round(p.confidence * 100)} aria-label={`${p.disease} confidence`} />
                <div className="flex flex-wrap gap-1.5">
                  {p.matchedSymptoms.length > 0 ? (
                    p.matchedSymptoms.map((s) => (
                      <Badge key={s} variant="secondary" className="font-normal">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">No direct matches</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertTitle>AI explanation</AlertTitle>
        <AlertDescription>{result.explanation}</AlertDescription>
      </Alert>

      {/* Precautions + Tests */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <h3 className="font-semibold">Precautions</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.precautions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-urgency-low" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <h3 className="font-semibold">Recommended tests</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendedTests.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
