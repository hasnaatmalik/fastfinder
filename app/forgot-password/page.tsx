"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Logo } from "@/components/logo"
import { requestPasswordReset } from "@/lib/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await requestPasswordReset(email)

      if (!response.success) {
        setError(response.error || "Failed to send reset link. Please try again.")
        setLoading(false)
        return
      }

      // For demo purposes, show the reset code
      if (response.resetCode) {
        setResetToken(response.resetCode)
      }

      // Set success state
      setSuccess(true)
    } catch (err) {
      console.error("Password reset request error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="mx-auto max-w-sm border-secondary/10">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a password reset link
          </CardDescription>
        </CardHeader>
        {success ? (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <p className="text-center">If your email is registered, you will receive a password reset link.</p>
              {resetToken && (
                <Alert>
                  <AlertDescription className="font-mono text-center">
                    <span className="font-medium">Demo Mode:</span> Your reset code is{" "}
                    <span className="font-bold">{resetToken}</span>
                  </AlertDescription>
                </Alert>
              )}
            </div>
            <div className="text-center mt-4">
              <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
                <Button>Reset Password</Button>
              </Link>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m.example@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending reset link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <div className="mt-4 text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Back to Login
                </Link>
              </div>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}
