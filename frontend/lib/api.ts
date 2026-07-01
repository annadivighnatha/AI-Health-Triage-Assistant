import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from "@/lib/auth"
import { getAuthHeader } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is required")
}

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit
}

class ApiError extends Error {
  status: number
  details?: unknown

  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
      ...(options.headers ?? {}),
    },
  })

  const isJson = response.headers.get("content-type")?.includes("application/json")
  const body = isJson ? await response.json().catch(() => null) : await response.text().catch(() => "")

  if (!response.ok) {
    const message =
      typeof body === "object" && body && "detail" in body
        ? Array.isArray((body as { detail: unknown }).detail)
          ? "Validation failed"
          : String((body as { detail: unknown }).detail)
        : "Request failed"
    throw new ApiError(message, response.status, body)
  }

  return body as T
}

export async function register(payload: RegisterRequest): Promise<UserResponse> {
  return request<UserResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export async function login(payload: LoginRequest): Promise<TokenResponse> {
  return request<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

export { ApiError, request }
