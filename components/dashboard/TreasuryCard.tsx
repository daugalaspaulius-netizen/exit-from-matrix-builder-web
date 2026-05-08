"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

type TreasuryCardProps = {
  total?: number
  currency?: string
}

export function TreasuryCard({ total = 0, currency = "€" }: TreasuryCardProps) {
  return (
    <Card className="border-secondary/30 bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-secondary">Bendruomenės Iždas</CardTitle>
            <CardDescription>Sukaupti fondai iš abonementų</CardDescription>
          </div>
          <TrendingUp className="w-5 h-5 text-secondary opacity-50" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-background/30 border border-border/50 rounded p-4">
          <p className="text-xs text-text-muted mb-2">Bendras balansas</p>
          <p className="text-4xl font-bold text-secondary">
            {total.toFixed(2)}
            <span className="text-xl ml-2">{currency}</span>
          </p>
        </div>
        <div className="text-xs text-text-muted space-y-1">
          <p>• Sukauptas iš abonementų ir projektų</p>
          <p>• Skirstyti per bendruomenės balsavimus</p>
          <p>• Decentralizuotas valdymas</p>
        </div>
      </CardContent>
    </Card>
  )
}
