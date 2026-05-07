
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createProposal, listProposals, voteProposal } from "@/lib/services"
import { clearSession } from "@/lib/session"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useApiRequest } from "@/hooks/useApiRequest"
import { PageShell } from "@/components/layout/PageShell"
import { ErrorAlert } from "@/components/common/ErrorAlert"
import { EmptyStateCard } from "@/components/common/EmptyStateCard"
import { LoadingState } from "@/components/common/LoadingState"
import { ProposalCard } from "@/components/voting/ProposalCard"
import type { Proposal } from "@/types/api"

export default function VotingPage() {
  const router = useRouter()
  const { userId, isCheckingAuth } = useRequireAuth()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [newProposal, setNewProposal] = useState({ title: "", description: "" })
  const listRequest = useApiRequest()
  const createRequest = useApiRequest()
  const voteRequest = useApiRequest()
  const error = listRequest.error || createRequest.error || voteRequest.error

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }
    void fetchProposals()
  }, [isCheckingAuth, userId])

  const fetchProposals = async () => {
    const response = await listRequest.execute(() => listProposals())
    if (response) {
      setProposals(response.data)
    }
  }

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    const created = await createRequest.execute(() =>
      createProposal(userId, newProposal.title, newProposal.description),
    )
    if (created) {
      setNewProposal({ title: "", description: "" })
      await fetchProposals()
    }
  }

  const handleVote = async (proposalId: string, voteFor: boolean) => {
    if (!userId) return

    const voted = await voteRequest.execute(() =>
      voteProposal(proposalId, userId, voteFor),
    )
    if (voted) {
      await fetchProposals()
    }
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  return (
    <PageShell
      title="Community Voting"
      subtitle="Shape the future of the platform — one person, one vote"
      titleClassName="text-primary glow-cyan"
      onLogout={handleLogout}
    >
      <ErrorAlert message={error} />

      {/* Create Proposal Form */}
      <Card className="border-primary/30 bg-card/60 backdrop-blur box-glow-cyan mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <CardHeader className="pb-3">
          <CardTitle className="text-primary text-base">Create New Proposal</CardTitle>
          <CardDescription className="text-xs">Submit your idea for community consideration</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProposal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-widest text-muted-foreground">
                Proposal Title
              </Label>
              <Input
                id="title"
                placeholder="Enter a clear, concise proposal title"
                value={newProposal.title}
                onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                required
                className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs uppercase tracking-widest text-muted-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your proposal in detail — what, why, and expected impact"
                value={newProposal.description}
                onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                required
                rows={4}
                className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="neon-btn bg-primary/14 hover:bg-primary/24 text-primary font-semibold px-6"
              disabled={createRequest.loading}
            >
              {createRequest.loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Proposals list */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Active Proposals</h2>
          {proposals.length > 0 && (
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-full border border-border/40 bg-muted/20">
              {proposals.length} {proposals.length === 1 ? "proposal" : "proposals"}
            </span>
          )}
        </div>

        {listRequest.loading ? (
          <LoadingState message="Loading proposals..." />
        ) : proposals.length === 0 ? (
          <EmptyStateCard message="No proposals yet. Be the first to submit one!" />
        ) : (
          proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              id={proposal.vote_id || proposal.id}
              title={proposal.title}
              description={proposal.description}
              status={proposal.status}
              votesFor={proposal.votes_for}
              votesAgainst={proposal.votes_against}
              quorumRequired={proposal.quorum_required}
              quorumPercentage={proposal.quorum_percentage}
              votingDeadline={proposal.voting_deadline}
              totalVoters={proposal.total_voters}
              onVote={handleVote}
            />
          ))
        )}
      </div>
    </PageShell>
  )
}
