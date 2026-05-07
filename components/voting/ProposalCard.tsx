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
    <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl text-text-primary">{title}</CardTitle>
        <CardDescription className="text-base text-text-secondary">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-success">Už: {votesFor}</span>
            <span className="text-error">Prieš: {votesAgainst}</span>
          </div>
          <Progress value={percentage} className="h-2 bg-border">
            <div
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </Progress>
          <p className="text-xs text-text-muted text-center">
            {totalVotes} {totalVotes === 1 ? "balsas" : "balsai"} iš viso
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => onVote(id, true)}
            className="flex-1 bg-success/10 hover:bg-success/20 text-success border border-success/50"
          >
            <ThumbsUp className="w-4 h-4 mr-2" />
            Balsuoti UŽ
          </Button>
          <Button
            onClick={() => onVote(id, false)}
            className="flex-1 bg-error/10 hover:bg-error/20 text-error border border-error/50"
          >
            <ThumbsDown className="w-4 h-4 mr-2" />
            Balsuoti PRIEŠ
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

