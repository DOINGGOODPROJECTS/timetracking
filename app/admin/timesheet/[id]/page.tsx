export const dynamicParams = true
import { redirect } from "next/navigation"
import { getCurrentUser, getEmployeeById, getEmployeeTimesheet } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TimesheetTable } from "@/components/timesheet-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AdminEmployeeTimesheetPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/dashboard")
  }

  // 🔒 Sécurise ici
  if (!params.id || Array.isArray(params.id)) {
    redirect("/admin/employees")
  }

  const employeeId = parseInt(params.id, 10)

  if (isNaN(employeeId)) {
    redirect("/admin/employees")
  }

  const employee = await getEmployeeById(employeeId)

  if (!employee) {
    redirect("/admin/employees")
  }

  const timesheet = await getEmployeeTimesheet(employeeId)

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1">
        <DashboardNav className="hidden w-64 border-r md:block" />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/admin/employees">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la liste
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">Pointages de {employee.name}</h1>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historique des pointages</CardTitle>
                <CardDescription>Consultez l'historique complet des pointages de cet employé</CardDescription>
              </CardHeader>
              <CardContent>
                <TimesheetTable timesheet={timesheet} showEmployeeName={false} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
