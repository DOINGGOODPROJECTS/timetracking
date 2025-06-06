import { redirect } from "next/navigation"
import { getCurrentUser, getEmployees } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeesTable } from "@/components/employees-table"

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !user.isAdmin) {
    redirect("/dashboard")
  }

  const employees = await getEmployees()

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation latérale affichée uniquement sur desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Administration</h1>
            </div>

            <Tabs defaultValue="employees" className="space-y-4">
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger value="employees">Employés</TabsTrigger>
                <TabsTrigger value="reports">Rapports</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              <TabsContent value="employees" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestion des employés</CardTitle>
                    <CardDescription>Consultez et gérez les informations des employés</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EmployeesTable employees={employees} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rapports d'entreprise</CardTitle>
                    <CardDescription>Générez des rapports détaillés sur les pointages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fonctionnalité de rapports administratifs à implémenter.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres du système</CardTitle>
                    <CardDescription>Configurez les paramètres de l'application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fonctionnalité de paramètres à implémenter.
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
