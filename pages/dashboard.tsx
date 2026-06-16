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
      title={`Sveikas, ${user?.username || "Naudotojau"}!`}
      subtitle="Jūsų decentralizuotasis valdymo prietaisas"
      titleClassName="text-4xl md:text-5xl text-text-primary"
      onLogout={handleLogout}
      showDashboardButton={false}
    >
      <ErrorAlert message={error} className="mt-2 mb-8" />
      {incidentBadge && incidentBadge.unacknowledgedCritical > 0 && (
        <div className="mb-8 rounded border border-error/50 bg-error/10 p-3 text-sm text-error">
          Nepakryptos kritinės problemos per 24h: {incidentBadge.unacknowledgedCritical}. Atverkite `Sistemos monitoriu`
          norėdami peržiūrėti problemų liniją.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard
          title="Taškų balansas"
          value={`${user?.points || 0}`}
          subtitle="Iš viso uždirbti taškai"
          icon={<Zap className="w-5 h-5 text-primary" />}
          cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow"
          valueClassName="text-primary"
        />
        <StatCard
          title="Lygis"
          value={`Lygis ${user?.level || 1}`}
          subtitle="Dabartinis rangas"
          icon={<Award className="w-5 h-5 text-primary" />}
          cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow"
          valueClassName="text-primary"
        />
        <StatCard
          title="Balsavimo galia"
          value="1:1"
          subtitle="Lygūs balsavimo teisės"
          icon={<Vote className="w-5 h-5 text-primary" />}
          cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow"
          valueClassName="text-primary"
        />
        <StatCard
          title="Mėnesio pajamos"
          value="€10"
          subtitle="Garantuota summa"
          icon={<TrendingUp className="w-5 h-5 text-success" />}
          cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow"
          valueClassName="text-success"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-text-primary">Greiti žingsniai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              href="/voting"
              icon={<Vote className="w-8 h-8 text-primary" />}
              title="Balsuoti dėl pasiūlymų"
              description="Dalyvaukite bendruomenės sprendimų priėmime"
              iconWrapperClassName="p-3 rounded-lg bg-primary/10"
              titleClassName="text-text-primary"
              cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow cursor-pointer h-full"
            />
            <ActionCard
              href="/forum"
              icon={<MessageSquare className="w-8 h-8 text-primary" />}
              title="Bendruomenės forumas"
              description="Bendravimas su kitais nariais"
              iconWrapperClassName="p-3 rounded-lg bg-primary/10"
              titleClassName="text-text-primary"
              cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow cursor-pointer h-full"
            />
            <ActionCard
              href="/settings"
              icon={<Settings className="w-8 h-8 text-primary" />}
              title="Paskyros nustatymai"
              description="Valdykite savo profilį"
              iconWrapperClassName="p-3 rounded-lg bg-primary/10"
              titleClassName="text-text-primary"
              cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow cursor-pointer h-full"
            />
            <ActionCard
              href="/system-monitor"
              icon={<Activity className="w-8 h-8 text-primary" />}
              title="Sistemos monitorius"
              description="Tikrinkite kontraktų ir tinklo sveikatą"
              iconWrapperClassName="p-3 rounded-lg bg-primary/10"
              titleClassName="text-text-primary"
              cardClassName="border border-border bg-surface hover:shadow-md-elevation transition-shadow cursor-pointer h-full"
            />
          </div>
        </div>

      {/* Referral Section */}
      <ReferralCard referralLink={user?.referral_link} copied={copied} onCopy={handleCopyReferral} />

      {/* User Rating History */}
      <div className="mt-12">
        <UserRatingHistory ratings={userRatings} loading={ratingsLoading} />
      </div>
    </PageShell>
  )
}
