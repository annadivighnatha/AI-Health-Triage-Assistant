export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UserResponse {
  id: number
  name: string
  email: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

export interface AuthSession {
  token?: string
  tokenType?: string
  user?: UserResponse
}

const TOKEN_KEY = "auth_token"
const TOKEN_TYPE_KEY = "auth_token_type"
const USER_KEY = "auth_user"

export function saveAuthSession(session: AuthSession) {
  if (session.token && session.tokenType) {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(TOKEN_TYPE_KEY, session.tokenType)
  }

  if (session.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  }
}

export function loadAuthSession(): AuthSession | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const tokenType = localStorage.getItem(TOKEN_TYPE_KEY)

  if (!token || !tokenType) {
    return null
  }

  const rawUser = localStorage.getItem(USER_KEY)
  const user = rawUser ? (JSON.parse(rawUser) as UserResponse) : undefined

  return {
    token,
    tokenType,
    user,
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(TOKEN_TYPE_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getAuthHeader(): Record<string, string> {
  const token = getAuthToken()
  const tokenType = typeof window === "undefined" ? null : localStorage.getItem(TOKEN_TYPE_KEY)

  if (!token || !tokenType) {
    return {}
  }

  return {
    Authorization: `${tokenType} ${token}`,
  }
}

export function saveUser(user: UserResponse) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}
