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
  const [newProposal, setNewProposal] = useState({
    title: "",
    description: "",
    quorum_type: "simple" as "simple" | "important" | "critical",
  })
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
      createProposal(userId, newProposal.title, newProposal.description, newProposal.quorum_type),
    )
    if (created) {
      setNewProposal({ title: "", description: "", quorum_type: "simple" })
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

              <div className="space-y-2">
                <Label htmlFor="quorum_type">Kvorumo tipas</Label>
                <select
                  id="quorum_type"
                  value={newProposal.quorum_type}
                  onChange={(e) =>
                    setNewProposal({
                      ...newProposal,
                      quorum_type: e.target.value as "simple" | "important" | "critical",
                    })
                  }
                  className="w-full px-3 py-2 rounded border border-border bg-surface-secondary text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="simple">Paprastas (50% + 1 balsas)</option>
                  <option value="important">Svarbus (60% balsų)</option>
                  <option value="critical">Kritiškas (70% balsų)</option>
                </select>
                <p className="text-xs text-text-muted">Pasirinkite, kokia dalis balsų reikalinga pasiūlymui priimti</p>
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
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">Aktyvus balsavimas</h2>
            
            {/* Status Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-background/40 border border-border/50 rounded p-3 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">Vyksta balsavimas</p>
                  <p className="text-text-muted text-xs">Statusas: open. Jūs galite balsuoti.</p>
                </div>
              </div>
              
              <div className="bg-background/40 border border-border/50 rounded p-3 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">Rezultatas fiksuotas</p>
                  <p className="text-text-muted text-xs">Statusas: frozen. Kvorum pasiektas.</p>
                </div>
              </div>
              
              <div className="bg-background/40 border border-border/50 rounded p-3 flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-text-primary">Balsavimas baigtas</p>
                  <p className="text-text-muted text-xs">Statusas: closed. Nėra kvorūmo.</p>
                </div>
              </div>
            </div>
          </div>

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
                  resultReasonCode={proposal.result_reason_code}
                  resultExplanation={proposal.result_explanation}
                  resultExplanationLt={proposal.result_explanation_lt}
                  participationSummary={proposal.participation_summary}
                  participationSummaryLt={proposal.participation_summary_lt}
                  onVote={handleVote}
                />
              )
            })
          )}
        </div>
    </PageShell>
  )
}
