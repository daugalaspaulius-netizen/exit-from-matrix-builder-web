"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, Users, Award } from "lucide-react"

type ReferralCardProps = {
  referralLink?: string
  invitedCount?: number
  referralPointsEarned?: number
  copied: boolean
  onCopy: () => void
}

export function ReferralCard({ referralLink, invitedCount = 0, referralPointsEarned = 0, copied, onCopy }: ReferralCardProps) {
  return (
    <Card className="border-primary/30 bg-surface hover:shadow-md-elevation transition-shadow">
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-primary">Referral Program</CardTitle>
          <CardDescription>Kvieskite draugus ir užsidirbkite taškus</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/30 border border-border/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xs text-text-muted">Kvietiniai</span>
            </div>
            <p className="text-2xl font-bold text-primary">{invitedCount}</p>
          </div>
          <div className="bg-background/30 border border-border/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-secondary" />
              <span className="text-xs text-text-muted">Taškai</span>
            </div>
            <p className="text-2xl font-bold text-secondary">{referralPointsEarned}</p>
          </div>
        </div>

        {/* Link Copy */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary">Jūsų referral nuoroda:</label>
          <div className="flex gap-2">
            <Input
              value={referralLink || "https://exitfrommatrix.com/ref/your-unique-code"}
              readOnly
              className="bg-surface-secondary border-border/50 text-sm"
            />
            <Button onClick={onCopy} className="bg-primary hover:bg-primary/90 flex-shrink-0">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-xs text-text-muted">
            Dalinkitės šia nuoroda ir gaukite bonus taškus kai draugai prisijungia.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

