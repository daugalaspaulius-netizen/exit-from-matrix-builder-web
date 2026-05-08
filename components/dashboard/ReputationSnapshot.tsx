"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, TrendingUp } from "lucide-react"
import type { RatingHistoryEntry } from "@/types/api"

interface ReputationSnapshotProps {
  ratingScore?: number
  ratingVotes?: number
  recentRatings: RatingHistoryEntry[] | null
  loading: boolean
}

export function ReputationSnapshot({
  ratingScore = 0,
  ratingVotes = 0,
  recentRatings,
  loading,
}: ReputationSnapshotProps) {
  const lastFive = useMemo(() => {
    if (!recentRatings) return []
    return recentRatings.slice(0, 5)
  }, [recentRatings])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
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

  return (
    <>
      {/* Reputation Snapshot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-accent/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Reputation Score</CardDescription>
              <Award className="w-4 h-4 text-accent" />
            </div>
            <CardTitle className="text-accent">{ratingScore.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Your community-assessed reputation score
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Rating Votes</CardDescription>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <CardTitle className="text-purple-400">{ratingVotes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Total community ratings received
            </p>
          </CardContent>
        </Card>

        <Card className="border-cyan-500/30 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardDescription>Recent Ratings</CardDescription>
              <span className="text-xs text-cyan-400 font-semibold">
                {lastFive.length}/{recentRatings?.length || 0}
              </span>
            </div>
            <CardTitle className="text-cyan-400">{lastFive.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Latest community feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Ratings Detail */}
      {lastFive.length > 0 && (
        <Card className="border-accent/30 bg-card/50 backdrop-blur mb-8">
          <CardHeader>
            <CardTitle className="text-accent">Last 5 Ratings</CardTitle>
            <CardDescription>Recent community feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lastFive.map((rating, idx) => (
                <div
                  key={idx}
                  className="rounded border border-border/50 p-3 bg-background/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {rating.target_username}
                      </p>
                      {rating.comment && (
                        <p className="text-sm text-muted-foreground mt-1 break-words">
                          {rating.comment}
                        </p>
                      )}
                      {rating.context && (
                        <p className="text-xs text-muted-foreground/70 mt-1 italic">
                          Context: {rating.context}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-accent">
                        {rating.rating_score.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canonical Notice */}
      <div className="mb-8 rounded border border-accent/30 bg-accent/5 p-4">
        <p className="text-xs text-accent font-semibold">📌 About Reputation</p>
        <p className="text-sm text-muted-foreground mt-2">
          <span className="font-semibold text-accent">Reputation is motivational only.</span> Your reputation score reflects community feedback and is used for transparency and recognition purposes. However, <span className="font-semibold text-accent">voting rights remain always equal: 1 person = 1 vote</span>. Your reputation score does not affect your voting power or participation rights.
        </p>
        <p className="text-xs text-muted-foreground mt-3 italic">
          Šlovė yra motyvuojanti tik. Jūsų balsavimo teisės visada lieka lygios.
        </p>
      </div>
    </>
  )
}
