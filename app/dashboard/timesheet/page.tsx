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
      <div className="flex flex-1">
        <DashboardNav className="hidden w-64 border-r md:block" />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Mes Pointages</h1>
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
