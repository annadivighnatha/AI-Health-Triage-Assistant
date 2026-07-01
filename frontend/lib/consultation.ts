import { request } from "@/lib/api"
import type { ExplainResponse } from "@/lib/explain"

export interface ConsultationCreateRequest {
  symptoms: string[]
  age: number
  gender: string
  duration: string
  prediction: {
    disease: string
    confidence: number
  }
  explanation: ExplainResponse
  urgency: string
}

export interface ConsultationCreateResponse {
  consultation_id: number
  status: string
  created_at: string
}

export async function createConsultation(
  payload: ConsultationCreateRequest,
): Promise<ConsultationCreateResponse> {
  return request<ConsultationCreateResponse>("/consultation", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}
