import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Cette API serait normalement connectée à une base de données
export async function GET() {
  const userId = cookies().get("userId")?.value

  if (!userId) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Simuler des données de pointage
  const timesheet = [
    {
      date: "2023-05-15",
      checkIn: "08:02:34",
      checkOut: "17:05:12",
      totalHours: "8h 02m",
      status: "Complet",
    },
    {
      date: "2023-05-16",
      checkIn: "08:10:45",
      checkOut: "17:30:22",
      totalHours: "9h 19m",
      status: "Complet",
    },
    {
      date: "2023-05-17",
      checkIn: "07:55:18",
      checkOut: "16:45:30",
      totalHours: "8h 50m",
      status: "Complet",
    },
    {
      date: "2023-05-18",
      checkIn: "08:05:22",
      checkOut: "17:15:45",
      totalHours: "9h 10m",
      status: "Complet",
    },
    {
      date: "2023-05-19",
      checkIn: "08:00:10",
      checkOut: "16:30:15",
      totalHours: "8h 30m",
      status: "Complet",
    },
  ]

  return NextResponse.json({ timesheet })
}
