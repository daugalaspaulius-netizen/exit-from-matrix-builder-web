"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <Link href={href}>
      <Card className={cardClassName}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={iconWrapperClassName}>{icon}</div>
            <div>
              <CardTitle className={titleClassName}>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}

