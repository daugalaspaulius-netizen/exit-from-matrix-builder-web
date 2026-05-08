"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Target, TrendingUp, AlertCircle, Zap } from "lucide-react"
import type { RatingActivitySummary } from "@/types/api"

interface RatingActivityCardProps {
  data: RatingActivitySummary | null
  loading: boolean
}

export function RatingActivityCard({ data, loading }: RatingActivityCardProps) {
  const ratingSignals = useMemo(() => {
    if (!data) return { trend: "unknown", updateRatio: 0, isHighUpdate: false }

    // Trend calculation: low (0-30%), medium (30-70%), high (70%+)
    const updateRatio = data.events_total > 0 ? (data.updated_events / data.events_total) * 100 : 0
    const participationRatio = data.events_total > 0 ? (data.unique_raters / Math.max(data.unique_targets, 1)) : 0

    let trend: "low" | "medium" | "high" = "low"
    if (participationRatio > 2) {
      trend = "high"
    } else if (participationRatio > 1) {
      trend = "medium"
    }

    return {
      trend,
      updateRatio: Math.round(updateRatio),
      isHighUpdate: updateRatio > 60,
    }
  }, [data])
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-muted/30 bg-card/50 backdrop-blur">
            <CardHeader>
              <div className="h-4 bg-muted/20 rounded w-20"></div>
              <div className="h-6 bg-muted/20 rounded w-12 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) {
    return (
      <Card className="border-muted/30 bg-card/50 backdrop-blur mb-8">
        <CardHeader>
          <CardTitle>Rating Activity</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      {/* Activity Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-cyan-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Total Ratings</CardDescription>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <CardTitle className="text-cyan-400">{data.events_total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-purple-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Unique Raters</CardDescription>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-purple-400">{data.unique_raters}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-pink-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Rated Targets</CardDescription>
              <Target className="w-4 h-4 text-pink-400" />
            </div>
            <CardTitle className="text-pink-400">{data.unique_targets}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border-green-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Updated</CardDescription>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <CardTitle className="text-green-500">{data.updated_events}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Rating Signals & Warnings */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-yellow-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-yellow-400">Activity Level</CardTitle>
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <CardDescription>Rating participation trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                {ratingSignals.trend === "high" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-green-300">High Activity</span>
                  </div>
                )}
                {ratingSignals.trend === "medium" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="text-xs font-semibold text-yellow-300">Medium Activity</span>
                  </div>
                )}
                {ratingSignals.trend === "low" && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/50">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-xs font-semibold text-blue-300">Low Activity</span>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Based on rater participation ratio
            </p>
          </CardContent>
        </Card>

        {/* Update Ratio Card */}
        <Card className={ratingSignals.isHighUpdate ? "border-red-500/30 bg-red-500/5 backdrop-blur" : "border-border/30 bg-card/50 backdrop-blur"}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Update Ratio</CardTitle>
              {ratingSignals.isHighUpdate && <AlertCircle className="w-4 h-4 text-red-400" />}
            </div>
            <CardDescription>Re-ratings vs total events</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-accent">{ratingSignals.updateRatio}%</p>
            {ratingSignals.isHighUpdate && (
              <div className="mt-3 rounded border border-red-500/50 bg-red-500/10 p-2">
                <p className="text-xs text-red-300">
                  ⚠ High update ratio detected. Members are frequently revising ratings.
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              {data?.updated_events || 0} updated out of {data?.events_total || 0} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Canonical Rule Notice */}
      <div className="mb-8 rounded border border-accent/30 bg-accent/5 p-4">
        <p className="text-xs text-accent font-semibold">📌 Canonical Rule</p>
        <p className="text-sm text-muted-foreground mt-2">
          Reputation ratings are motivational metrics reflecting community feedback. Voting rights remain always equal: <span className="font-semibold text-accent">1 person = 1 vote</span>. Rating scores do not affect voting power.
        </p>
      </div>

      {/* Top Rated Targets */}
      <Card className="border-accent/30 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-accent">Top Rated Members</CardTitle>
          <CardDescription>Highest reputation scores from community ratings</CardDescription>
        </CardHeader>
        <CardContent>
          {data.top_targets && data.top_targets.length > 0 ? (
            <div className="space-y-3">
              {data.top_targets.map((target, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded border border-border/50 p-3 bg-background/30"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{target.username}</p>
                    <p className="text-sm text-muted-foreground">
                      Rating: {target.rating_score.toFixed(2)} ({target.rating_votes} votes)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-accent">{target.rating_score.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">{target.rating_votes} ratings</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No rating data available yet</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}
