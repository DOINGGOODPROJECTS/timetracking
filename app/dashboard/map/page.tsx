"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/dashboard-header"
import DashboardNav from "@/components/dashboard-nav"

export default function MapPage() {
  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "user@example.com",
    isAdmin: false,
  })

  const [mapLoaded, setMapLoaded] = useState(false)
  const [selectedDate, setSelectedDate] = useState("today")

  // Simuler le chargement des données utilisateur
  useEffect(() => {
    // Dans une application réelle, vous récupéreriez l'utilisateur depuis une API
    const fetchUser = async () => {
      // Simulation d'un appel API
      setTimeout(() => {
        setUser({
          name: "John Doe",
          email: "john@example.com",
          isAdmin: false,
        })
      }, 500)
    }

    fetchUser()
  }, [])

  // Simuler le chargement de la carte
  useEffect(() => {
    setTimeout(() => {
      setMapLoaded(true)
    }, 1000)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} />
      <div className="flex flex-1">
        <DashboardNav className="hidden w-64 border-r md:block" />
        <main className="flex-1 p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Carte des pointages</h1>
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="w-full md:w-auto">
                <Label htmlFor="date-filter">Période</Label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger id="date-filter" className="w-full md:w-[180px]">
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Aujourd'hui</SelectItem>
                    <SelectItem value="yesterday">Hier</SelectItem>
                    <SelectItem value="week">Cette semaine</SelectItem>
                    <SelectItem value="month">Ce mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">Tous les pointages</TabsTrigger>
                <TabsTrigger value="check-in">Arrivées</TabsTrigger>
                <TabsTrigger value="check-out">Départs</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Carte des pointages</CardTitle>
                    <CardDescription>Visualisez vos pointages sur la carte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative w-full h-[400px] bg-muted rounded-md overflow-hidden">
                      {!mapLoaded ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-muted-foreground">Chargement de la carte...</p>
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-muted-foreground mb-2">Carte interactive des pointages</p>
                            <p className="text-xs text-muted-foreground">
                              Note: Dans une application réelle, une carte interactive serait affichée ici
                              <br />
                              en utilisant une bibliothèque comme Leaflet, Google Maps ou Mapbox.
                            </p>

                            {/* Simuler des marqueurs sur la carte */}
                            <div className="mt-4 grid grid-cols-2 gap-4 max-w-md mx-auto">
                              <div className="p-3 bg-background rounded-md border shadow-sm">
                                <div className="font-medium">Arrivée</div>
                                <div className="text-sm text-muted-foreground">08:02:34</div>
                                <div className="text-xs mt-1">Bureau principal</div>
                              </div>
                              <div className="p-3 bg-background rounded-md border shadow-sm">
                                <div className="font-medium">Départ</div>
                                <div className="text-sm text-muted-foreground">17:05:12</div>
                                <div className="text-xs mt-1">Bureau principal</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="check-in" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Carte des arrivées</CardTitle>
                    <CardDescription>Visualisez vos pointages d'arrivée sur la carte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[400px] bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Carte des arrivées (filtrage par type de pointage)</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="check-out" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Carte des départs</CardTitle>
                    <CardDescription>Visualisez vos pointages de départ sur la carte</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[400px] bg-muted rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Carte des départs (filtrage par type de pointage)</p>
                    </div>
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
