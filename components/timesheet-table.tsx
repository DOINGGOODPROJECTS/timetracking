"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLanguage } from "@/components/language-provider"

interface TimesheetEntry {
  id: number
  date: string
  checkIn: string
  checkOut: string | null
  totalHours: string | null
  status: string
  location?: {
    checkIn: {
      latitude: number
      longitude: number
      address?: string
    }
    checkOut?: {
      latitude: number
      longitude: number
      address?: string
    }
  }
  employeeName?: string
}

interface TimesheetTableProps {
  timesheet: TimesheetEntry[]
  showEmployeeName?: boolean
}

export function TimesheetTable({ timesheet, showEmployeeName = false }: TimesheetTableProps) {
  const { t } = useLanguage()

  return (
    <TooltipProvider>
      <Table>
        <TableHeader>
          <TableRow>
            {showEmployeeName && <TableHead>{t("admin.name")}</TableHead>}
            <TableHead>{t("timesheet.date")}</TableHead>
            <TableHead>{t("timesheet.arrival")}</TableHead>
            <TableHead>{t("timesheet.arrivalLocation")}</TableHead>
            <TableHead>{t("timesheet.departure")}</TableHead>
            <TableHead>{t("timesheet.departureLocation")}</TableHead>
            <TableHead>{t("timesheet.totalHours")}</TableHead>
            <TableHead>{t("timesheet.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheet.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showEmployeeName ? 8 : 7} className="text-center py-8 text-muted-foreground">
                {t("timesheet.noRecords")}
              </TableCell>
            </TableRow>
          ) : (
            timesheet.map((entry) => (
              <TableRow key={entry.id}>
                {showEmployeeName && <TableCell>{entry.employeeName}</TableCell>}
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.checkIn}</TableCell>
                <TableCell>
                  {entry.location?.checkIn ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs truncate max-w-[100px]">
                            {entry.location.checkIn.address || t("timesheet.viewCoordinates")}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lat: {entry.location.checkIn.latitude.toFixed(6)}</p>
                        <p>Long: {entry.location.checkIn.longitude.toFixed(6)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t("timesheet.notAvailable")}</span>
                  )}
                </TableCell>
                <TableCell>{entry.checkOut || "-"}</TableCell>
                <TableCell>
                  {entry.location?.checkOut ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs truncate max-w-[100px]">
                            {entry.location.checkOut.address || t("timesheet.viewCoordinates")}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Lat: {entry.location.checkOut.latitude.toFixed(6)}</p>
                        <p>Long: {entry.location.checkOut.longitude.toFixed(6)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-xs text-muted-foreground">{t("timesheet.notAvailable")}</span>
                  )}
                </TableCell>
                <TableCell>{entry.totalHours || "-"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      entry.status === "complete"
                        ? "default"
                        : entry.status === "incomplete"
                          ? "secondary"
                          : entry.status === "late"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {entry.status === "complete"
                      ? t("timesheet.complete")
                      : entry.status === "incomplete"
                        ? t("timesheet.incomplete")
                        : entry.status === "late"
                          ? t("timesheet.late")
                          : entry.status === "early"
                            ? t("timesheet.early")
                            : entry.status === "on-time"
                              ? t("timesheet.onTime")
                              : entry.status === "overtime"
                                ? t("timesheet.overtime")
                                : entry.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TooltipProvider>
  )
}
