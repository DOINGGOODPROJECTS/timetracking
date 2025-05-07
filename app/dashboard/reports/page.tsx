import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReportsGenerator } from "@/components/reports-generator"
import { ReportsList } from "@/components/reports-list"
import { db } from "@/lib/db-mysql"

export default async function ReportsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const reports = await db.getReportsByUserId(user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar : visible uniquement sur desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Rapports</h1>
            </div>

            <Tabs defaultValue="generate" className="space-y-4">
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger value="generate">Générer un rapport</TabsTrigger>
                <TabsTrigger value="saved">Rapports sauvegardés</TabsTrigger>
              </TabsList>

              <TabsContent value="generate" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Générer un rapport</CardTitle>
                    <CardDescription>Créez un rapport personnalisé de vos pointages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportsGenerator />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports sauvegardés</CardTitle>
                    <CardDescription>Consultez vos rapports précédemment générés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReportsList reports={reports} />
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
