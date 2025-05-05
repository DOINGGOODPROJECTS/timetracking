"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut, MapPin, AlertCircle } from "lucide-react"
import { checkIn, checkOut, getCurrentUser } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  address?: string
}

export function CheckInOutCard() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isCheckedOut, setIsCheckedOut] = useState(false)
  const [lastCheckTime, setLastCheckTime] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const now = new Date()
    setCurrentTime(now.toLocaleTimeString())
    setCurrentDate(now.toLocaleDateString())

    const fetchUser = async () => {
      const user = await getCurrentUser()
      setUser(user)
      if (user?.isCheckedIn !== undefined) {
        setIsCheckedIn(user.isCheckedIn)
      }

      if (user?.isCheckedOut !== undefined) {
        setIsCheckedOut(user.isCheckedOut)
      }
    }

    fetchUser()
  }, [])

  // Fonction pour obtenir la localisation actuelle
  const getCurrentLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      setIsGettingLocation(true)
      setLocationError(null)

      if (!navigator.geolocation) {
        setIsGettingLocation(false)
        const errorMsg = t("timesheet.locationNotSupported")
        setLocationError(errorMsg)
        reject(errorMsg)
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords

          // Essayer d'obtenir l'adresse à partir des coordonnées (reverse geocoding)
          try {
            // Note: Dans une application réelle, vous utiliseriez un service comme Google Maps API
            // Ici, nous simulons une adresse pour la démonstration
            const address = `${Math.round(latitude * 100) / 100}, ${Math.round(longitude * 100) / 100}`

            setLocationData({ latitude, longitude, accuracy, address })
            setIsGettingLocation(false)
            resolve({ latitude, longitude, accuracy, address })
          } catch (error) {
            setLocationData({ latitude, longitude, accuracy })
            setIsGettingLocation(false)
            resolve({ latitude, longitude, accuracy })
          }
        },
        (error) => {
          setIsGettingLocation(false)
          let errorMessage = t("timesheet.locationError")

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t("timesheet.locationPermissionDenied")
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = t("timesheet.locationUnavailable")
              break
            case error.TIMEOUT:
              errorMessage = t("timesheet.locationTimeout")
              break
          }

          setLocationError(errorMessage)
          reject(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    })
  }

  const handleCheckIn = async () => {
    setIsLoading(true)
    try {
      // Obtenir la localisation avant de faire le pointage
      const location = await getCurrentLocation()

      const result = await checkIn(location)
      if (result.success) {
        setIsCheckedIn(true)
        setLastCheckTime(new Date().toLocaleTimeString())
        toast({
          title: t("timesheet.checkInSuccess"),
          description: `${t("timesheet.checkedInAt")} ${new Date().toLocaleTimeString()} ${t("timesheet.from")} ${
            location.address || t("timesheet.yourCurrentLocation")
          }`,
        })
      } else {
        toast({
          title: t("general.error"),
          description: result.error || t("general.error"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("general.error"),
        description: typeof error === "string" ? error : t("timesheet.checkInError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    setIsLoading(true)
    try {
      // Obtenir la localisation avant de faire le pointage de sortie
      const location = await getCurrentLocation()

      const result = await checkOut(location)
      if (result.success) {
        setIsCheckedIn(false)
        setLastCheckTime(new Date().toLocaleTimeString())
        toast({
          title: t("timesheet.checkOutSuccess"),
          description: `${t("timesheet.checkedOutAt")} ${new Date().toLocaleTimeString()} ${t("timesheet.from")} ${
            location.address || t("timesheet.yourCurrentLocation")
          }`,
        })
      } else {
        toast({
          title: t("general.error"),
          description: result.error || t("general.error"),
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: t("general.error"),
        description: typeof error === "string" ? error : t("timesheet.checkOutError"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryLocation = () => {
    setLocationError(null)
    getCurrentLocation().catch((error) => {
      console.error("Failed to get location on retry:", error)
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("timesheet.checkInOut")}</CardTitle>
        <CardDescription>{t("timesheet.recordArrivalDeparture")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <p className="text-lg font-medium">
              {isCheckedIn && !isCheckedOut ? t("timesheet.currentlyPresent") : t("timesheet.notCheckedIn")}
            </p>
            {lastCheckTime && (
              <p className="text-sm text-muted-foreground">
                {t("timesheet.lastCheckAt")} {lastCheckTime}
              </p>
            )}
          </div>
          <div className="text-center text-4xl font-bold">{currentTime}</div>
          <p className="text-sm text-muted-foreground">{currentDate}</p>

          {locationData && (
            <div className="w-full mt-4 p-3 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-medium">{t("timesheet.currentPosition")}:</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {locationData.address || `${locationData.latitude.toFixed(6)}, ${locationData.longitude.toFixed(6)}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("timesheet.accuracy")}: ~{Math.round(locationData.accuracy)} {t("timesheet.meters")}
              </p>
            </div>
          )}

          {locationError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{t("timesheet.locationError")}</AlertTitle>
              <AlertDescription>
                {locationError}
                <Button variant="outline" size="sm" className="mt-2" onClick={handleRetryLocation}>
                  {t("timesheet.retryLocation")}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isGettingLocation && (
            <div className="w-full space-y-2">
              <p className="text-sm text-center">{t("timesheet.gettingLocation")}</p>
              <Progress value={66} className="h-1" />
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        {!isCheckedIn && (
          <Button
            variant="default"
            size="lg"
            className="w-full"
            onClick={handleCheckIn}
            disabled={isLoading || isGettingLocation}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? t("general.processing") : t("timesheet.checkIn")}
          </Button>
        )}

        {isCheckedIn && !isCheckedOut && (
          <Button
            variant="destructive"
            size="lg"
            className="w-full"
            onClick={handleCheckOut}
            disabled={isLoading || isGettingLocation}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? t("general.processing") : t("timesheet.checkOut")}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
