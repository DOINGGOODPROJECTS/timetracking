import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, BarChart } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex flex-wrap h-auto sm:h-16 items-center justify-between py-4 gap-y-4 sm:gap-y-0">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold w-full sm:w-auto justify-center sm:justify-start">
            <Image src="/logo.png" alt="Direct Impact Partners" width={32} height={32} />
            <span>Direct Impact Partners</span>
          </div>
          {/* Nav */}
          <nav className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-end">
            <Link href="/login">
              <Button variant="outline">Connexion</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Section Hero */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Gestion des Pointages des Employés
            </h1>
            <p className="max-w-[750px] text-base sm:text-lg text-muted-foreground sm:text-xl">
              Suivez facilement les heures d'arrivée et de départ de vos employés avec notre système de pointage simple
              et efficace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg">Commencer</Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  Tableau de bord
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Section Features */}
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pointage Facile</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rapide et Simple</div>
                <p className="text-xs text-muted-foreground">
                  Enregistrez vos heures d'arrivée et de départ en un clic.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gestion des Employés</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Centralisé</div>
                <p className="text-xs text-muted-foreground">Gérez tous vos employés depuis une interface unique.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rapports Détaillés</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Analytique</div>
                <p className="text-xs text-muted-foreground">
                  Visualisez les tendances et exportez des rapports détaillés.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:h-24 md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            &copy; {new Date().getFullYear()} Direct Impact Partners. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
