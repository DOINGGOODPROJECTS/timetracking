"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { db, type LocationData } from "@/lib/db-mysql"
import { parseISO, differenceInMinutes, isSameDay } from "date-fns"
import { verifyPassword } from "@/lib/password-utils"

// Authentification
export async function login(email: string, password: string) {
  const user = await db.getUserByEmail(email)

  if (user && (await verifyPassword(password, user.password))) {
    const cookieStore = await cookies()
    cookieStore.set("userId", user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 semaine
      path: "/",
    })

    const today = new Date()
    const timeRecords = await db.getTimeRecordsByUserId(user.id)

    const hasCheckInToday = timeRecords.some(
      (record) => record.type === "check-in" && isSameDay(new Date(record.timestamp), today)
    )

    const hasCheckOutToday = timeRecords.some(
      (record) => record.type === "check-out" && isSameDay(new Date(record.timestamp), today)
    )

    // Mise à jour des flags
    await db.updateUser(user.id, {
      isCheckedIn: hasCheckInToday,
      isCheckedOut: hasCheckOutToday,
    })

    return {
      success: true,
      user: {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    }
  }

  return { success: false, error: "Email ou mot de passe incorrect" }
}

export async function logout() {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  cookieStore.delete("userId")
  return { success: true }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const userId = cookieStore.get("userId")?.value
  if (!userId) return null

  const user = await db.getUserById(Number(userId))
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isCheckedIn: user.isCheckedIn,
    isCheckedOut: user.isCheckedOut,
    lastActivity: user.lastActivity,
    lastLocation: user.lastLocation,
    language: user.language || "fr",
    theme: user.theme || "system",
  }
}

// Pointage
export async function checkIn(locationData?: LocationData) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const userId = cookieStore.get("userId")?.value
  if (!userId) return { success: false, error: "Utilisateur non authentifié" }

  const user = await db.getUserById(Number(userId))
  if (!user) return { success: false, error: "Utilisateur non trouvé" }
  // if (user.isCheckedIn) return { success: false, error: "Vous êtes déjà pointé" }

  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]  // Format YYYY-MM-DD

  // Vérifier s'il y a déjà un pointage pour aujourd'hui
  const existingRecord = await db.getTimeRecordByDate(user.id, currentDate, 'check-in')
  console.log(existingRecord);
  if (existingRecord.length > 0) {
    return { success: false, error: "Vous avez déjà pointé" }
  }

  const timestamp = now.toISOString().slice(0, 19).replace("T", " ")
  const hour = now.getHours()
  const status = hour < 9 ? "early" : hour === 9 ? "on-time" : "late"

  await db.createTimeRecord({
    userId: user.id,
    type: "check-in",
    timestamp,
    status,
    location: locationData || null,
  })

  await db.updateUser(user.id, {
    isCheckedIn: true,
    lastActivity: timestamp,
    lastLocation: locationData || null,
  })

  revalidatePath("/dashboard")
  return { success: true }
}

export async function checkOut(locationData?: LocationData) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const userId = cookieStore.get("userId")?.value
  if (!userId) return { success: false, error: "Utilisateur non authentifié" }

  const user = await db.getUserById(Number(userId))
  if (!user) return { success: false, error: "Utilisateur non trouvé" }
  if (!user.isCheckedIn) return { success: false, error: "Vous n'êtes pas pointé" }

  const now = new Date()
  const currentDate = now.toISOString().split('T')[0]  // Format YYYY-MM-DD

  // Vérifier s'il y a déjà un check-out pour aujourd'hui
  const existingRecord = await db.getTimeRecordByDate(user.id, currentDate, 'check-out')
  if (existingRecord.length > 0) {
    return { success: false, error: "Vous n'êtes pas pointé aujourd'hui" }
  }

  const timestamp = now.toISOString().slice(0, 19).replace("T", " ")
  const hour = now.getHours()
  const status = hour < 17 ? "early" : hour === 17 ? "on-time" : "overtime"

  await db.createTimeRecord({
    userId: user.id,
    type: "check-out",
    timestamp,
    status,
    location: locationData || null,
  })

  await db.updateUser(user.id, {
    isCheckedIn: false,
    lastActivity: timestamp,
    lastLocation: locationData || null,
  })

  revalidatePath("/dashboard")
  return { success: true }
}


// Récupérer les employés (admin)
export async function getEmployees() {
  const cookieStore = await cookies()  
  const userId = cookieStore.get("userId")?.value  // Attendre la résolution de la promesse
  const user = userId ? await db.getUserById(Number(userId)) : null

  if (!user || !user.isAdmin) return []

  const users = await db.getUsers()
  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    department: u.department || "Non spécifié",
    status: u.isCheckedIn ? "active" : "inactive",
    lastLocation: u.lastLocation,
  }))
}

// Récupérer un employé (admin ou soi-même)
export async function getEmployeeById(id: number) {
  const userId = await cookies()  // Attendre la résolution de la promesse
  const currentUser = userId ? await db.getUserById(Number(userId)) : null

  if (!currentUser || (!currentUser.isAdmin && currentUser.id !== id)) return null

  const employee = await db.getUserById(id)
  if (!employee) return null

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department: employee.department || "Non spécifié",
    status: employee.isCheckedIn ? "active" : "inactive",
    lastLocation: employee.lastLocation,
  }
}

// Fiche de pointage
export async function getUserTimesheet(userId: number) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const currentUserId = cookieStore.get("userId")?.value
  const currentUser = currentUserId ? await db.getUserById(Number(currentUserId)) : null
  if (!currentUser || (!currentUser.isAdmin && currentUser.id !== userId)) return []

  const userRecords = await db.getTimeRecordsByUserId(userId)
  const employee = await db.getUserById(userId)

  const recordsByDate: Record<string, typeof userRecords> = {}
  userRecords.forEach((record) => {
    const date = new Date(record.timestamp).toISOString().split("T")[0]
    if (!recordsByDate[date]) recordsByDate[date] = []
    recordsByDate[date].push(record)
  })

  const timesheet: any[] = []

  for (const date in recordsByDate) {
    const dayRecords = recordsByDate[date]
    const checkInRecord = dayRecords.find((r: any) => r.type === "check-in")
    const checkOutRecord = dayRecords.find((r: any) => r.type === "check-out")

    let totalHours: string | null = null
    type RecordWithTimestamp = {
      timestamp: string | Date
    }
    
    if (checkInRecord && checkOutRecord) {
      // Vérification avec Object.prototype.toString
      const checkInTimestamp =
        checkInRecord.timestamp && Object.prototype.toString.call(checkInRecord.timestamp) === '[object Date]'
          ? checkInRecord.timestamp.toString()  // Si c'est une instance de Date, on la convertit en string ISO
          : String(checkInRecord.timestamp);  // Sinon, on la convertit en string
    
      const checkOutTimestamp =
        checkOutRecord.timestamp && Object.prototype.toString.call(checkOutRecord.timestamp) === '[object Date]'
          ? checkOutRecord.timestamp.toString()
          : String(checkOutRecord.timestamp);
    
      const checkInTime = parseISO(checkInTimestamp);
      const checkOutTime = parseISO(checkOutTimestamp);
    
      const diffMinutes = differenceInMinutes(checkOutTime, checkInTime);
      totalHours = `${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
    }

    timesheet.push({
      id: checkInRecord?.id ?? checkOutRecord?.id ?? 0,
      date,
      checkIn: checkInRecord?.timestamp ? new Date(checkInRecord.timestamp).toISOString().split("T")[1].substring(0, 8) : null,
      checkOut: checkOutRecord?.timestamp ? new Date(checkOutRecord.timestamp).toISOString().split("T")[1].substring(0, 8) : null,
      totalHours,
      status: checkInRecord && checkOutRecord ? "complete" : "incomplete",
      location: {
        checkIn: checkInRecord?.location ?? null,
        checkOut: checkOutRecord?.location ?? null,
      },
      employeeName: employee?.name ?? "Inconnu",
    })
  }

  return timesheet
}

export async function getEmployeeTimesheet(employeeId: number) {
  return getUserTimesheet(employeeId)
}

// Mise à jour du profil utilisateur
export async function updateUserProfile(
  userId: number,
  data: { name: string; email: string; currentPassword?: string; newPassword?: string }
) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const currentUserId = cookieStore.get("userId")?.value
  const currentUser = currentUserId ? await db.getUserById(Number(currentUserId)) : null
  if (!currentUser) return { success: false, error: "Utilisateur non authentifié" }
  if (currentUser.id !== userId && !currentUser.isAdmin) {
    return { success: false, error: "Vous n'êtes pas autorisé à modifier ce profil" }
  }

  const user = await db.getUserById(userId)
  if (!user) return { success: false, error: "Utilisateur non trouvé" }

  if (data.currentPassword && !(await verifyPassword(data.currentPassword, user.password))) {
    return { success: false, error: "Mot de passe actuel incorrect" }
  }

  const updateData: Partial<typeof user> = { name: data.name, email: data.email }
  if (data.newPassword) updateData.password = data.newPassword

  await db.updateUser(userId, updateData)
  revalidatePath("/profile")

  return { success: true }
}

// Mise à jour des préférences utilisateur
export async function updateUserPreferences(
  userId: number,
  data: { language?: "fr" | "en"; theme?: "light" | "dark" | "system" }
) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const currentUserId = cookieStore.get("userId")?.value
  const currentUser = currentUserId ? await db.getUserById(Number(currentUserId)) : null

  if (!currentUser) return { success: false, error: "Utilisateur non authentifié" }
  if (currentUser.id !== userId && !currentUser.isAdmin) {
    return { success: false, error: "Vous n'êtes pas autorisé à modifier ces préférences" }
  }

  await db.updateUser(userId, {
    language: data.language,
    theme: data.theme,
  })

  revalidatePath("/dashboard/settings")
  return { success: true }
}

// Mise à jour des employés (admin)
export async function updateEmployee(
  employeeId: number,
  data: { name: string; email: string; department: string }
) {
  const cookieStore = await cookies()  // Attendre la résolution de la promesse
  const currentUserId = cookieStore.get("userId")?.value
  const currentUser = currentUserId ? await db.getUserById(Number(currentUserId)) : null
  if (!currentUser || !currentUser.isAdmin) {
    return { success: false, error: "Vous n'êtes pas autorisé à effectuer cette action" }
  }

  const employee = await db.getUserById(employeeId)
  if (!employee) {
    return { success: false, error: "Employé non trouvé" }
  }

  await db.updateUser(employeeId, {
    name: data.name,
    email: data.email,
    department: data.department,
  })

  revalidatePath("/admin/employees")
  return { success: true }
}
