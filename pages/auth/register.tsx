"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/lib/services"
import { setCurrentUserId } from "@/lib/session"
import { useApiRequest } from "@/hooks/useApiRequest"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    photoUrl: "",
  })
  const { loading, error, execute } = useApiRequest()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await execute(() => registerUser(formData.username, formData.photoUrl))
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
          <CardTitle className="text-3xl text-primary">Create Account</CardTitle>
          <CardDescription>Join the decentralized future</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="bg-background/50 border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="photoUrl">Photo URL (optional)</Label>
              <Input
                id="photoUrl"
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="bg-background/50 border-border/50"
              />
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
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
