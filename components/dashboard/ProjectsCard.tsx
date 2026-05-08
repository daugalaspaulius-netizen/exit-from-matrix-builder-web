"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, CheckCircle2, Clock } from "lucide-react"

type ProjectsCardProps = {
  total?: number
  active?: number
  completed?: number
}

export function ProjectsCard({ total = 0, active = 0, completed = 0 }: ProjectsCardProps) {
  return (
    <Card className="border-accent/30 bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-accent">Projektai</CardTitle>
            <CardDescription>Bendruomenės iniciatyvos</CardDescription>
          </div>
          <Briefcase className="w-5 h-5 text-accent opacity-50" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background/30 border border-border/50 rounded p-3 text-center">
            <p className="text-xs text-text-muted mb-1">Iš Viso</p>
            <p className="text-2xl font-bold text-text-primary">{total}</p>
          </div>
          <div className="bg-background/30 border border-border/50 rounded p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-warning" />
              <p className="text-xs text-text-muted">Aktyvūs</p>
            </div>
            <p className="text-2xl font-bold text-warning">{active}</p>
          </div>
          <div className="bg-background/30 border border-border/50 rounded p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle2 className="w-3 h-3 text-success" />
              <p className="text-xs text-text-muted">Baigti</p>
            </div>
            <p className="text-2xl font-bold text-success">{completed}</p>
          </div>
        </div>
        <div className="text-xs text-text-muted space-y-1">
          <p>• Projektai kuriami per bendruomenės balsavimus</p>
          <p>• Finansavimas iš bendruomenės iždo</p>
          <p>• Viešas progreso sekimas</p>
        </div>
      </CardContent>
    </Card>
  )
}
