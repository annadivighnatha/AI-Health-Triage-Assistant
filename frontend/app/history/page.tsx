"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { UrgencyBadge } from "@/components/urgency-badge"
import { TriageResultView } from "@/components/triage-result-view"
import { MOCK_HISTORY, type Consultation } from "@/lib/triage-data"
import { getSavedConsultations } from "@/lib/history-store"
import { downloadReport } from "@/lib/report"
import { ClipboardList, FileText, Plus } from "lucide-react"

export default function HistoryPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selected, setSelected] = useState<Consultation | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const saved = getSavedConsultations()
    setConsultations([...saved, ...MOCK_HISTORY])
  }, [])

  const openReport = (c: Consultation) => {
    setSelected(c)
    setOpen(true)
  }

  return (
    <main className="container py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter">Consultation History</h1>
          <p className="text-muted-foreground">Review past triage results, most recent first.</p>
        </div>
        <Link href="/consult">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Consultation
          </Button>
        </Link>
      </div>

      {consultations.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <ClipboardList className="h-7 w-7" />
          </span>
          <div className="space-y-1">
            <p className="text-lg font-semibold">No consultations yet</p>
            <p className="text-muted-foreground">Start your first consultation to see it here.</p>
          </div>
          <Link href="/consult">
            <Button>Start a consultation</Button>
          </Link>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symptoms</TableHead>
                  <TableHead>Top Prediction</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead className="text-right">Report</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="whitespace-nowrap font-medium">{c.date}</TableCell>
                    <TableCell>
                      <div className="flex max-w-xs flex-wrap gap-1">
                        {c.symptoms.slice(0, 3).map((s) => (
                          <Badge key={s} variant="secondary" className="font-normal">
                            {s}
                          </Badge>
                        ))}
                        {c.symptoms.length > 3 && (
                          <Badge variant="outline" className="font-normal">
                            +{c.symptoms.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{c.topPrediction}</TableCell>
                    <TableCell>{Math.round(c.confidence * 100)}%</TableCell>
                    <TableCell>
                      <UrgencyBadge level={c.urgency} size="sm" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => openReport(c)} className="bg-transparent">
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Consultation {selected.id}</DialogTitle>
                <DialogDescription>
                  {selected.date} &middot; {selected.symptoms.length} symptom
                  {selected.symptoms.length === 1 ? "" : "s"} reported
                </DialogDescription>
              </DialogHeader>
              <TriageResultView result={selected.result} />
              <DialogFooter>
                <Button
                  onClick={() =>
                    downloadReport({
                      id: selected.id,
                      date: selected.date,
                      symptoms: selected.symptoms,
                      result: selected.result,
                    })
                  }
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF Report
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
