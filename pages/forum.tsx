
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
      title="Community Forum"
      subtitle="Connect, discuss, and shape the direction of the platform"
      titleClassName="text-secondary glow-purple"
      onLogout={handleLogout}
    >
      <ErrorAlert message={error} />

      {/* Create Post Form */}
      <Card className="border-secondary/30 bg-card/60 backdrop-blur box-glow-purple mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
        <CardHeader className="pb-3">
          <CardTitle className="text-secondary text-base">Create New Post</CardTitle>
          <CardDescription className="text-xs">Share your thoughts with the community</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vote-id" className="text-xs uppercase tracking-widest text-muted-foreground">
                Vote ID (optional)
              </Label>
              <Input
                id="vote-id"
                placeholder="Link to a proposal by its vote_id"
                value={newPost.voteId}
                onChange={(e) => setNewPost({ ...newPost, voteId: e.target.value })}
                className="bg-background/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content" className="text-xs uppercase tracking-widest text-muted-foreground">
                Content
              </Label>
              <Textarea
                id="post-content"
                placeholder="Write your post — be constructive and respectful"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
                rows={4}
                className="bg-background/50 border-border/50 focus:border-secondary/50 focus:ring-secondary/20 resize-none"
              />
            </div>

            <Button
              type="submit"
              className="neon-btn-purple bg-secondary/14 hover:bg-secondary/22 text-secondary font-semibold px-6 border-secondary/40"
              disabled={createRequest.loading}
            >
              {createRequest.loading ? "Publishing..." : "Publish Post"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Posts list */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Posts</h2>
          {posts.length > 0 && (
            <span className="text-xs text-muted-foreground px-2 py-1 rounded-full border border-border/40 bg-muted/20">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </span>
          )}
        </div>

        {listRequest.loading ? (
          <LoadingState message="Loading posts..." />
        ) : posts.length === 0 ? (
          <EmptyStateCard message="No posts yet. Be the first to start a discussion!" />
        ) : (
          posts.map((post) => (
            <ForumPostCard
              key={post.id ?? post.post_id}
              title={post.title || ("Discussion for " + post.vote_id)}
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
