
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsDown, ThumbsUp, Clock, Users, CheckCircle2 } from "lucide-react"

type ProposalCardProps = {
  id: string
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  status?: string
  quorumRequired?: number
  quorumPercentage?: number
  votingDeadline?: string
  totalVoters?: number
  onVote: (proposalId: string, voteFor: boolean) => void
}

function StatusBadge({ status }: { status: string }) {
  const s = (status || "OPEN").toUpperCase()
  if (s === "OPEN") {
    return (
      <span className="status-open inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-widest flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-glow" />
        OPEN
      </span>
    )
  }
  if (s === "FROZEN") {
    return (
      <span className="status-frozen inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-widest flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        FROZEN
      </span>
    )
  }
  return (
    <span className="status-closed inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-widest flex-shrink-0">
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {s || "CLOSED"}
    </span>
  )
}

export function ProposalCard({
  id,
  title,
  description,
  votesFor,
  votesAgainst,
  status = "OPEN",
  quorumRequired,
  quorumPercentage,
  votingDeadline,
  totalVoters,
  onVote,
}: ProposalCardProps) {
  const totalVotes = votesFor + votesAgainst
  const forPct = totalVotes === 0 ? 50 : Math.round((votesFor / totalVotes) * 100)
  const isOpen = (status || "").toUpperCase() === "OPEN"

  const deadlineStr = votingDeadline
    ? new Date(votingDeadline).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null

  const quorumMet =
    quorumRequired !== undefined &&
    quorumPercentage !== undefined &&
    quorumPercentage >= quorumRequired

  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur hover:border-primary/35 hover:box-glow-cyan transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-base text-foreground leading-snug">{title}</CardTitle>
          <StatusBadge status={status} />
        </div>
        <CardDescription className="text-sm leading-relaxed mt-1">{description}</CardDescription>

        {/* Meta row */}
        {(totalVoters !== undefined || deadlineStr) && (
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
            {totalVoters !== undefined && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                {totalVoters} registered voters
              </span>
            )}
            {deadlineStr && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Deadline: {deadlineStr}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Vote result bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-emerald-400">FOR {votesFor} &middot; {forPct}%</span>
            <span className="text-rose-400">{100 - forPct}% &middot; {votesAgainst} AGAINST</span>
          </div>
          <div className="h-2 rounded-full bg-rose-500/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-700 ease-out"
              style={{ width: forPct + "%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {totalVotes} total {totalVotes === 1 ? "vote" : "votes"} cast
          </p>
        </div>

        {/* Quorum progress */}
        {quorumRequired !== undefined && quorumPercentage !== undefined && (
          <div className="space-y-1.5 p-3 rounded-lg bg-secondary/5 border border-secondary/15">
            <div className="flex justify-between items-center text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className={"w-3 h-3 " + (quorumMet ? "text-emerald-400" : "text-secondary")} />
                Quorum
              </span>
              <span className={"font-semibold " + (quorumMet ? "text-emerald-400" : "text-secondary")}>
                {quorumPercentage.toFixed(1)}% / {quorumRequired}% required
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary/15 overflow-hidden">
              <div
                className={
                  "h-full rounded-full transition-all duration-700 ease-out " +
                  (quorumMet
                    ? "bg-gradient-to-r from-emerald-600 to-emerald-400"
                    : "bg-gradient-to-r from-secondary/70 to-secondary")
                }
                style={{
                  width: Math.min((quorumPercentage / quorumRequired) * 100, 100) + "%",
                }}
              />
            </div>
          </div>
        )}

        {/* Vote buttons */}
        <div className="flex gap-3 pt-1">
          <Button
            onClick={() => onVote(id, true)}
            disabled={!isOpen}
            className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)] disabled:opacity-40 transition-all duration-200 font-semibold"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Vote For
          </Button>
          <Button
            onClick={() => onVote(id, false)}
            disabled={!isOpen}
            className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:border-rose-500/60 hover:shadow-[0_0_15px_rgba(239,68,68,0.25)] disabled:opacity-40 transition-all duration-200 font-semibold"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Vote Against
          </Button>
        </div>

        {!isOpen && (
          <p className="text-xs text-muted-foreground/60 text-center">
            This proposal is no longer accepting votes.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
