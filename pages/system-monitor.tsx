"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  clearSession,
  getAcknowledgedIncidentIds,
  setAcknowledgedIncidentIds as persistAcknowledgedIncidentIds,
} from "@/lib/session"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useApiRequest } from "@/hooks/useApiRequest"
import { ErrorAlert } from "@/components/common/ErrorAlert"
import { LoadingState } from "@/components/common/LoadingState"
import { PageShell } from "@/components/layout/PageShell"
import { RatingActivityCard } from "@/components/system-monitor/RatingActivityCard"
import { RatingIntegrityWatch } from "@/components/system-monitor/RatingIntegrityWatch"
import {
  getSystemAuditLogs,
  getSystemContracts,
  getSystemErrorCodes,
  getSystemSummary,
  getUiBindingValidation,
  getUiBindingStatus,
  getSystemRatingActivity,
} from "@/lib/services"
import type {
  AuditLogEntry,
  RatingActivitySummary,
  SystemContracts,
  SystemErrorCodesResponse,
  SystemSummary,
  UiBindingValidationState,
} from "@/types/api"

type SummaryDelta = {
  users_total: number
  votes_total: number
  votes_open: number
  votes_frozen: number
  votes_closed: number
}

type IncidentSeverity = "critical" | "error" | "warning"

export default function SystemMonitorPage() {
  const router = useRouter()
  const { userId, isCheckingAuth } = useRequireAuth()
  const request = useApiRequest()
  const [summary, setSummary] = useState<SystemSummary | null>(null)
  const [contracts, setContracts] = useState<SystemContracts | null>(null)
  const [errorCodes, setErrorCodes] = useState<SystemErrorCodesResponse | null>(null)
  const [bindingState, setBindingState] = useState<UiBindingValidationState | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([])
  const [ratingActivity, setRatingActivity] = useState<RatingActivitySummary | null>(null)
  const [previousRatingActivity, setPreviousRatingActivity] = useState<RatingActivitySummary | null>(null)
  const [ratingActivityLoading, setRatingActivityLoading] = useState(false)
  const [ratingActivityRefreshTime, setRatingActivityRefreshTime] = useState<string | null>(null)
  const [auditQuery, setAuditQuery] = useState("")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [auditLimit, setAuditLimit] = useState(20)
  const [auditPeriod, setAuditPeriod] = useState<"all" | "1h" | "24h" | "7d">("all")
  const [adminMessage, setAdminMessage] = useState("")
  const [contractQuery, setContractQuery] = useState("")
  const [contractMethodFilter, setContractMethodFilter] = useState<"ALL" | "GET" | "POST">("ALL")
  const [contractScopeFilter, setContractScopeFilter] = useState<"ALL" | "SYSTEM">("ALL")
  const [auditErrorsOnly, setAuditErrorsOnly] = useState(false)
  const [lastLatencyMs, setLastLatencyMs] = useState<number | null>(null)
  const [summaryDelta, setSummaryDelta] = useState<SummaryDelta | null>(null)
  const [acknowledgedIncidentIds, setAcknowledgedIncidentIds] = useState<string[]>([])

  useEffect(() => {
    setAcknowledgedIncidentIds(getAcknowledgedIncidentIds())
  }, [])

  useEffect(() => {
    persistAcknowledgedIncidentIds(acknowledgedIncidentIds)
  }, [acknowledgedIncidentIds])

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }
    void loadSystemData()
  }, [isCheckingAuth, userId, auditLimit])

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }

    const interval = window.setInterval(() => {
      void loadSystemData(true)
    }, 30000)

    return () => window.clearInterval(interval)
  }, [isCheckingAuth, userId])

  const loadSystemData = async (keepError = false) => {
    const startedAt = performance.now()
    setRatingActivityLoading(true)
    const loaded = await request.execute(async () => {
      const [summaryRes, contractsRes, errorCodesRes, bindingStatusRes, auditRes, ratingRes] = await Promise.all([
        getSystemSummary(),
        getSystemContracts(),
        getSystemErrorCodes(),
        getUiBindingStatus(),
        getSystemAuditLogs(auditLimit),
        getSystemRatingActivity(24),
      ])

      return {
        summary: summaryRes.data,
        contracts: contractsRes.data,
        errorCodes: errorCodesRes.data,
        bindingState: bindingStatusRes.data,
        auditLogs: auditRes.data,
        ratingActivity: ratingRes.data,
      }
    }, { keepError })

    if (!loaded) {
      return
    }

    setSummary((prev) => {
      if (!prev) {
        setSummaryDelta(null)
        return loaded.summary
      }

      setSummaryDelta({
        users_total: loaded.summary.users_total - prev.users_total,
        votes_total: loaded.summary.votes_total - prev.votes_total,
        votes_open: loaded.summary.votes_open - prev.votes_open,
        votes_frozen: loaded.summary.votes_frozen - prev.votes_frozen,
        votes_closed: loaded.summary.votes_closed - prev.votes_closed,
      })

      return loaded.summary
    })
    setContracts(loaded.contracts)
    setErrorCodes(loaded.errorCodes)
    setBindingState(loaded.bindingState)
    setAuditLogs(loaded.auditLogs)
    setPreviousRatingActivity(ratingActivity)
    setRatingActivity(loaded.ratingActivity)
    setRatingActivityRefreshTime(new Date().toISOString())
    setRatingActivityLoading(false)
    setLastUpdated(new Date().toISOString())
    setLastLatencyMs(Math.round(performance.now() - startedAt))
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const contractCount = useMemo(() => {
    if (!contracts) return 0
    return Object.values(contracts).reduce((acc, group) => acc + Object.keys(group).length, 0)
  }, [contracts])

  const contractRows = useMemo(() => {
    if (!contracts) {
      return []
    }

    return Object.entries(contracts).flatMap(([groupName, entries]) =>
      Object.entries(entries).map(([entryName, entry]) => ({
        id: `${groupName}:${entryName}`,
        groupName,
        entryName,
        method: entry.method,
        path: entry.path,
      })),
    )
  }, [contracts])

  const filteredContracts = useMemo(() => {
    const query = contractQuery.trim().toLowerCase()
    return contractRows.filter((row) => {
      if (contractMethodFilter !== "ALL" && row.method.toUpperCase() !== contractMethodFilter) {
        return false
      }
      if (contractScopeFilter === "SYSTEM" && row.groupName !== "system") {
        return false
      }
      if (!query) {
        return true
      }
      return (
        row.groupName.toLowerCase().includes(query) ||
        row.entryName.toLowerCase().includes(query) ||
        row.method.toLowerCase().includes(query) ||
        row.path.toLowerCase().includes(query)
      )
    })
  }, [contractRows, contractQuery, contractMethodFilter, contractScopeFilter])

  const voteDistribution = useMemo(() => {
    const votesTotal = summary?.votes_total ?? 0
    const votesOpen = summary?.votes_open ?? 0
    const votesFrozen = summary?.votes_frozen ?? 0
    const votesClosed = summary?.votes_closed ?? 0

    if (!votesTotal) {
      return { openPct: 0, frozenPct: 0, closedPct: 0 }
    }

    return {
      openPct: Math.round((votesOpen / votesTotal) * 100),
      frozenPct: Math.round((votesFrozen / votesTotal) * 100),
      closedPct: Math.round((votesClosed / votesTotal) * 100),
    }
  }, [summary])

  const filteredAuditLogs = useMemo(() => {
    const now = Date.now()
    const periodMsByKey: Record<"all" | "1h" | "24h" | "7d", number> = {
      all: 0,
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    }
    const query = auditQuery.trim().toLowerCase()
    return auditLogs.filter((log) => {
      const periodMs = periodMsByKey[auditPeriod]
      if (periodMs > 0) {
        const timestamp = new Date(log.timestamp).getTime()
        if (Number.isNaN(timestamp) || now - timestamp > periodMs) {
          return false
        }
      }

      if (!query) {
        const actionLower = log.action.toLowerCase()
        return !auditErrorsOnly || actionLower.includes("error") || actionLower.includes("fail")
      }
      const action = log.action.toLowerCase()
      const userIdValue = log.user_id.toLowerCase()
      const matchesSearch = action.includes(query) || userIdValue.includes(query)
      if (!matchesSearch) {
        return false
      }
      return !auditErrorsOnly || action.includes("error") || action.includes("fail")
    })
  }, [auditLogs, auditQuery, auditPeriod, auditErrorsOnly])

  const healthBadge = useMemo(() => {
    if (lastLatencyMs === null) {
      return { label: "Unknown", className: "text-muted-foreground" }
    }
    if (lastLatencyMs <= 400) {
      return { label: "Healthy", className: "text-green-500" }
    }
    if (lastLatencyMs <= 1200) {
      return { label: "Degraded", className: "text-yellow-500" }
    }
    return { label: "Slow", className: "text-red-500" }
  }, [lastLatencyMs])

  const incidentTimeline = useMemo(() => {
    const now = Date.now()
    const last24h = 24 * 60 * 60 * 1000

    const getSeverity = (action: string): IncidentSeverity | null => {
      const normalized = action.toLowerCase()
      if (normalized.includes("critical") || normalized.includes("fatal") || normalized.includes("panic")) {
        return "critical"
      }
      if (normalized.includes("error") || normalized.includes("fail")) {
        return "error"
      }
      if (normalized.includes("warn") || normalized.includes("retry")) {
        return "warning"
      }
      return null
    }

    const incidents = auditLogs
      .map((log) => {
        const severity = getSeverity(log.action)
        return severity ? { ...log, severity } : null
      })
      .filter((log): log is AuditLogEntry & { severity: IncidentSeverity } => {
        if (!log) return false
        const ts = new Date(log.timestamp).getTime()
        return !Number.isNaN(ts) && now - ts <= last24h
      })
      .slice()
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return incidents.slice(0, 8)
  }, [auditLogs])

  const incidentCount24h = incidentTimeline.length

  const unacknowledgedIncidentCount = useMemo(() => {
    return incidentTimeline.filter((incident) => !acknowledgedIncidentIds.includes(incident.log_id)).length
  }, [incidentTimeline, acknowledgedIncidentIds])

  const incidentSeverityStats = useMemo(() => {
    return incidentTimeline.reduce(
      (acc, item) => {
        acc[item.severity] += 1
        return acc
      },
      { critical: 0, error: 0, warning: 0 } as Record<IncidentSeverity, number>,
    )
  }, [incidentTimeline])

  const recurringIncidents = useMemo(() => {
    const counts = incidentTimeline.reduce((acc, incident) => {
      const key = incident.action
      acc[key] = (acc[key] ?? 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [incidentTimeline])

  const formatDelta = (value: number | undefined) => {
    if (value === undefined || value === null || value === 0) {
      return "0"
    }
    return value > 0 ? `+${value}` : `${value}`
  }

  const handleExportErrorCodes = () => {
    if (!errorCodes) return
    const blob = new Blob([JSON.stringify(errorCodes, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "system-error-codes.json"
    link.click()
    window.URL.revokeObjectURL(url)
    setAdminMessage("Error codes exported to JSON.")
  }

  const handleRunUiBindingValidation = async () => {
    const response = await request.execute(() => getUiBindingValidation(), { keepError: true })
    if (!response) {
      return
    }
    setBindingState(response.data)
    setAdminMessage(response.data.valid ? "UI binding validation: valid." : "UI binding validation: invalid.")
  }

  const handleAcknowledgeIncident = (logId: string) => {
    setAcknowledgedIncidentIds((prev) => (prev.includes(logId) ? prev : [...prev, logId]))
  }

  const handleResetAcknowledgements = () => {
    setAcknowledgedIncidentIds([])
  }

  if (request.loading && !summary) {
    return <LoadingState fullScreen message="Loading system monitor..." />
  }

  return (
    <PageShell
      title="System Monitor"
      subtitle="Operational contracts and reliability telemetry"
      titleClassName="text-primary glow-cyan"
      onLogout={handleLogout}
    >
      <ErrorAlert message={request.error} className="mb-6" />
      {adminMessage ? (
        <div className="mb-6 rounded border border-primary/40 bg-primary/10 p-3 text-sm text-primary">{adminMessage}</div>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-muted-foreground">
          Last update: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "not yet"}
        </p>
        <p className={`text-sm font-medium ${healthBadge.className}`}>
          Health: {healthBadge.label} {lastLatencyMs !== null ? `(${lastLatencyMs} ms)` : ""}
        </p>
        <Button
          type="button"
          variant="outline"
          className="bg-transparent"
          onClick={() => void loadSystemData(true)}
          disabled={request.loading}
        >
          {request.loading ? "Refreshing..." : "Refresh now"}
        </Button>
      </div>
      <Card className="border-primary/30 bg-card/50 backdrop-blur mb-6">
        <CardHeader>
          <CardTitle className="text-primary">Admin Controls</CardTitle>
          <CardDescription>Manual operational actions for contracts and logs</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" className="bg-transparent" onClick={handleRunUiBindingValidation}>
            Validate UI Binding
          </Button>
          <Button type="button" variant="outline" className="bg-transparent" onClick={handleExportErrorCodes}>
            Export Error Codes JSON
          </Button>
          <label className="text-sm text-muted-foreground">
            Audit limit
            <select
              className="ml-2 rounded border border-border/50 bg-background/50 px-2 py-1 text-foreground"
              value={auditLimit}
              onChange={(event) => setAuditLimit(Number(event.target.value))}
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </label>
          <label className="text-sm text-muted-foreground">
            Period
            <select
              className="ml-2 rounded border border-border/50 bg-background/50 px-2 py-1 text-foreground"
              value={auditPeriod}
              onChange={(event) => setAuditPeriod(event.target.value as "all" | "1h" | "24h" | "7d")}
            >
              <option value="all">All</option>
              <option value="1h">Last 1 hour</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
            </select>
          </label>
          <Button type="button" variant="outline" className="bg-transparent" onClick={() => void loadSystemData(true)}>
            Apply log filters
          </Button>
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={auditErrorsOnly}
              onChange={(event) => setAuditErrorsOnly(event.target.checked)}
            />
            Errors only logs
          </label>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-primary/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-primary">
              {summary?.users_total ?? "-"}
              <span className="ml-2 text-xs text-muted-foreground">({formatDelta(summaryDelta?.users_total)})</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-secondary/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardDescription>Total Proposals</CardDescription>
            <CardTitle className="text-secondary">
              {summary?.votes_total ?? "-"}
              <span className="ml-2 text-xs text-muted-foreground">({formatDelta(summaryDelta?.votes_total)})</span>
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-accent/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardDescription>API Contracts</CardDescription>
            <CardTitle className="text-accent">{contractCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-green-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardDescription>UI Binding</CardDescription>
            <CardTitle className="text-green-500">{bindingState?.valid ? "VALID" : "INVALID"}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="border-accent/30 bg-card/50 backdrop-blur mb-6">
        <CardHeader>
          <CardTitle className="text-accent">Proposal Status Distribution</CardTitle>
          <CardDescription>Live ratio of proposal lifecycle states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-cyan-400">Open</span>
              <span className="text-muted-foreground">{voteDistribution.openPct}%</span>
            </div>
            <Progress value={voteDistribution.openPct} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-violet-400">Frozen</span>
              <span className="text-muted-foreground">{voteDistribution.frozenPct}%</span>
            </div>
            <Progress value={voteDistribution.frozenPct} className="h-2" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-emerald-400">Closed</span>
              <span className="text-muted-foreground">{voteDistribution.closedPct}%</span>
            </div>
            <Progress value={voteDistribution.closedPct} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Rating Activity Section */}
      <RatingIntegrityWatch
        data={ratingActivity}
        loading={ratingActivityLoading}
        lastRefreshTime={ratingActivityRefreshTime}
        previousData={previousRatingActivity}
      />

      <RatingActivityCard data={ratingActivity} loading={ratingActivityLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-primary/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-primary">Error Codes</CardTitle>
            <CardDescription>Stable backend error contract map</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {errorCodes ? (
              Object.entries(errorCodes.codes).map(([code, info]) => (
                <div key={code} className="rounded border border-border/50 p-2 text-sm">
                  <p className="font-mono text-primary">{code}</p>
                  <p className="text-muted-foreground">HTTP {info.status_code}</p>
                  <p>{info.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No error code data.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-secondary/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-secondary">Recent Audit Logs</CardTitle>
            <CardDescription>Filtered operational actions from system audit trail</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Input
              value={auditQuery}
              onChange={(event) => setAuditQuery(event.target.value)}
              placeholder="Filter by action or user id"
              className="bg-background/50 border-border/50"
            />
          </CardContent>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto">
            {filteredAuditLogs.length > 0 ? (
              filteredAuditLogs
                .slice()
                .reverse()
                .map((log) => (
                  <div key={log.log_id} className="rounded border border-border/50 p-2 text-sm">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-muted-foreground">user: {log.user_id}</p>
                    <p className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                ))
            ) : (
              <p className="text-sm text-muted-foreground">No audit logs match this filter.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-500/30 bg-card/50 backdrop-blur mt-6">
        <CardHeader>
          <CardTitle className="text-red-400">Incident Timeline (Last 24h)</CardTitle>
          <CardDescription>
            Detected error/fail actions: <span className="font-medium">{incidentCount24h}</span>
          </CardDescription>
          <CardDescription>
            Critical: {incidentSeverityStats.critical} | Error: {incidentSeverityStats.error} | Warning:{" "}
            {incidentSeverityStats.warning}
          </CardDescription>
          <CardDescription>
            Unacknowledged: <span className="font-medium">{unacknowledgedIncidentCount}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 max-h-64 overflow-y-auto">
          {incidentTimeline.length > 0 ? (
            incidentTimeline.map((incident) => (
              <div key={incident.log_id} className="rounded border border-red-500/30 bg-red-500/5 p-2 text-sm">
                <p
                  className={`font-medium ${
                    incident.severity === "critical"
                      ? "text-red-300"
                      : incident.severity === "error"
                        ? "text-orange-300"
                        : "text-yellow-300"
                  }`}
                >
                  [{incident.severity.toUpperCase()}] {incident.action}
                </p>
                <p className="text-muted-foreground">user: {incident.user_id}</p>
                <p className="text-muted-foreground">{new Date(incident.timestamp).toLocaleString()}</p>
                <div className="mt-2">
                  {acknowledgedIncidentIds.includes(incident.log_id) ? (
                    <span className="text-xs text-green-400">Acknowledged</span>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 px-2 text-xs bg-transparent"
                      onClick={() => handleAcknowledgeIncident(incident.log_id)}
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No incidents detected in the last 24 hours.</p>
          )}
        </CardContent>
        <CardContent className="pt-0">
          <Button type="button" variant="outline" className="bg-transparent" onClick={handleResetAcknowledgements}>
            Reset acknowledgements
          </Button>
        </CardContent>
      </Card>

      <Card className="border-orange-500/30 bg-card/50 backdrop-blur mt-6">
        <CardHeader>
          <CardTitle className="text-orange-300">Top Recurring Error Actions</CardTitle>
          <CardDescription>Most frequent incident action names in the last 24h</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {recurringIncidents.length > 0 ? (
            recurringIncidents.map(([action, count]) => (
              <div key={action} className="rounded border border-orange-500/30 bg-orange-500/5 p-2 text-sm">
                <p className="font-medium text-orange-200">{action}</p>
                <p className="text-muted-foreground">Occurrences: {count}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No recurring incidents in the last 24 hours.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-card/50 backdrop-blur mt-6">
        <CardHeader>
          <CardTitle className="text-primary">API Contracts Search</CardTitle>
          <CardDescription>Find endpoints by group, action, method, or path</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={contractMethodFilter === "ALL" ? "default" : "outline"}
              className={contractMethodFilter === "ALL" ? "" : "bg-transparent"}
              onClick={() => setContractMethodFilter("ALL")}
            >
              All methods
            </Button>
            <Button
              type="button"
              variant={contractMethodFilter === "GET" ? "default" : "outline"}
              className={contractMethodFilter === "GET" ? "" : "bg-transparent"}
              onClick={() => setContractMethodFilter("GET")}
            >
              GET only
            </Button>
            <Button
              type="button"
              variant={contractMethodFilter === "POST" ? "default" : "outline"}
              className={contractMethodFilter === "POST" ? "" : "bg-transparent"}
              onClick={() => setContractMethodFilter("POST")}
            >
              POST only
            </Button>
            <Button
              type="button"
              variant={contractScopeFilter === "ALL" ? "default" : "outline"}
              className={contractScopeFilter === "ALL" ? "" : "bg-transparent"}
              onClick={() => setContractScopeFilter("ALL")}
            >
              All groups
            </Button>
            <Button
              type="button"
              variant={contractScopeFilter === "SYSTEM" ? "default" : "outline"}
              className={contractScopeFilter === "SYSTEM" ? "" : "bg-transparent"}
              onClick={() => setContractScopeFilter("SYSTEM")}
            >
              system/* only
            </Button>
          </div>
          <Input
            value={contractQuery}
            onChange={(event) => setContractQuery(event.target.value)}
            placeholder="Search: proposals vote POST /api/proposals/{vote_id}/vote"
            className="bg-background/50 border-border/50"
          />
          <div className="max-h-72 overflow-y-auto space-y-2">
            {filteredContracts.length > 0 ? (
              filteredContracts.map((row) => (
                <div key={row.id} className="rounded border border-border/50 p-2 text-sm">
                  <p className="font-medium">
                    {row.groupName}.{row.entryName}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-primary">{row.method}</p>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-7 px-2 text-xs bg-transparent"
                      onClick={() => {
                        navigator.clipboard.writeText(`${row.method} ${row.path}`)
                        setAdminMessage(`Copied endpoint: ${row.method} ${row.path}`)
                      }}
                    >
                      Copy endpoint
                    </Button>
                  </div>
                  <p className="text-muted-foreground break-all">{row.path}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No contracts match this search.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  )
}

