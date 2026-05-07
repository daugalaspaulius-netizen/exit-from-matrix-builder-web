"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

type ReferralCardProps = {
  referralLink?: string
  copied: boolean
  onCopy: () => void
}

export function ReferralCard({ referralLink, copied, onCopy }: ReferralCardProps) {
  return (
    <Card className="border-primary/30 bg-card/50 backdrop-blur box-glow-cyan">
      <CardHeader>
        <CardTitle className="text-primary">Your Referral Link</CardTitle>
        <CardDescription>Share this link to invite others to the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={referralLink || "https://exitfrommatrix.com/ref/your-unique-code"}
            readOnly
            className="bg-background/50 border-border/50"
          />
          <Button onClick={onCopy} className="bg-primary hover:bg-primary/90 box-glow-cyan">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

