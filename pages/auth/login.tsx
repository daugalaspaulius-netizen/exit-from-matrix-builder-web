"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { loginUser } from "@/lib/services"
import { setCurrentUserId } from "@/lib/session"
import { useApiRequest } from "@/hooks/useApiRequest"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    userId: "",
    rememberMe: false,
  })
  const { loading, error, execute } = useApiRequest()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await execute(() => loginUser(formData.userId))

    if (response) {
      if (response.data.user_id) {
        setCurrentUserId(response.data.user_id)
        router.push("/dashboard")
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
          <CardTitle className="text-3xl text-primary">Sign In</CardTitle>
          <CardDescription>Welcome back to the matrix exit</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Paste your user_id"
                value={formData.userId}
                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                required
                className="bg-background/50 border-border/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-destructive/20 border border-destructive/50 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 box-glow-cyan"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
