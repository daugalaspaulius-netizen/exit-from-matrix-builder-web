
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

export function StatCard({ title, value, subtitle, icon, cardClassName, valueClassName }: StatCardProps) {
  return (
    <Card className={"relative overflow-hidden " + cardClassName}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {title}
          </CardTitle>
          <div className="p-1.5 rounded-md bg-current/10">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={"text-3xl font-bold tracking-tight " + valueClassName}>{value}</div>
        <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>
      </CardContent>
    </Card>
  )
}
