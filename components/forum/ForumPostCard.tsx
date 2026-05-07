
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, User } from "lucide-react"

type ForumPostCardProps = {
  title: string
  content: string
  authorId: string
  createdAt: string
  formatDate: (value: string) => string
}

export function ForumPostCard({ title, content, authorId, createdAt, formatDate }: ForumPostCardProps) {
  return (
    <Card className="border-border/30 bg-card/60 backdrop-blur hover:border-secondary/35 hover:box-glow-purple transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/45 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-foreground leading-snug flex items-start gap-3">
          <div className="mt-0.5 p-1.5 rounded-md bg-secondary/10 border border-secondary/20 flex-shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-secondary" />
          </div>
          <span>{title}</span>
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed ml-9 line-clamp-4">{content}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 ml-9">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-t border-border/30 pt-3">
          <span className="flex items-center gap-1.5">
            <User className="w-3 h-3" />
            <span className="text-secondary font-medium">#{(authorId || "unknown").slice(0, 8)}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
