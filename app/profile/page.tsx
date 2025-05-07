import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile-form"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1 flex-col md:flex-row">
        {/* Sidebar visible uniquement en desktop */}
        <DashboardNav className="hidden md:block md:w-64 md:border-r" />

        {/* Contenu principal */}
        <main className="flex-1 p-4 md:p-6 w-full">
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mon Profil</h1>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm user={user} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
