"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThumbsDown, ThumbsUp, Info } from "lucide-react"

type ProposalCardProps = {
  id: string
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  status?: string
  resultReasonCode?: string
  resultExplanation?: string
  onVote: (proposalId: string, voteFor: boolean) => void
}

const getStatusExplanation = (status?: string, resultExplanation?: string) => {
  if (resultExplanation) {
    return resultExplanation
  }
  switch (status?.toLowerCase()) {
    case "open":
      return "Balsavimas vyksta. Dalyvaukite dabar!"
    case "frozen":
      return "✅ Kvorum pasiektas! Rezultatas fiksuotas."
    case "closed":
      return "❌ Balsavimas baigtas. Nėra kvorūmo arba atmestas."
    default:
      return null
  }
}

export function ProposalCard({
  id,
  title,
  description,
  votesFor,
  votesAgainst,
  status,
  resultReasonCode,
  resultExplanation,
  onVote,
}: ProposalCardProps) {
  const totalVotes = votesFor + votesAgainst
  const percentage = totalVotes === 0 ? 50 : (votesFor / totalVotes) * 100
  const statusExplanation = getStatusExplanation(status, resultExplanation)
  const isVotingActive = status?.toLowerCase() === "open"

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur hover:border-primary/30 hover:box-glow-cyan transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Result Explanation */}
        {statusExplanation && (
          <div className="bg-background/30 border border-border/50 rounded p-3 space-y-2">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-sm space-y-1">
                <p className="text-text-secondary">{statusExplanation}</p>
                {resultReasonCode && (
                  <p className="text-xs text-text-muted/80 font-mono">
                    Kodas: {resultReasonCode}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-green-500">For: {votesFor}</span>
            <span className="text-red-500">Against: {votesAgainst}</span>
          </div>
          <Progress value={percentage} className="h-2 bg-red-500/20">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </Progress>
          <p className="text-xs text-muted-foreground text-center">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"} cast
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onVote(id, true)}
            disabled={!isVotingActive}
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Vote For
          </Button>
          <Button
            onClick={() => onVote(id, false)}
            disabled={!isVotingActive}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Vote Against
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

