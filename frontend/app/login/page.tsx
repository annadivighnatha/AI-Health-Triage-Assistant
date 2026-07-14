"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight, Loader2, LogIn } from "lucide-react"

import { AuthPageShell } from "@/components/auth-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { login } from "@/lib/api"
import { saveAuthSession } from "@/lib/auth"

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>

type FieldErrors = Partial<Record<keyof LoginFormValues, string>>

function parseApiErrors(error: unknown): { message: string; fieldErrors: FieldErrors } {
  if (error instanceof Error && "details" in error) {
    const apiError = error as Error & { details?: unknown; status?: number }
    if (apiError.status === 422 && apiError.details && typeof apiError.details === "object") {
      const detail = apiError.details as { detail?: Array<{ loc?: string[]; msg?: string }> }
      const fieldErrors: FieldErrors = {}
      detail.detail?.forEach((item) => {
        const field = item.loc?.[1] as keyof LoginFormValues | undefined
        if (field && item.msg) {
          fieldErrors[field] = item.msg
        }
      })
      return { message: "Please fix the highlighted fields.", fieldErrors }
    }
    return { message: apiError.message || "Authentication failed.", fieldErrors: {} }
  }

  return { message: "Something went wrong. Please try again.", fieldErrors: {} }
}

export default function LoginPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    setSubmitting(true)
    try {
      const response = await login(values)
      saveAuthSession({ token: response.access_token, tokenType: response.token_type, user: response.user })
      router.push("/dashboard")
    } catch (error) {
      const parsed = parseApiErrors(error)
      setServerError(parsed.message)
      Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof LoginFormValues, { type: "server", message })
      })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthPageShell
      eyebrow="Sign in"
      title="Welcome back."
      description="Sign in to access your consultation history and continue your triage workflow."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      }
    >
      <Card className="border-primary/15 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <LogIn className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Use your registered email and password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            {serverError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Login failed</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" {...registerField("email")} />
              {errors.email ? <p className="text-sm text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...registerField("password")}
              />
              {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
