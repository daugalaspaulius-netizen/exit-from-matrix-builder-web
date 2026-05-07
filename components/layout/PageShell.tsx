
"use client"

import type { ReactNode } from "react"
import { useRouter } from "next/router"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, MessageSquare, Vote, Activity, LogOut } from "lucide-react"

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
  const path = router.pathname

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/forum",     label: "Forum",     icon: MessageSquare },
    { href: "/voting",    label: "Voting",    icon: Vote },
    { href: "/system-monitor", label: "Monitor", icon: Activity },
  ]

  return (
    <div className="min-h-screen bg-background matrix-grid">
      <nav className="border-b border-border/50 bg-background/85 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="text-xl font-bold flex-shrink-0 tracking-wide">
            <span className="text-primary glow-cyan">[EXIT</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">MATRIX]</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = path === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all duration-200 " +
                    (isActive
                      ? "bg-primary/10 text-primary border border-primary/30 box-glow-cyan"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40")
                  }
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              )
            })}
          </div>

          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all duration-200 gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={"text-3xl md:text-4xl font-bold mb-1.5 " + titleClassName}>{title}</h1>
          <p className="text-muted-foreground text-sm">{subtitle}</p>
          <div className="neon-divider mt-4" />
        </div>
        {children}
      </div>
    </div>
  )
}
