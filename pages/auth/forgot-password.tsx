"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail } from "lucide-react"
import { requestPasswordReset } from "@/lib/services"
import { useApiRequest } from "@/hooks/useApiRequest"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [success, setSuccess] = useState(false)
  const { loading, error, execute } = useApiRequest()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await execute(() => requestPasswordReset(email))
    if (response) {
      if (response.data.status === "success") {
        setSuccess(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-primary/30 bg-card/80 backdrop-blur box-glow-cyan">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold mb-2">
            <span className="text-primary glow-cyan">[EXIT]</span>
          </div>
          <CardTitle className="text-3xl text-primary">Forgot Password?</CardTitle>
          <CardDescription>Enter your email to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 border-border/50"
                />
              </div>

              {error && (
                <div className="p-3 rounded-md text-sm bg-destructive/20 border border-destructive/50 text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 box-glow-cyan"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                <Link href="/auth/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </form>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Mail className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-primary">Check your email</p>
                <p className="text-sm text-muted-foreground">We've sent a password reset link to {email}</p>
              </div>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Return to login</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
