import { redirect } from "next/navigation"
import { getCurrentUser, getEmployees } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeesTable } from "@/components/employees-table"

export default async function AdminEmployeesPage() {
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/dashboard")
  }

  const employees = await getEmployees()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar : visible uniquement en desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gestion des Employés</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Liste des employés</CardTitle>
                <CardDescription>Gérez les employés de votre entreprise</CardDescription>
              </CardHeader>
              <CardContent>
                <EmployeesTable employees={employees} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
