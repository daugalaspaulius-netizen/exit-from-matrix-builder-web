"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThumbsDown, ThumbsUp } from "lucide-react"

type ProposalCardProps = {
  id: string
  title: string
  description: string
  votesFor: number
  votesAgainst: number
  onVote: (proposalId: string, voteFor: boolean) => void
}

export function ProposalCard({
  id,
  title,
  description,
  votesFor,
  votesAgainst,
  onVote,
}: ProposalCardProps) {
  const totalVotes = votesFor + votesAgainst
  const percentage = totalVotes === 0 ? 50 : (votesFor / totalVotes) * 100

  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur hover:border-primary/30 hover:box-glow-cyan transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/50"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Vote For
          </Button>
          <Button
            onClick={() => onVote(id, false)}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Vote Against
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

