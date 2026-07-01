"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { AlertCircle, ArrowRight, Loader2, UserPlus } from "lucide-react"

import { AuthPageShell } from "@/components/auth-page-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { register as registerUser } from "@/lib/api"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Z])/, "Password must include at least one uppercase letter")
    .regex(/(?=.*[a-z])/, "Password must include at least one lowercase letter")
    .regex(/(?=.*\d)/, "Password must include at least one number"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

type FieldErrors = Partial<Record<keyof RegisterFormValues, string>>

function parseApiErrors(error: unknown): { message: string; fieldErrors: FieldErrors } {
  if (error instanceof Error && "details" in error) {
    const apiError = error as Error & { details?: unknown; status?: number }
    if (apiError.status === 422 && apiError.details && typeof apiError.details === "object") {
      const detail = apiError.details as { detail?: Array<{ loc?: string[]; msg?: string }> }
      const fieldErrors: FieldErrors = {}
      detail.detail?.forEach((item) => {
        const field = item.loc?.[1] as keyof RegisterFormValues | undefined
        if (field && item.msg) {
          fieldErrors[field] = item.msg
        }
      })
      return { message: "Please fix the highlighted fields.", fieldErrors }
    }
    return { message: apiError.message || "Registration failed.", fieldErrors: {} }
  }

  return { message: "Something went wrong. Please try again.", fieldErrors: {} }
}

export default function RegisterPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null)
    setSubmitting(true)
    try {
      await registerUser(values)
      router.push("/login?registered=1")
    } catch (error) {
      const parsed = parseApiErrors(error)
      setServerError(parsed.message)
      Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
        setError(field as keyof RegisterFormValues, { type: "server", message })
      })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthPageShell
      eyebrow="Create account"
      title="Start your triage journey."
      description="Create a secure account so you can revisit consultations and continue where you left off."
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      }
    >
      <Card className="border-primary/15 shadow-lg shadow-primary/5">
        <CardHeader className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserPlus className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create your account using the same email you’ll use to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onSubmit} noValidate>
            {serverError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Registration failed</AlertTitle>
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" autoComplete="name" placeholder="Jane Doe" {...registerField("name")} />
              {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
            </div>

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
                autoComplete="new-password"
                placeholder="Create a strong password"
                {...registerField("password")}
              />
              {errors.password ? <p className="text-sm text-destructive">{errors.password.message}</p> : null}
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
              Password requirements: at least 8 characters, one uppercase letter, one lowercase letter, and one number.
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
