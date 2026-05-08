"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, Target, TrendingUp } from "lucide-react"
import type { RatingActivitySummary } from "@/types/api"

interface RatingActivityCardProps {
  data: RatingActivitySummary | null
  loading: boolean
}

export function RatingActivityCard({ data, loading }: RatingActivityCardProps) {
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
