import { request } from "@/lib/api"

export interface ExplainRequest {
  disease: string
  confidence: number
  matched_symptoms: string[]
  missing_symptoms: string[]
  all_symptoms: string[]
  age?: number
  gender?: string
  duration?: string
}

export interface ExplainResponse {
  explanation: string
  precautions: string[]
  recommended_tests: string[]
  next_steps: string[]
}

export async function explainPrediction(payload: ExplainRequest): Promise<ExplainResponse> {
  return request<ExplainResponse>("/explain", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
