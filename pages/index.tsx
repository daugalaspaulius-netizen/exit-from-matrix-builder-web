import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Users, TrendingUp, Shield, MessageSquare, Settings, ArrowRight } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background matrix-grid">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-bold tracking-wide">
            <span className="text-primary glow-cyan">EXIT</span>
            <span className="text-muted-foreground">/MATRIX</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild className="neon-btn bg-primary/15 hover:bg-primary/25 text-primary">
              <Link href="/auth/register">Register</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="glass-panel rounded-2xl p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-primary/80 mb-4">Decentralized Civic Engine</p>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                <span className="gradient-text">EXIT</span>
                <br />
                <span className="text-foreground">FROM MATRIX</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                Vienas žmogus - vienas balsas. Kuriam platformą, kur forumas, balsavimas ir biudžetas veikia realiu laiku.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="neon-btn bg-primary/20 hover:bg-primary/30 text-primary px-7">
                  <Link href="/auth/register">
                    Enter Platform
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-secondary/40 text-secondary hover:bg-secondary/10 bg-transparent px-7">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-primary/30 bg-card/60 box-glow-cyan">
                <CardHeader>
                  <CardDescription>Status</CardDescription>
                  <CardTitle className="text-primary">SYSTEM ONLINE</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-secondary/30 bg-card/60 box-glow-purple">
                <CardHeader>
                  <CardDescription>Model</CardDescription>
                  <CardTitle className="text-secondary">1 USER = 1 VOTE</CardTitle>
                </CardHeader>
              </Card>
              <Card className="border-accent/30 bg-card/60 box-glow-pink">
                <CardHeader>
                  <CardDescription>Treasury</CardDescription>
                  <CardTitle className="text-accent">TRANSPARENT FLOW</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-12">
          <Card className="border-primary/30 bg-card/60 backdrop-blur box-glow-cyan hover:box-glow-cyan transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-primary">€10</CardTitle>
              <CardDescription className="text-foreground/80">Start Monthly Income</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/30 bg-card/50 backdrop-blur box-glow-purple hover:box-glow-purple transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-secondary">1:1</CardTitle>
              <CardDescription className="text-foreground/80">Voting Power</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/30 bg-card/50 backdrop-blur box-glow-pink hover:box-glow-pink transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-4xl font-bold text-accent">50%</CardTitle>
              <CardDescription className="text-foreground/80">Profit Share</CardDescription>
            </CardHeader>
          </Card>
        </div>

      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-8 md:py-14">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary glow-cyan">Platform Modules</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border-primary/30 bg-card/50 backdrop-blur hover:box-glow-cyan transition-all duration-300">
            <CardHeader>
              <Vote className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-primary">Democratic Voting</CardTitle>
              <CardDescription>
                Every member has equal voting power. Create and vote on proposals that shape the platform.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/30 bg-card/50 backdrop-blur hover:box-glow-purple transition-all duration-300">
            <CardHeader>
              <MessageSquare className="w-12 h-12 text-secondary mb-4" />
              <CardTitle className="text-secondary">Community Forum</CardTitle>
              <CardDescription>
                Engage with the community, share ideas, and participate in meaningful discussions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/30 bg-card/50 backdrop-blur hover:box-glow-pink transition-all duration-300">
            <CardHeader>
              <TrendingUp className="w-12 h-12 text-accent mb-4" />
              <CardTitle className="text-accent">Monthly Earnings</CardTitle>
              <CardDescription>
                Receive €10 monthly and share in 50% of platform profits as the community grows.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-primary/30 bg-card/50 backdrop-blur hover:box-glow-cyan transition-all duration-300">
            <CardHeader>
              <Users className="w-12 h-12 text-primary mb-4" />
              <CardTitle className="text-primary">Referral System</CardTitle>
              <CardDescription>
                Invite friends and grow the community. Every member strengthens the network.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-secondary/30 bg-card/50 backdrop-blur hover:box-glow-purple transition-all duration-300">
            <CardHeader>
              <Shield className="w-12 h-12 text-secondary mb-4" />
              <CardTitle className="text-secondary">Transparent Treasury</CardTitle>
              <CardDescription>
                All financial transactions are visible. Community-driven decisions on fund allocation.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-accent/30 bg-card/50 backdrop-blur hover:box-glow-pink transition-all duration-300">
            <CardHeader>
              <Settings className="w-12 h-12 text-accent mb-4" />
              <CardTitle className="text-accent">Level & Points</CardTitle>
              <CardDescription>
                Gain experience through participation. Level up to unlock enhanced features and rewards.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
      <footer className="border-t border-border/50 mt-16">
        <div className="container mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Exit From Matrix. Decentralized. Democratic. Transparent.</p>
        </div>
      </footer>
    </div>
  )
}
