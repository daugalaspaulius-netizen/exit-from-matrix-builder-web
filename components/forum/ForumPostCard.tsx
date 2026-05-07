"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare } from "lucide-react"

type ForumPostCardProps = {
  title: string
  content: string
  authorId: string
  createdAt: string
  formatDate: (value: string) => string
}

export function ForumPostCard({
  title,
  content,
  authorId,
  createdAt,
  formatDate,
}: ForumPostCardProps) {
  return (
    <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl text-text-primary flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-primary mt-1" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-base text-text-secondary ml-8">{content}</CardDescription>
      </CardHeader>
      <CardContent className="ml-8">
        <div className="flex items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1">
            Autorius: <span className="text-primary font-medium">Naudotojas #{authorId || "nežinomas"}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

