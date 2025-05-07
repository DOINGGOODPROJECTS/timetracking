import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationSettings } from "@/components/notification-settings"
import { AppSettings } from "@/components/app-settings"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation latérale visible uniquement sur desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        <main className="flex-1 w-full p-4 sm:p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Paramètres</h1>
            </div>

            <Tabs defaultValue="notifications" className="space-y-4">
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
              </TabsList>

              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de notification</CardTitle>
                    <CardDescription>Configurez comment et quand vous recevez des notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationSettings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="application" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres de l'application</CardTitle>
                    <CardDescription>Configurez les paramètres généraux de l'application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppSettings
                      userId={user.id}
                      initialLanguage={user.language as "fr" | "en"}
                      initialTheme={user.theme as "light" | "dark" | "system"}
                    />
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
