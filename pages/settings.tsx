"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail } from "lucide-react"
import { getUserSummary } from "@/lib/services"
import { clearSession } from "@/lib/session"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useApiRequest } from "@/hooks/useApiRequest"
import { PageShell } from "@/components/layout/PageShell"
import { ErrorAlert } from "@/components/common/ErrorAlert"
import { LoadingState } from "@/components/common/LoadingState"
import type { UserSummary } from "@/types/api"

export default function SettingsPage() {
  const router = useRouter()
  const { userId, isCheckingAuth } = useRequireAuth()
  const [user, setUser] = useState<UserSummary | null>(null)
  const [message, setMessage] = useState("")
  const { loading, error, execute } = useApiRequest()

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }
    void fetchUserProfile(userId)
  }, [isCheckingAuth, userId])

  const fetchUserProfile = async (userId: string) => {
    const response = await execute(() => getUserSummary(userId))
    if (response) {
      setUser(response.data)
    } else {
      clearSession()
      router.push("/auth/login")
    }
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("Profile redagavimas bus prijungtas kitame etape.")
  }

  if (loading) {
    return <LoadingState fullScreen />
  }

  return (
    <PageShell
      title="Account Settings"
      subtitle="Manage your profile and security"
      titleClassName="text-accent glow-pink"
      onLogout={handleLogout}
    >
      <div className="max-w-4xl">
        <ErrorAlert message={error} className="mb-4" />

        {/* Profile Information */}
        <Card className="border-accent/30 bg-card/50 backdrop-blur box-glow-pink mb-8">
          <CardHeader>
            <CardTitle className="text-accent flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={user?.username || ""}
                readOnly
                className="bg-background/50 border-border/50 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email || "not-set"}
                readOnly
                className="bg-background/50 border-border/50 cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>Username/email redagavimas bus prijungtas kitame etape</span>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card className="border-primary/30 bg-card/50 backdrop-blur box-glow-cyan mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Account Statistics</CardTitle>
            <CardDescription>Your platform activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Level</p>
                <p className="text-2xl font-bold text-primary">{user?.level || 1}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-primary">{user?.points || 0}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">To Next Level</p>
                <p className="text-2xl font-bold text-primary">{user?.remaining_to_next_level ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder save form */}
        <Card className="border-secondary/30 bg-card/50 backdrop-blur box-glow-purple">
          <CardHeader>
            <CardTitle className="text-secondary">Account Controls</CardTitle>
            <CardDescription>Laikinas valdymo blokas iki pilno auth etapo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {message && (
                <div className="p-3 rounded-md text-sm bg-secondary/20 border border-secondary/50 text-secondary">
                  {message}
                </div>
              )}
              <Button type="submit" className="bg-gradient-to-r from-secondary to-accent hover:opacity-90 box-glow-purple">
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  )
}
