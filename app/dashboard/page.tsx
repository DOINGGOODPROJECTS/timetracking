import { redirect } from "next/navigation"
import { getCurrentUser, getUserTimesheet } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckInOutCard } from "@/components/check-in-out-card"
import { RecentActivitiesTable } from "@/components/recent-activities-table"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  // Récupérer les pointages de l'utilisateur
  const timesheet = await getUserTimesheet(user.id)

  // Calculer les heures de la semaine
  const weeklyHours = calculateWeeklyHours(timesheet)

  // Calculer la ponctualité
  const punctuality = calculatePunctuality(timesheet)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1">
        <DashboardNav className="hidden w-64 border-r md:block" />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                <TabsTrigger value="history">Historique</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Statut actuel</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{user.isCheckedIn ? "Présent" : "Absent"}</div>
                      <p className="text-xs text-muted-foreground">
                        Dernière activité: {user!.lastActivity!.toLocaleString() || "Aucune"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Heures cette semaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{weeklyHours}</div>
                      <p className="text-xs text-muted-foreground">+2.5% par rapport à la semaine dernière</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Ponctualité</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{punctuality}%</div>
                      <p className="text-xs text-muted-foreground">Arrivées à l'heure ce mois-ci</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <CheckInOutCard />

                  <Card className="col-span-1">
                    <CardHeader>
                      <CardTitle>Activités récentes</CardTitle>
                      <CardDescription>Vos 5 derniers pointages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {timesheet.length > 0 ? (
                        <RecentActivitiesTable activities={convertTimesheetToActivities(timesheet)} />
                      ) : (
                        <p className="text-center py-8 text-muted-foreground">
                          Vous n'avez pas encore effectué de pointage
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Historique des pointages</CardTitle>
                    <CardDescription>Consultez l'historique complet de vos pointages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timesheet.length > 0 ? (
                      <RecentActivitiesTable activities={convertTimesheetToActivities(timesheet)} showAll={true} />
                    ) : (
                      <p className="text-center py-8 text-muted-foreground">
                        Vous n'avez pas encore effectué de pointage
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports</CardTitle>
                    <CardDescription>Générez des rapports personnalisés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Accédez à la section Rapports pour générer des rapports détaillés.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

// Fonction pour calculer les heures de la semaine
function calculateWeeklyHours(timesheet: any) {
  if (!timesheet || timesheet.length === 0) {
    return "0h 00m"
  }

  // Obtenir la date du lundi de cette semaine
  const today = new Date()
  const dayOfWeek = today.getDay() // 0 = dimanche, 1 = lundi, etc.
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Si dimanche, on recule de 6 jours, sinon on recule au lundi
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)

  // Filtrer les pointages de cette semaine
  const thisWeekEntries = timesheet.filter((entry: any) => {
    const entryDate = new Date(entry.date)
    return entryDate >= monday && entry.totalHours
  })

  // Calculer le total des heures
  let totalMinutes = 0
  thisWeekEntries.forEach((entry: any) => {
    if (entry.totalHours) {
      const match = entry.totalHours.match(/(\d+)h\s+(\d+)m/)
      if (match) {
        const hours = Number.parseInt(match[1])
        const minutes = Number.parseInt(match[2])
        totalMinutes += hours * 60 + minutes
      }
    }
  })

  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`
}

// Fonction pour calculer la ponctualité
function calculatePunctuality(timesheet: any) {
  if (!timesheet || timesheet.length === 0) {
    return 100
  }

  // Obtenir le premier jour du mois
  const today = new Date()
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  // Filtrer les pointages de ce mois
  const thisMonthEntries = timesheet.filter((entry: any) => {
    const entryDate = new Date(entry.date)
    return entryDate >= firstDayOfMonth
  })

  if (thisMonthEntries.length === 0) {
    return 100
  }

  // Compter les pointages à l'heure
  const onTimeEntries = thisMonthEntries.filter(
    (entry: any) => entry.status === "complete" || entry.status === "on-time" || entry.status === "early",
  )

  return Math.round((onTimeEntries.length / thisMonthEntries.length) * 100)
}

// Fonction pour convertir les données de timesheet en activités pour RecentActivitiesTable
function convertTimesheetToActivities(timesheet: any) {
  const activities: any[] = []

  timesheet.forEach((entry: any) => {
    if (entry.checkIn) {
      activities.push({
        id: `${entry.id}-in`,
        date: entry.date,
        time: entry.checkIn,
        type: "check-in",
        status: entry.status === "late" ? "late" : entry.status === "early" ? "early" : "on-time",
        location: entry.location?.checkIn || null,
      })
    }

    if (entry.checkOut) {
      activities.push({
        id: `${entry.id}-out`,
        date: entry.date,
        time: entry.checkOut,
        type: "check-out",
        status: entry.status === "overtime" ? "overtime" : "on-time",
        location: entry.location?.checkOut || null,
      })
    }
  })

  // Trier par date et heure décroissantes  

  activities.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateB.getTime() - dateA.getTime()
  })

  return activities
}
