import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Vote, Users, TrendingUp, Shield, MessageSquare, Settings, ArrowRight, CheckCircle2 } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border sticky top-0 z-50 bg-background">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl md:text-2xl font-semibold tracking-wide">
            <span className="text-primary">EXIT</span>
            <span className="text-text-secondary ml-1">/MATRIX</span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" asChild className="hover:bg-surface">
              <Link href="/auth/login">Prisijungti</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white">
              <Link href="/auth/register">Kurti paskyra</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.15em] text-text-secondary mb-4 font-medium">Decentralized Governance Platform</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-text-primary">
              Exit From<br />The Matrix
            </h1>
            <p className="text-lg text-text-secondary max-w-xl mb-8 leading-relaxed">
              Lygybė be hierarchijos. Vienas žmogus – vienas balsas. Sukuriame platformą, kur kiekvieno balso vertė yra lygi, finansai skaidrūs, ir jūs valdote savo ateitį.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
                <Link href="/auth/register">
                  Pradėti dabar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border text-text-primary hover:bg-surface">
                <Link href="/auth/login">Jau turite paskyrą?</Link>
              </Button>
            </div>
          </div>

          {/* Key Principles */}
          <div className="space-y-4">
            <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <CardTitle className="text-primary">1 žmogus = 1 balsas</CardTitle>
                    <CardDescription className="text-text-secondary mt-1">Nėra tokio dalyko kaip turto balso</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <CardTitle className="text-primary">Skaidrūs finansai</CardTitle>
                    <CardDescription className="text-text-secondary mt-1">Kiekvienos operacijos ir uždarbiis viešai prieinamas</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
            <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <CardTitle className="text-primary">€10 – kiekvienas mėnuo</CardTitle>
                    <CardDescription className="text-text-secondary mt-1">Garantuotas universalus bazinis pajamų dydis</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
          <div className="border border-border bg-surface p-8 rounded-lg text-center hover:shadow-md-elevation transition-shadow">
            <div className="text-5xl font-bold text-primary mb-2">€10</div>
            <p className="text-text-secondary">Mėnesio garantuota suma</p>
          </div>

          <div className="border border-border bg-surface p-8 rounded-lg text-center hover:shadow-md-elevation transition-shadow">
            <div className="text-5xl font-bold text-primary mb-2">1:1</div>
            <p className="text-text-secondary">Balsavimo galia</p>
          </div>

          <div className="border border-border bg-surface p-8 rounded-lg text-center hover:shadow-md-elevation transition-shadow">
            <div className="text-5xl font-bold text-primary mb-2">50%</div>
            <p className="text-text-secondary">Pelno dalis nariams</p>
          </div>
        </div>

      </section>


      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">Platformos moduliai</h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">Viskas kuris jums reikalinga bendram valdymui ir skaidrioms operacijoms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <Vote className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Demokratinis balsavimas</CardTitle>
              <CardDescription className="text-text-secondary">
                Kiekvienas narys turi vienodą balsavimo galią. Kurkite ir klauskite pasiūlymų.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <MessageSquare className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Bendruomenės forumas</CardTitle>
              <CardDescription className="text-text-secondary">
                Dialogas, idėjos ir bendras sprendimų priėmimas. Jūsų balsas svarbus.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Mėnesio pajamos</CardTitle>
              <CardDescription className="text-text-secondary">
                €10 garantuota suma ir 50% pelno pasidalijimas augant bendruomenei.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <Users className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Rekomenduojamų sistema</CardTitle>
              <CardDescription className="text-text-secondary">
                Kvieskite draugus. Kiekvienas narys stiprina tinklą ir visų vertę.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <Shield className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Skaidrūs finansai</CardTitle>
              <CardDescription className="text-text-secondary">
                Visos operacijos viešos. Bendruomenė nusprendžia, kaip naudoti iždo lėšas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border border-border bg-surface hover:shadow-md-elevation transition-shadow">
            <CardHeader>
              <Settings className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-text-primary">Patyrimo sistema</CardTitle>
              <CardDescription className="text-text-secondary">
                Dalyvavimu keliaukite lygius. Atraškite naujus modulius ir atlygius.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            Pasiruošti teisingumui?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Prisijunkite prie tūkstančių narių, kurie jau kurie metu bendram valdymą ir realią lygybę.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
            <Link href="/auth/register">
              Pradėti - Nemokamai
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Apie</h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                Exit From Matrix yra decentralizuota duomenų platforma, skirta tiems, kurie nori dalyvoti tikroje demokratijoje.
              </p>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Dokumentacija</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:text-primary/80">Darbuotojo vadovas</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">Valdymo taisyklės</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">API dokumentacija</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-text-primary font-semibold mb-4">Bendruomenė</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-primary hover:text-primary/80">Discord</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">GitHub</a></li>
                <li><a href="#" className="text-primary hover:text-primary/80">Telegram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-text-secondary text-sm">
            <p>&copy; 2025 Exit From Matrix. Decentralizuota. Demokratiška. Skaidri.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
