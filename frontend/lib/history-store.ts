import type { Consultation } from "@/lib/triage-data"

const KEY = "triage_consultations"

export function getSavedConsultations(): Consultation[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Consultation[]) : []
  } catch {
    return []
  }
}

export function saveConsultation(consultation: Consultation) {
  if (typeof window === "undefined") return
  const existing = getSavedConsultations()
  localStorage.setItem(KEY, JSON.stringify([consultation, ...existing]))
}
