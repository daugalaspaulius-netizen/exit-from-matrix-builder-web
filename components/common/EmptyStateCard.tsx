
"use client"

import { Card, CardContent } from "@/components/ui/card"

type EmptyStateCardProps = {
  message: string
}

export function EmptyStateCard({ message }: EmptyStateCardProps) {
  return (
    <Card className="border-border/20 bg-card/30 backdrop-blur">
      <CardContent className="py-16 text-center">
        <div className="w-12 h-12 rounded-full border border-border/40 bg-muted/20 flex items-center justify-center mx-auto mb-4">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
        </div>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">{message}</p>
      </CardContent>
    </Card>
  )
}
