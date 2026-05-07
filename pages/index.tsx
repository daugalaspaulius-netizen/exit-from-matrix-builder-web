
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Vote,
  Users,
  TrendingUp,
  Shield,
  MessageSquare,
  Zap,
  ArrowRight,
  BookOpen,
} from "lucide-react"

const modules = [
  {
    icon: Vote,
    title: "Democratic Voting",
    desc: "Every member has equal voting power. Create and vote on proposals that shape the platform.",
    color: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    card: "border-primary/20 hover:border-primary/40 hover:box-glow-cyan",
  },
  {
    icon: MessageSquare,
    title: "Community Forum",
    desc: "Engage with the community, share ideas, and participate in meaningful discussions.",
    color: "text-secondary",
    iconBg: "bg-secondary/10 border-secondary/20",
    card: "border-secondary/20 hover:border-secondary/40 hover:box-glow-purple",
  },
  {
    icon: TrendingUp,
    title: "Monthly Earnings",
    desc: "Receive EUR 10 monthly and share in 50% of platform profits as the community grows.",
    color: "text-accent",
    iconBg: "bg-accent/10 border-accent/20",
    card: "border-accent/20 hover:border-accent/40 hover:box-glow-pink",
  },
  {
    icon: Users,
    title: "Referral Network",
    desc: "Invite friends and grow the community. Every member strengthens the decentralized network.",
    color: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    card: "border-primary/20 hover:border-primary/40 hover:box-glow-cyan",
  },
  {
    icon: Shield,
    title: "Transparent Treasury",
    desc: "All financial flows are on-chain and visible. Community decides on fund allocation.",
    color: "text-secondary",
    iconBg: "bg-secondary/10 border-secondary/20",
    card: "border-secondary/20 hover:border-secondary/40 hover:box-glow-purple",
  },
  {
    icon: Zap,
    title: "Level & Points",
    desc: "Gain experience through participation. Level up to unlock enhanced features and rewards.",
    color: "text-accent",
    iconBg: "bg-accent/10 border-accent/20",
    card: "border-accent/20 hover:border-accent/40 hover:box-glow-pink",
  },
]

const stats = [
  {
    value: "EUR 10",
    label: "Monthly Income",
    sub: "Guaranteed per member",
    color: "text-primary",
    glow: "box-glow-cyan",
    border: "border-primary/30",
  },
  {
    value: "1:1",
    label: "Voting Power",
    sub: "Equal democratic rights",
    color: "text-secondary",
    glow: "box-glow-purple",
    border: "border-secondary/30",
  },
  {
    value: "50%",
    label: "Profit Share",
    sub: "Returned to community",
    color: "text-accent",
    glow: "box-glow-pink",
    border: "border-accent/30",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="animate-orb-1 absolute top-[8%] left-[4%] w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: "rgb(0 229 255 / 0.05)" }}
        />
        <div
          className="animate-orb-2 absolute top-[4%] right-[8%] w-96 h-96 rounded-full blur-3xl"
          style={{ background: "rgb(139 92 246 / 0.06)" }}
        />
        <div
          className="animate-orb-1 absolute bottom-[12%] right-[4%] w-80 h-80 rounded-full blur-3xl"
          style={{ background: "rgb(255 77 157 / 0.04)", animationDelay: "4s" }}
        />
        <div
          className="animate-orb-2 absolute bottom-[18%] left-[12%] w-72 h-72 rounded-full blur-3xl"
          style={{ background: "rgb(0 255 136 / 0.04)", animationDelay: "8s" }}
        />
        {/* Matrix grid overlay */}
        <div className="absolute inset-0 matrix-grid" />
      </div>

      {/* Nav */}
      <nav className="relative z-50 border-b border-border/40 bg-background/75 backdrop-blur-lg sticky top-0">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold tracking-wide">
            <span className="text-primary glow-cyan">EXIT</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">MATRIX</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="neon-btn bg-primary/12 hover:bg-primary/22 text-primary font-semibold px-5"
            >
              <Link href="/auth/register">
                Register
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative container mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="glass-panel rounded-2xl p-8 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            {/* Left — headline */}
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary/70 mb-6 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                Decentralized Civic Engine &middot; v1.0
              </div>

              <h1 className="text-5xl md:text-7xl font-extrabold leading-[0.93] mb-6 tracking-tight">
                <span className="gradient-text">EXIT</span>
                <br />
                <span className="text-foreground">FROM</span>
                <br />
                <span className="text-foreground/75">MATRIX</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground max-w-lg mb-2">
                One person &mdash; one vote. A platform where forum, governance, and treasury
                operate transparently in real time.
              </p>
              <p className="text-sm text-muted-foreground/65 max-w-lg mb-10">
                No central authority. No opaque algorithms. Only democratic consensus and
                on-chain transparency.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="neon-btn bg-primary/14 hover:bg-primary/24 text-primary font-semibold px-8 h-12 text-base"
                >
                  <Link href="/auth/register">
                    Enter Platform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="neon-btn-purple border-secondary/40 text-secondary hover:bg-secondary/10 bg-transparent px-8 h-12 text-base font-semibold"
                >
                  <Link href="/auth/login">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Vision
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right — status cards */}
            <div className="space-y-3">
              {[
                {
                  label: "Status",
                  value: "SYSTEM ONLINE",
                  color: "text-primary",
                  card: "border-primary/30 box-glow-cyan",
                },
                {
                  label: "Model",
                  value: "1 USER = 1 VOTE",
                  color: "text-secondary",
                  card: "border-secondary/30 box-glow-purple",
                },
                {
                  label: "Treasury",
                  value: "TRANSPARENT FLOW",
                  color: "text-accent",
                  card: "border-accent/30 box-glow-pink",
                },
              ].map(({ label, value, color, card }) => (
                <Card key={label} className={"bg-card/60 relative overflow-hidden " + card}>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-25" />
                  <CardHeader className="py-4">
                    <CardDescription className="text-xs uppercase tracking-widest">{label}</CardDescription>
                    <CardTitle className={"text-base font-mono " + color}>{value}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-6 pb-16">
        <div className="neon-divider mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map(({ value, label, sub, color, glow, border }) => (
            <Card
              key={label}
              className={"bg-card/60 backdrop-blur text-center hover:scale-[1.02] transition-transform duration-300 " + border + " " + glow}
            >
              <CardHeader>
                <CardTitle className={"text-4xl font-extrabold " + color}>{value}</CardTitle>
                <CardDescription className="text-foreground/75 font-medium text-sm">{label}</CardDescription>
                <CardDescription className="text-xs">{sub}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform modules */}
      <section className="container mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary glow-cyan mb-3">
            Platform Modules
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Six integrated systems powering transparent democratic governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {modules.map(({ icon: Icon, title, desc, color, iconBg, card }) => (
            <Card
              key={title}
              className={"bg-card/50 backdrop-blur transition-all duration-300 " + card}
            >
              <CardHeader>
                <div className={"w-10 h-10 rounded-lg border flex items-center justify-center mb-4 " + iconBg}>
                  <Icon className={"w-5 h-5 " + color} />
                </div>
                <CardTitle className={"text-base " + color}>{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="glass-panel rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />
          <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4">
            Ready to Exit the Matrix?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
            Join members building a decentralized democratic future together.
          </p>
          <Button
            asChild
            size="lg"
            className="neon-btn bg-primary/14 hover:bg-primary/24 text-primary font-semibold px-10 h-12"
          >
            <Link href="/auth/register">
              Create Free Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30">
        <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <p className="font-mono">
            <span className="text-primary">[EXIT/MATRIX]</span> &mdash; Decentralized. Democratic. Transparent.
          </p>
          <p>&copy; 2025 Exit From Matrix.</p>
        </div>
      </footer>
    </div>
  )
}
