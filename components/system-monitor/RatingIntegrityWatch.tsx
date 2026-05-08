"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, TrendingDown, TrendingUp, Clock } from "lucide-react"
import type { RatingActivitySummary } from "@/types/api"

interface RatingIntegrityWatchProps {
  data: RatingActivitySummary | null
  loading: boolean
  lastRefreshTime?: string | null
  previousData?: RatingActivitySummary | null
}

export function RatingIntegrityWatch({
  data,
  loading,
  lastRefreshTime,
  previousData,
}: RatingIntegrityWatchProps) {
  const signals = useMemo(() => {
    if (!data) return { updateRatio: 0, isHighUpdate: false, updateTrend: "stable" as const }

    const updateRatio = data.events_total > 0 ? (data.updated_events / data.events_total) * 100 : 0
    
    let updateTrend: "stable" | "increasing" | "decreasing" = "stable"
    if (previousData) {
      const prevUpdateRatio =
        previousData.events_total > 0
          ? (previousData.updated_events / previousData.events_total) * 100
          : 0
      if (updateRatio > prevUpdateRatio + 5) {
        updateTrend = "increasing"
      } else if (updateRatio < prevUpdateRatio - 5) {
        updateTrend = "decreasing"
      }
    }

    return {
      updateRatio: Math.round(updateRatio),
      isHighUpdate: updateRatio > 60,
      updateTrend,
    }
  }, [data, previousData])

  if (loading) {
    return (
      <Card className="border-muted/30 bg-card/50 backdrop-blur mb-6">
        <CardHeader>
          <div className="h-6 bg-muted/20 rounded w-40"></div>
          <div className="h-4 bg-muted/20 rounded w-60 mt-2"></div>
        </CardHeader>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="border-muted/30 bg-card/50 backdrop-blur mb-6">
        <CardHeader>
          <CardTitle>Rating Integrity Watch</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card
      className={
        signals.isHighUpdate
          ? "border-red-500/50 bg-red-500/5 backdrop-blur mb-6"
          : "border-green-500/50 bg-green-500/5 backdrop-blur mb-6"
      }
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle className={signals.isHighUpdate ? "text-red-400" : "text-green-400"}>
              Rating Integrity Watch
            </CardTitle>
            <CardDescription>
              Monitors update ratio and rating system health
            </CardDescription>
          </div>
          {signals.isHighUpdate && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Update Ratio Severity */}
        <div
          className={
            signals.isHighUpdate
              ? "rounded border border-red-500/50 bg-red-500/10 p-4"
              : "rounded border border-green-500/50 bg-green-500/10 p-4"
          }
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className={signals.isHighUpdate ? "text-red-300 font-semibold text-sm" : "text-green-300 font-semibold text-sm"}>
              Update Ratio
            </span>
            <span className={signals.isHighUpdate ? "text-2xl font-bold text-red-400" : "text-2xl font-bold text-green-400"}>
              {signals.updateRatio}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {data.updated_events} re-rated out of {data.events_total} total events
          </p>
          {signals.isHighUpdate && (
            <div className="rounded border border-red-500/30 bg-red-500/5 p-2 mt-2">
              <p className="text-xs text-red-300 font-semibold">
                ⚠️ HIGH SEVERITY: Update ratio exceeds 60% threshold
              </p>
              <p className="text-xs text-red-200/70 mt-1">
                Members are frequently revising ratings. This may indicate rating volatility or correction patterns.
              </p>
            </div>
          )}
        </div>

        {/* Trend State */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Current State</p>
            <p className={`text-sm font-semibold ${signals.isHighUpdate ? "text-red-400" : "text-green-400"}`}>
              {signals.isHighUpdate ? "🔴 High Update" : "🟢 Normal"}
            </p>
          </div>
          <div className="rounded border border-border/50 bg-background/30 p-3">
            <p className="text-xs text-muted-foreground mb-1">Trend</p>
            <div className="flex items-center gap-1">
              {signals.updateTrend === "increasing" && (
                <>
                  <TrendingUp className="w-4 h-4 text-red-400" />
                  <p className="text-sm font-semibold text-red-400">Increasing</p>
                </>
              )}
              {signals.updateTrend === "decreasing" && (
                <>
                  <TrendingDown className="w-4 h-4 text-green-400" />
                  <p className="text-sm font-semibold text-green-400">Decreasing</p>
                </>
              )}
              {signals.updateTrend === "stable" && (
                <p className="text-sm font-semibold text-yellow-400">→ Stable</p>
              )}
            </div>
          </div>
        </div>

        {/* Last Refresh Timestamp */}
        {lastRefreshTime && (
          <div className="flex items-center gap-2 rounded border border-border/30 bg-background/20 p-2.5 text-xs">
            <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <span className="text-muted-foreground">
              Last refresh: {new Date(lastRefreshTime).toLocaleTimeString()}
            </span>
          </div>
        )}

        {/* Integrity Notice */}
        <div className="rounded border border-accent/30 bg-accent/5 p-3 text-xs">
          <p className="text-accent font-semibold">System Health:</p>
          <p className="text-muted-foreground mt-1">
            Update ratio tracks rating system activity. High ratios reflect member engagement in rating refinement. System continues operating normally regardless of update ratio.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
