import { request } from "@/lib/api"

export interface PredictRequest {
  symptoms: string[]
}

export interface PredictItem {
  disease: string
  confidence: number
  probability: number
  similarity: number
  final_score: number
  matched_symptoms: string[]
  missing_symptoms: string[]
}

export interface PredictResponse {
  predictions: PredictItem[]
}

export async function predictSymptoms(payload: PredictRequest): Promise<PredictResponse> {
  return request<PredictResponse>("/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
