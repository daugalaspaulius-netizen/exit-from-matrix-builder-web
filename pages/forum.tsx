"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createForumPost, listForumPosts } from "@/lib/services"
import { clearSession } from "@/lib/session"
import { useRequireAuth } from "@/hooks/useRequireAuth"
import { useApiRequest } from "@/hooks/useApiRequest"
import { PageShell } from "@/components/layout/PageShell"
import { ErrorAlert } from "@/components/common/ErrorAlert"
import { EmptyStateCard } from "@/components/common/EmptyStateCard"
import { LoadingState } from "@/components/common/LoadingState"
import { ForumPostCard } from "@/components/forum/ForumPostCard"
import type { ForumPost } from "@/types/api"

export default function ForumPage() {
  const router = useRouter()
  const { userId, isCheckingAuth } = useRequireAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [newPost, setNewPost] = useState({ voteId: "", content: "" })
  const listRequest = useApiRequest()
  const createRequest = useApiRequest()
  const error = listRequest.error || createRequest.error

  useEffect(() => {
    if (isCheckingAuth || !userId) {
      return
    }
    void fetchPosts()
  }, [isCheckingAuth, userId])

  const fetchPosts = async () => {
    const response = await listRequest.execute(() => listForumPosts())
    if (response) {
      setPosts(response.data || [])
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return

    const created = await createRequest.execute(() =>
      createForumPost(newPost.voteId.trim() || null, userId, newPost.content),
    )
    if (created) {
      setNewPost({ voteId: "", content: "" })
      await fetchPosts()
    }
  }

  const handleLogout = () => {
    clearSession()
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <PageShell
      title="Bendruomenės forumas"
      subtitle="Bendravimas su bendruomene"
      titleClassName="text-text-primary"
      onLogout={handleLogout}
    >
        <ErrorAlert message={error} />

        {/* Create Post Form */}
        <Card className="border border-border bg-surface mb-8 hover:shadow-md-elevation transition-shadow">
          <CardHeader>
            <CardTitle className="text-text-primary">Kurti naują žinutę</CardTitle>
            <CardDescription className="text-text-secondary">Pasidalinkite savo nuomone su bendruomene</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vote-id">Balsavimo ID</Label>
                <Input
                  id="vote-id"
                  placeholder="Neprivaloma: Pasiūlymo vote_id"
                  value={newPost.voteId}
                  onChange={(e) => setNewPost({ ...newPost, voteId: e.target.value })}
                  className="bg-surface-secondary border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-content">Turinys</Label>
                <Textarea
                  id="post-content"
                  placeholder="Rašykite savo žinutę"
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
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
                {createRequest.loading ? "Kuriama..." : "Kurti žinutę"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Posts List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-text-primary">Naujausia diskusija</h2>

          {listRequest.loading ? (
            <LoadingState message="Žinutės įkeliamos..." />
          ) : posts.length === 0 ? (
            <EmptyStateCard message="Dar nėra žinutių. Būkite pirmieji!" />
          ) : (
            posts.map((post) => (
              <ForumPostCard
                key={post.id ?? post.post_id}
                title={post.title || `Diskusija dėl ${post.vote_id}`}
                content={post.content}
                authorId={post.author_id}
                createdAt={post.created_at}
                formatDate={formatDate}
              />
            ))
          )}
        </div>
    </PageShell>
  )
}
