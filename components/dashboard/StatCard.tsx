"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StatCardProps = {
  title: string
  value: string
  subtitle: string
  icon: ReactNode
  cardClassName: string
  valueClassName: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  cardClassName,
  valueClassName,
}: StatCardProps) {
  return (
    <Card className={cardClassName}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${valueClassName}`}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

