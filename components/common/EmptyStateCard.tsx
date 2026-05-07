"use client"

import { Card, CardContent } from "@/components/ui/card"

type EmptyStateCardProps = {
  message: string
}

export function EmptyStateCard({ message }: EmptyStateCardProps) {
  return (
    <Card className="border-border/30 bg-card/50 backdrop-blur">
      <CardContent className="py-12 text-center text-muted-foreground">{message}</CardContent>
    </Card>
  )
}

