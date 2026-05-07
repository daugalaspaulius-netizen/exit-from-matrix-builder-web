"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"

type PageShellProps = {
  title: string
  subtitle: string
  titleClassName?: string
  children: ReactNode
  onLogout: () => void
  showDashboardButton?: boolean
}

export function PageShell({
  title,
  subtitle,
  titleClassName = "text-primary glow-cyan",
  children,
  onLogout,
  showDashboardButton = true,
}: PageShellProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">
            <span className="text-primary glow-cyan">[EXIT]</span>
          </div>
          <div className="flex gap-4">
            {showDashboardButton && (
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            )}
            <Button variant="destructive" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <h1 className={`text-4xl font-bold mb-2 ${titleClassName}`}>{title}</h1>
        <p className="text-muted-foreground text-lg mb-8">{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

