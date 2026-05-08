"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Clock, MessageCircle, AlertCircle } from "lucide-react"
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
          <CardTitle className="text-accent">My Community Ratings</CardTitle>
          <CardDescription>Loading your rating history...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!ratings || ratings.length === 0) {
    return (
      <Card className="border-accent/30 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-accent">My Community Ratings</CardTitle>
          <CardDescription>Your reputation feedback history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">You haven't rated any members yet.</p>
            <p className="text-xs text-muted-foreground">
              Rating other members helps build community reputation and visibility. Start by rating members you've worked with.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-accent/30 bg-card/50 backdrop-blur mb-6">
        <CardHeader>
          <CardTitle className="text-accent">My Community Ratings ({ratings.length})</CardTitle>
          <CardDescription>Reputation scores you've given to help build community trust</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 max-h-96 overflow-y-auto pr-4">
          {ratings.map((rating, idx) => (
            <div key={idx} className="rounded-lg border border-border/50 p-4 bg-background/50 hover:bg-background/70 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{rating.target_username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {new Date(rating.created_at).toLocaleDateString()} {new Date(rating.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-2xl font-bold text-accent">{rating.rating_score.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">reputation</p>
                </div>
              </div>

              {rating.context && (
                <div className="mb-2 rounded bg-background/50 border border-border/30 p-2">
                  <p className="text-xs text-muted-foreground font-semibold mb-1">Context</p>
                  <p className="text-xs text-text-secondary">{rating.context}</p>
                </div>
              )}

              {rating.comment && (
                <div className="flex gap-2 items-start">
                  <MessageCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-secondary italic">"{rating.comment}"</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Canonical Note */}
      <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
        <div className="flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-300 mb-1">📌 About Community Ratings</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              These ratings reflect community reputation and provide motivational feedback. They do <span className="font-semibold">not</span> affect your voting rights. Voting power remains always equal: <span className="font-semibold text-accent">1 person = 1 vote</span>, regardless of reputation score.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
