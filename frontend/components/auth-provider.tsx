"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
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
    // Check if user is logged in from localStorage or session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication for MVP
    // In production, this would call an authentication API
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        name: email.split("@")[0],
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    // Mock registration for MVP
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockUser = {
        id: "user-" + Math.random().toString(36).substr(2, 9),
        email,
        name: name || email.split("@")[0],
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    // Mock sign out
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUser(null)
      localStorage.removeItem("user")
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
