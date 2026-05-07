
"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

type ActionCardProps = {
  href: string
  icon: ReactNode
  title: string
  description: string
  iconWrapperClassName: string
  titleClassName: string
  cardClassName: string
}

export function ActionCard({
  href,
  icon,
  title,
  description,
  iconWrapperClassName,
  titleClassName,
  cardClassName,
}: ActionCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className={cardClassName + " group-hover:-translate-y-0.5 transition-all duration-200"}>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={iconWrapperClassName}>{icon}</div>
              <div>
                <CardTitle className={"text-sm font-semibold " + titleClassName}>{title}</CardTitle>
                <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-current group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0 mt-0.5" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
