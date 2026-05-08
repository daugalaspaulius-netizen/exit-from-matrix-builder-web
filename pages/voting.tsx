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
      subtitle="Shape the future of the platform"
      titleClassName="text-primary glow-cyan"
      onLogout={handleLogout}
    >
        <ErrorAlert message={error} />

        {/* Create Proposal Form */}
        <Card className="border-primary/30 bg-card/50 backdrop-blur box-glow-cyan mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Create New Proposal</CardTitle>
            <CardDescription>Submit your idea for community consideration</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proposal Title</Label>
                <Input
                  id="title"
                  placeholder="Enter proposal title"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  required
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your proposal in detail"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  required
                  rows={4}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 box-glow-cyan"
                disabled={createRequest.loading}
              >
                {createRequest.loading ? "Creating..." : "Create Proposal"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Active Proposals</h2>

          {listRequest.loading ? (
            <LoadingState message="Loading proposals..." />
          ) : proposals.length === 0 ? (
            <EmptyStateCard message="No proposals yet. Be the first to create one!" />
          ) : (
            proposals.map((proposal: Proposal) => (
              <ProposalCard
                key={proposal.id}
                id={proposal.vote_id || proposal.id}
                title={proposal.title}
                description={proposal.description}
                votesFor={proposal.votes_for}
                votesAgainst={proposal.votes_against}
                status={proposal.status}
                resultReasonCode={proposal.result_reason_code}
                resultExplanation={proposal.result_explanation}
                onVote={handleVote}
              />
            ))
          )}
        </div>
    </PageShell>
  )
}
