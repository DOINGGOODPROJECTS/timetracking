"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/components/language-provider"

interface Activity {
  id: string | number
  date: string
  time: string
  type: "check-in" | "check-out"
  status: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  } | null
}

interface RecentActivitiesTableProps {
  activities: Activity[]
  showAll?: boolean
}

export function RecentActivitiesTable({ activities, showAll = false }: RecentActivitiesTableProps) {
  const { t } = useLanguage()

  // Limiter le nombre d'activités affichées si showAll est false
  const displayActivities = showAll ? activities : activities.slice(0, 5)

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("timesheet.date")}</TableHead>
            <TableHead>{t("timesheet.time")}</TableHead>
            <TableHead>{t("timesheet.type")}</TableHead>
            <TableHead>{t("timesheet.status")}</TableHead>
            <TableHead>{t("timesheet.location")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayActivities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                {t("dashboard.noCheckInsYet")}
              </TableCell>
            </TableRow>
          ) : (
            displayActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.date}</TableCell>
                <TableCell>{activity.time}</TableCell>
                <TableCell>
                  {activity.type === "check-in" ? t("timesheet.arrival") : t("timesheet.departure")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      activity.status === "on-time"
                        ? "default"
                        : activity.status === "late"
                          ? "destructive"
                          : activity.status === "early"
                            ? "secondary"
                            : "outline"
                    }
                  >
                    {activity.status === "on-time"
                      ? t("timesheet.onTime")
                      : activity.status === "late"
                        ? t("timesheet.late")
                        : activity.status === "early"
                          ? t("timesheet.early")
                          : t("timesheet.overtime")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {activity.location ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs truncate max-w-[100px]">
                            {activity.location.address || t("timesheet.viewCoordinates")}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lat: {activity.location.latitude.toFixed(6)}</p>
                        <p>Long: {activity.location.longitude.toFixed(6)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      {t("timesheet.notAvailable")}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
