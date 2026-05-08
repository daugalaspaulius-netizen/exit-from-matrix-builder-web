"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { RatingHistoryEntry } from "@/types/api"

interface UserRatingHistoryProps {
  ratings: RatingHistoryEntry[] | null
  loading: boolean
}

export function UserRatingHistory({ ratings, loading }: UserRatingHistoryProps) {
  if (loading) {
    return (
      <Card className="border-accent/30 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-accent">My Ratings</CardTitle>
          <CardDescription>Loading rating history...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card className="border-accent/30 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-accent">My Ratings</CardTitle>
          <CardDescription>No ratings yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            You haven't rated any members yet. Ratings help build community reputation.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent/30 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-accent">My Ratings ({ratings.length})</CardTitle>
        <CardDescription>Community reputation ratings you've given</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {ratings.map((rating, idx) => (
            <div key={idx} className="rounded border border-border/50 p-3 bg-background/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{rating.target_username}</p>
                  {rating.context && (
                    <p className="text-xs text-muted-foreground mt-1">Context: {rating.context}</p>
                  )}
                  {rating.comment && (
                    <p className="text-sm text-text-secondary mt-1 italic">"{rating.comment}"</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-semibold text-accent">{rating.rating_score.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          ⓘ Ratings reflect community reputation only and do not affect voting power
        </p>
      </CardContent>
    </Card>
  )
}
