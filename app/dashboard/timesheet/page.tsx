import { redirect } from "next/navigation"
import { getCurrentUser, getUserTimesheet } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimesheetTable } from "@/components/timesheet-table"

export default async function TimesheetPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const timesheet = await getUserTimesheet(user.id)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar visible seulement sur desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mes Pointages</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historique des pointages</CardTitle>
                <CardDescription>Consultez l'historique complet de vos pointages</CardDescription>
              </CardHeader>
              <CardContent>
                <TimesheetTable timesheet={timesheet} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
