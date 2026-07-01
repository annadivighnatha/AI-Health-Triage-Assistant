"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { clearAuthSession, loadAuthSession, saveAuthSession, saveUser, type UserResponse } from "@/lib/auth"
import { login, register } from "@/lib/api"

interface User {
  id: number
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = loadAuthSession()
    if (session?.user) {
      setUser(session.user)
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await login({ email, password })
      saveAuthSession({ token: response.access_token, tokenType: response.token_type })
      const sessionUser = { id: 0, email, name: email.split("@")[0] }
      saveUser(sessionUser)
      setUser(sessionUser)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true)
    try {
      const registered = await register({ email, password, name: name ?? "" })
      const sessionUser: UserResponse = registered
      setUser(sessionUser)
      saveUser(sessionUser)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      setUser(null)
      clearAuthSession()
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
