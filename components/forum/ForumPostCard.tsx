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
    <Card className="border-border/30 bg-card/50 backdrop-blur hover:border-secondary/30 hover:box-glow-purple transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-foreground flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-secondary mt-1" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-base ml-8">{content}</CardDescription>
      </CardHeader>
      <CardContent className="ml-8">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            By <span className="text-secondary font-medium">User #{authorId || "unknown"}</span>
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

