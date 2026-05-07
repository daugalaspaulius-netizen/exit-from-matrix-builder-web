
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, Users } from "lucide-react"

type ReferralCardProps = {
  referralLink?: string
  copied: boolean
  onCopy: () => void
}

export function ReferralCard({ referralLink, copied, onCopy }: ReferralCardProps) {
  return (
    <Card className="border-primary/30 bg-card/60 backdrop-blur box-glow-cyan relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-primary text-base">Your Referral Link</CardTitle>
            <CardDescription className="text-xs">Invite others — every member strengthens the network</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={referralLink || "https://exitfrommatrix.com/ref/your-unique-code"}
            readOnly
            className="bg-background/50 border-primary/20 font-mono text-xs text-primary/70 focus:border-primary/50"
          />
          <Button
            onClick={onCopy}
            className={
              "px-4 flex-shrink-0 transition-all duration-200 " +
              (copied
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/40"
                : "bg-primary/15 text-primary border border-primary/40 hover:bg-primary/25 hover:border-primary/70")
            }
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        {copied && (
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            <Check className="w-3 h-3" /> Copied to clipboard
          </p>
        )}
      </CardContent>
    </Card>
  )
}
