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
  quorumRequired?: number
  quorumType?: "simple" | "important" | "critical"
  participationPercentage?: number
  status?: string
  resultReasonCode?: string
  resultExplanation?: string
  resultExplanationLt?: string
  participationSummary?: string
  participationSummaryLt?: string
  onVote: (proposalId: string, voteFor: boolean) => void
}

const getQuorumInfo = (quorumType?: string, quorumRequired?: number) => {
  const baseQuorum = quorumRequired || 50
  switch (quorumType) {
    case "simple":
      return { label: "Paprastas kvorum", requirement: "50%+1 balsų", color: "text-blue-400" }
    case "important":
      return { label: "Svarbus sprendimas", requirement: "60% balsų", color: "text-yellow-400" }
    case "critical":
      return { label: "Kritinis sprendimas", requirement: "70% balsų", color: "text-red-400" }
    default:
      return { label: "Standartinis", requirement: `${baseQuorum}% balsų`, color: "text-gray-400" }
  }
}

const getStatusExplanation = (
  status?: string,
  quorumType?: string,
  votesFor?: number,
  votesAgainst?: number,
) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "Balsavimas vyksta. Dalyvaukite dabar!"
    case "pending":
      return "Balsavimas nebaigtas. Daugiau laiko lieka."
    case "frozen":
      return `✅ Kvorum pasiektas! Pasiūlymas ${votesFor && votesAgainst && votesFor > votesAgainst ? "priimtas" : "vertinamas"}. Rezultatas fiksuotas.`
    case "approved":
      return "Pasiūlymas priimtas! Sprendimas įgyvendinamas."
    case "closed":
      return `❌ Balsavimas baigtas. Kvorum nepasiektas arba priešingi balsai laimėjo. Pasiūlymas atmestas.`
    case "rejected":
      return "Pasiūlymas atmestas. Nepasiektas reikalingas kvorum."
    default:
      return "Balsavimas vyksta - jūsų balsas svarbus."
  }
}

export function ProposalCard({
  id,
  title,
  description,
  votesFor,
  votesAgainst,
  quorumRequired,
  quorumType,
  participationPercentage,
  status,
  resultReasonCode,
  resultExplanation,
  resultExplanationLt,
  participationSummary,
  participationSummaryLt,
  onVote,
}: ProposalCardProps) {
  const totalVotes = votesFor + votesAgainst
  const percentage = totalVotes === 0 ? 50 : (votesFor / totalVotes) * 100
  const quorumInfo = getQuorumInfo(quorumType, quorumRequired)
  const statusExplanation = getStatusExplanation(status, quorumType, votesFor, votesAgainst)

  return (
    <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl text-text-primary mb-1">{title}</CardTitle>
            <CardDescription className="text-base text-text-secondary">{description}</CardDescription>
          </div>
          <div className={`text-xs font-semibold px-2 py-1 rounded ${quorumInfo.color} bg-background/20`}>
            {quorumInfo.label}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quorum Info */}
        <div className="bg-background/30 border border-border/50 rounded p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-text-muted mt-0.5 flex-shrink-0" />
            <div className="flex-1 text-sm space-y-1">
              <p className="text-text-secondary">
                <span className="font-semibold">Reikalaujimas:</span> {quorumInfo.requirement}
              </p>
              <p className="text-text-muted">{statusExplanation}</p>
              {(resultExplanationLt || resultExplanation) && (
                <p className="text-text-secondary border-t border-border/30 pt-2 mt-2">
                  <span className="font-semibold">Rezultatas:</span> {resultExplanationLt || resultExplanation}
                </p>
              )}
              {(participationSummaryLt || participationSummary) && (
                <p className="text-text-muted text-xs">
                  <span className="font-semibold">Dalyvavimas:</span> {participationSummaryLt || participationSummary}
                </p>
              )}
              {resultReasonCode && (
                <p className="text-xs text-text-muted/80">
                  <span className="font-mono text-primary/60">Kodas: {resultReasonCode}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Vote Results */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-success">Už: {votesFor}</span>
            <span className="text-error">Prieš: {votesAgainst}</span>
          </div>
          <Progress value={percentage} className="h-2.5 bg-border">
            <div
              className="h-full bg-success transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </Progress>
          <div className="flex justify-between text-xs text-text-muted">
            <p>{totalVotes} {totalVotes === 1 ? "balsas" : "balsai"} iš viso</p>
            {participationPercentage && (
              <p>Dalyvavimas: {Math.round(participationPercentage)}%</p>
            )}
          </div>
        </div>

        {/* Vote Buttons */}
        <div className="flex gap-3 pt-2">
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

