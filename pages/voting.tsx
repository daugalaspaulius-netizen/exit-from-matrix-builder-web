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
      title="Bendruomenės balsavimas"
      subtitle="Nulemkite platformos ateitį"
      titleClassName="text-text-primary"
      onLogout={handleLogout}
    >
        <ErrorAlert message={error} />

        {/* Create Proposal Form */}
        <Card className="border border-border bg-surface mb-8 hover:shadow-md-elevation transition-shadow">
          <CardHeader>
            <CardTitle className="text-text-primary">Kurti naują pasiūlymą</CardTitle>
            <CardDescription className="text-text-secondary">Pasiūlykite idėją bendruomenei</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateProposal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Pasiūlymo pavadinimas</Label>
                <Input
                  id="title"
                  placeholder="Įveskite pasiūlymo pavadinimą"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  required
                  className="bg-surface-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Aprašymas</Label>
                <Textarea
                  id="description"
                  placeholder="Detaliai aprašykite savo pasiūlymą"
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  required
                  rows={4}
                  className="bg-surface-secondary border-border"
                />
              </div>

              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white"
                disabled={createRequest.loading}
              >
                {createRequest.loading ? "Kuriama..." : "Kurti pasiūlymą"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Proposals List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Aktyvus balsavimas</h2>

          {listRequest.loading ? (
            <LoadingState message="Pasiūlymai įkeliami..." />
          ) : proposals.length === 0 ? (
            <EmptyStateCard message="Dar nėra pasiūlymų. Būkite pirmieji!" />
          ) : (
            proposals.map((proposal) => {
              const totalEligible = proposal.total_voters || 1
              const participation = ((proposal.votes_for + proposal.votes_against) / totalEligible) * 100
              return (
                <ProposalCard
                  key={proposal.id}
                  id={proposal.vote_id || proposal.id}
                  title={proposal.title}
                  description={proposal.description}
                  votesFor={proposal.votes_for}
                  votesAgainst={proposal.votes_against}
                  quorumRequired={proposal.quorum_required || 50}
                  quorumType={proposal.quorum_type}
                  participationPercentage={participation}
                  status={proposal.status}
                  onVote={handleVote}
                />
              )
            })
          )}
        </div>
    </PageShell>
  )
}
