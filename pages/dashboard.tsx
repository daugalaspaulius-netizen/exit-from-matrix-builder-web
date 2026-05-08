"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Vote, MessageSquare, Settings, TrendingUp, Award, Zap, Activity } from "lucide-react"
import { getSystemAuditLogs, getUserSummary, getUserRatingHistory } from "@/lib/services"
import { clearSession, getAcknowledgedIncidentIds } from "@/lib/session"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useApiRequest } from "@/hooks/useApiRequest"
import { PageShell } from "@/components/layout/PageShell"
import { ErrorAlert } from "@/components/common/ErrorAlert"
import { LoadingState } from "@/components/common/LoadingState"
import { StatCard } from "@/components/dashboard/StatCard"
import { ActionCard } from "@/components/dashboard/ActionCard"
import { ReferralCard } from "@/components/dashboard/ReferralCard"
import { ReputationSnapshot } from "@/components/dashboard/ReputationSnapshot"
import { UserRatingHistory } from "@/components/dashboard/UserRatingHistory"
import type { AuditLogEntry, RatingHistoryEntry, UserSummary } from "@/types/api"

export default function DashboardPage() {
  const router = useRouter()
  const { userId, isCheckingAuth } = useRequireAuth()
  const [user, setUser] = useState<UserSummary | null>(null)
  const [copied, setCopied] = useState(false)
  const [userRatings, setUserRatings] = useState<RatingHistoryEntry[] | null>(null)
  const [ratingsLoading, setRatingsLoading] = useState(false)
  const [incidentBadge, setIncidentBadge] = useState<{
    critical: number
    unacknowledgedCritical: number
    error: number
    warning: number
  } | null>(null)
  const { loading, error, execute } = useApiRequest()

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }
    void fetchUserProfile(userId)
    void fetchUserRatings(userId)
    void fetchIncidentBadge()
  }, [isCheckingAuth, userId])

  const fetchUserRatings = async (userId: string) => {
    setRatingsLoading(true)
    const response = await execute(() => getUserRatingHistory(userId, 20), { keepError: true })
    if (response) {
      setUserRatings(response.data)
    }
    setRatingsLoading(false)
  }

  const fetchUserProfile = async (userId: string) => {
    const response = await execute(() => getUserSummary(userId))
    if (response) {
      setUser(response.data)
    } else {
      clearSession()
      router.push("/auth/login")
    }
  }

  const fetchIncidentBadge = async () => {
    const response = await execute(() => getSystemAuditLogs(100), { keepError: true })
    if (!response) return

    const now = Date.now()
    const last24h = 24 * 60 * 60 * 1000
    const acknowledgedIds = getAcknowledgedIncidentIds()
    const stats = (response.data as AuditLogEntry[]).reduce(
      (acc, log) => {
        const ts = new Date(log.timestamp).getTime()
        if (Number.isNaN(ts) || now - ts > last24h) return acc
        const action = log.action.toLowerCase()
        if (action.includes("critical") || action.includes("fatal") || action.includes("panic")) {
          acc.critical += 1
          if (!acknowledgedIds.includes(log.log_id)) {
            acc.unacknowledgedCritical += 1
          }
        } else if (action.includes("error") || action.includes("fail")) {
          acc.error += 1
        } else if (action.includes("warn") || action.includes("retry")) {
          acc.warning += 1
        }
        return acc
      },
      { critical: 0, unacknowledgedCritical: 0, error: 0, warning: 0 },
    )
    setIncidentBadge(stats)
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const handleCopyReferral = () => {
    if (user?.referral_link) {
      navigator.clipboard.writeText(user.referral_link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return <LoadingState fullScreen />
  }

  return (
    <PageShell
      title={`Welcome, ${user?.username || "User"}!`}
      subtitle="Your decentralized dashboard"
      titleClassName="text-4xl md:text-5xl gradient-text glow-cyan"
      onLogout={handleLogout}
      showDashboardButton={false}
    >
      <ErrorAlert message={error} className="mt-2 mb-8" />
      {incidentBadge && incidentBadge.unacknowledgedCritical > 0 && (
        <div className="mb-8 rounded border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-300">
          Unacknowledged critical incidents in last 24h: {incidentBadge.unacknowledgedCritical}. Open `System Monitor`
          for incident timeline.
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Points Balance"
          value={`${user?.points || 0}`}
          subtitle="Total points earned"
          icon={<Zap className="w-5 h-5 text-primary" />}
          cardClassName="border-primary/30 bg-card/50 backdrop-blur box-glow-cyan hover:box-glow-cyan transition-all duration-300"
          valueClassName="text-primary"
        />
        <StatCard
          title="Level"
          value={`Level ${user?.level || 1}`}
          subtitle="Current rank"
          icon={<Award className="w-5 h-5 text-secondary" />}
          cardClassName="border-secondary/30 bg-card/50 backdrop-blur box-glow-purple hover:box-glow-purple transition-all duration-300"
          valueClassName="text-secondary"
        />
        <StatCard
          title="Voting Power"
          value="1:1"
          subtitle="Equal voting rights"
          icon={<Vote className="w-5 h-5 text-accent" />}
          cardClassName="border-accent/30 bg-card/50 backdrop-blur box-glow-pink hover:box-glow-pink transition-all duration-300"
          valueClassName="text-accent"
        />
        <StatCard
          title="Monthly Earnings"
          value="€10"
          subtitle="Guaranteed monthly"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          cardClassName="border-green-500/30 bg-card/50 backdrop-blur hover:shadow-[0_0_15px_rgb(34_197_94/0.3)] transition-all duration-300"
          valueClassName="text-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              href="/voting"
              icon={<Vote className="w-8 h-8 text-primary" />}
              title="Vote on Proposals"
              description="Participate in community decisions"
              iconWrapperClassName="p-3 rounded-lg bg-primary/10"
              titleClassName="text-primary"
              cardClassName="border-primary/30 bg-card/50 backdrop-blur hover:box-glow-cyan transition-all duration-300 cursor-pointer h-full"
            />
            <ActionCard
              href="/forum"
              icon={<MessageSquare className="w-8 h-8 text-secondary" />}
              title="Community Forum"
              description="Engage with other members"
              iconWrapperClassName="p-3 rounded-lg bg-secondary/10"
              titleClassName="text-secondary"
              cardClassName="border-secondary/30 bg-card/50 backdrop-blur hover:box-glow-purple transition-all duration-300 cursor-pointer h-full"
            />
            <ActionCard
              href="/settings"
              icon={<Settings className="w-8 h-8 text-accent" />}
              title="Account Settings"
              description="Manage your profile"
              iconWrapperClassName="p-3 rounded-lg bg-accent/10"
              titleClassName="text-accent"
              cardClassName="border-accent/30 bg-card/50 backdrop-blur hover:box-glow-pink transition-all duration-300 cursor-pointer h-full"
            />
            <ActionCard
              href="/system-monitor"
              icon={<Activity className="w-8 h-8 text-green-500" />}
              title="System Monitor"
              description="Inspect contracts and runtime health"
              iconWrapperClassName="p-3 rounded-lg bg-green-500/10"
              titleClassName="text-green-500"
              cardClassName="border-green-500/30 bg-card/50 backdrop-blur hover:shadow-[0_0_15px_rgb(34_197_94/0.3)] transition-all duration-300 cursor-pointer h-full"
            />
          </div>
        </div>

      {/* Referral Section */}
      <ReferralCard referralLink={user?.referral_link} copied={copied} onCopy={handleCopyReferral} />

      {/* Reputation Snapshot */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-foreground">Your Reputation</h2>
        <ReputationSnapshot
          ratingScore={0}
          ratingVotes={0}
          recentRatings={userRatings}
          loading={ratingsLoading}
        />
      </div>

      {/* User Rating History */}
      <div className="mt-12">
        <UserRatingHistory ratings={userRatings} loading={ratingsLoading} />
      </div>
    </PageShell>
  )
}
