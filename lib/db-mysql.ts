import mysql from "mysql2/promise"

// Ajouter l'import pour les utilitaires de mot de passe en haut du fichier
import { hashPassword } from "./password-utils"

// Types from the original db.ts file
export interface User {
  id: number
  name: string
  email: string
  password: string
  isAdmin: boolean
  isCheckedIn: boolean
  lastActivity: string | null
  lastLocation: LocationData | null
  department?: string
  language?: "fr" | "en"
  theme?: "light" | "dark" | "system"
}

export interface TimeRecord {
  id: number
  userId: number
  type: "check-in" | "check-out"
  timestamp: string
  status: string
  location: LocationData | null
}

export interface LocationData {
  latitude: number
  longitude: number
  accuracy?: number
  address?: string
}

export interface Report {
  id: number
  userId: number
  name: string
  type: "daily" | "weekly" | "monthly" | "custom"
  dateCreated: string
  dateRange: {
    start: string
    end: string
  }
  format: "pdf" | "excel" | "csv"
  url: string
  size: string
}

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "timetracking",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Helper function to execute SQL queries
async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T[]
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Database operations
export const db = {
  // Users
  getUsers: async (): Promise<User[]> => {
    console.log("DB: Retrieving all users from MySQL database")
    const users = await query("SELECT * FROM users")
    return users as User[]
  },

  getUserById: async (id: number): Promise<User | null> => {
    console.log(`DB: Retrieving user ${id} from MySQL database`)
    const users = await query("SELECT * FROM users WHERE id = ?", [id])
    return users.length > 0 ? (users[0] as User) : null
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    console.log(`DB: Searching for user by email ${email} in MySQL database`)
    const users = await query("SELECT * FROM users WHERE email = ?", [email])
    return users.length > 0 ? (users[0] as User) : null
  },

  auth: async (email: string, password: string): Promise<User | null> => {
    console.log(`DB: Searching for user by email ${email} | ${password} in MySQL database`)

    const users = await query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])
    return users.length > 0 ? (users[0] as User) : null
  },

  // Modifier la fonction createUser pour hacher le mot de passe
  createUser: async (user: Omit<User, "id">): Promise<User> => {
    console.log("DB: Creating a new user in MySQL database")
    const { name, email, password, isAdmin, isCheckedIn, lastActivity, lastLocation, department, language, theme } =
      user

    // Hacher le mot de passe avant de le stocker
    const hashedPassword = await hashPassword(password)

    // Convert location object to JSON string
    const locationJson = lastLocation ? JSON.stringify(lastLocation) : null

    const result = await query(
      "INSERT INTO users (name, email, password, isAdmin, isCheckedIn, lastActivity, lastLocation, department, language, theme) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email,
        hashedPassword, // Utiliser le mot de passe haché
        isAdmin ? 1 : 0,
        isCheckedIn ? 1 : 0,
        lastActivity,
        locationJson,
        department,
        language,
        theme,
      ],
    )

    const id = (result as any).insertId
    return { id, ...user }
  },

  // Modifier la fonction updateUser pour hacher le mot de passe si nécessaire
  updateUser: async (id: number, data: Partial<User>): Promise<User | null> => {
    console.log(`DB: Updating user ${id} in MySQL database`)

    // Get the current user data
    const currentUser = await db.getUserById(id)
    if (!currentUser) return null

    // Si un nouveau mot de passe est fourni, le hacher
    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    // Prepare update fields and values
    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (key === "lastLocation" && value !== null) {
        updates.push(`${key} = ?`)
        values.push(JSON.stringify(value))
      } else {
        if (key === "isAdmin" || key === "isCheckedIn") {
          updates.push(`${key} = ?`)
          values.push(value ? 1 : 0)
        } else {
          updates.push(`${key} = ?`)
          values.push(value)
        }
      }
    })

    // Add the id to the values array
    values.push(id)

    // Execute the update query
    await query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, values)

    // Return the updated user
    return { ...currentUser, ...data }
  },

  deleteUser: async (id: number): Promise<boolean> => {
    console.log(`DB: Deleting user ${id} from MySQL database`)
    const result = await query("DELETE FROM users WHERE id = ?", [id])
    return (result as any).affectedRows > 0
  },

  // Time Records
  getTimeRecords: async (): Promise<TimeRecord[]> => {
    console.log("DB: Retrieving all time records from MySQL database")
    const records = await query("SELECT * FROM time_records ORDER BY timestamp DESC")

    // Parse location JSON
    return (records as any[]).map((record) => ({
      ...record,
      location: record.location ? JSON.parse(record.location) : null,
    }))
  },

  // Nouvelle fonction qui filtre les enregistrements de temps pour la journée actuelle
  getTimeRecordByDate: async (userId: number, date: string, type: string): Promise<TimeRecord[]> => {
    const records = await db.getTimeRecordsByUserId(userId)
    
    // Filter the records to match the specific date
    return records.filter(record => {
      const recordDate = new Date(record.timestamp).toISOString().split('T')[0]
      return recordDate === date && record.type === type
    })
  },


  getTimeRecordsByUserId: async (userId: number): Promise<TimeRecord[]> => {
    console.log(`DB: Retrieving time records for user ${userId} from MySQL database`)
    const records = await query("SELECT * FROM time_records WHERE userId = ? ORDER BY timestamp DESC", [userId])

    // Parse location JSON
    return (records as any[]).map((record) => ({
      ...record,
      location: record.location ? JSON.parse(record.location) : null,
    }))
  },

  createTimeRecord: async (record: Omit<TimeRecord, "id">): Promise<TimeRecord> => {
    console.log("DB: Creating a new time record in MySQL database")
    const { userId, type, timestamp, status, location } = record

    // Convert location object to JSON string
    const locationJson = location ? JSON.stringify(location) : null

    const result = await query(
      "INSERT INTO time_records (userId, type, timestamp, status, location) VALUES (?, ?, ?, ?, ?)",
      [userId, type, timestamp, status, locationJson],
    )

    const id = (result as any).insertId
    return { id, ...record }
  },



  deleteTimeRecordsByUserId: async (userId: number): Promise<boolean> => {
    console.log(`DB: Deleting time records for user ${userId} from MySQL database`)
    const result = await query("DELETE FROM time_records WHERE userId = ?", [userId])
    return (result as any).affectedRows > 0
  },

  // Reports
  getReports: async (): Promise<Report[]> => {
    console.log("DB: Retrieving all reports from MySQL database")
    const reports = await query("SELECT * FROM reports ORDER BY dateCreated DESC")

    // Parse dateRange JSON
    return (reports as any[]).map((report) => ({
      ...report,
      dateRange: report.dateRange ? JSON.parse(report.dateRange) : null,
    }))
  },

  getReportsByUserId: async (userId: number): Promise<Report[]> => {
    console.log(`DB: Retrieving reports for user ${userId} from MySQL database`)
    const reports = await query("SELECT * FROM reports WHERE userId = ? ORDER BY dateCreated DESC", [userId])

    // Parse dateRange JSON
    return (reports as any[]).map((report) => ({
      ...report,
      dateRange: report.dateRange ? JSON.parse(report.dateRange) : null,
    }))
  },

  createReport: async (report: Omit<Report, "id">): Promise<Report> => {
    console.log("DB: Creating a new report in MySQL database")
    const { userId, name, type, dateCreated, dateRange, format, url, size } = report

    // Convert dateRange object to JSON string
    const dateRangeJson = JSON.stringify(dateRange)

    const result = await query(
      "INSERT INTO reports (userId, name, type, dateCreated, dateRange, format, url, size) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [userId, name, type, dateCreated, dateRangeJson, format, url, size],
    )

    const id = (result as any).insertId
    return { id, ...report }
  },

  deleteReport: async (id: number): Promise<boolean> => {
    console.log(`DB: Deleting report ${id} from MySQL database`)
    const result = await query("DELETE FROM reports WHERE id = ?", [id])
    return (result as any).affectedRows > 0
  },

  // Database initialization
  initDatabase: async (): Promise<void> => {
    console.log("Initializing database tables...")

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        isAdmin BOOLEAN DEFAULT FALSE,
        isCheckedIn BOOLEAN DEFAULT FALSE,
        lastActivity DATETIME NULL,
        lastLocation JSON NULL,
        department VARCHAR(255) NULL,
        language ENUM('fr', 'en') DEFAULT 'fr',
        theme ENUM('light', 'dark', 'system') DEFAULT 'system'
      )
    `)

    // Create time_records table
    await query(`
      CREATE TABLE IF NOT EXISTS time_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        type ENUM('check-in', 'check-out') NOT NULL,
        timestamp DATETIME NOT NULL,
        status VARCHAR(50) NOT NULL,
        location JSON NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create reports table
    await query(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        type ENUM('daily', 'weekly', 'monthly', 'custom') NOT NULL,
        dateCreated DATE NOT NULL,
        dateRange JSON NOT NULL,
        format ENUM('pdf', 'excel', 'csv') NOT NULL,
        url VARCHAR(255) NOT NULL,
        size VARCHAR(50) NOT NULL,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log("Database tables initialized successfully")
  },

  // Modifier la fonction seedInitialData pour hacher les mots de passe initiaux
  seedInitialData: async (): Promise<void> => {
    console.log("Checking if initial data needs to be seeded...")

    // Check if users table is empty
    const users = await query("SELECT COUNT(*) as count FROM users")
    if ((users[0] as any).count === 0) {
      console.log("Seeding initial user data...")

      // Create admin user with hashed password
      await db.createUser({
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // Sera haché par createUser
        isAdmin: true,
        isCheckedIn: false,
        lastActivity: null,
        lastLocation: null,
        department: "Administration",
        language: "fr",
        theme: "system",
      })

      // Create regular users with hashed passwords
      await db.createUser({
        name: "John Doe",
        email: "john@example.com",
        password: "password123", // Sera haché par createUser
        isAdmin: false,
        isCheckedIn: false,
        lastActivity: null,
        lastLocation: null,
        department: "Développement",
        language: "fr",
        theme: "system",
      })

      await db.createUser({
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123", // Sera haché par createUser
        isAdmin: false,
        isCheckedIn: true,
        lastActivity: "2023-05-19T08:05:22",
        lastLocation: {
          latitude: 48.8584,
          longitude: 2.2945,
          address: "Bureau secondaire",
        },
        department: "Marketing",
        language: "en",
        theme: "light",
      })

      console.log("Initial user data seeded successfully")

      // Seed some time records
      console.log("Seeding initial time records...")

      // For John Doe (user ID 2)
      await db.createTimeRecord({
        userId: 2,
        type: "check-in",
        timestamp: "2023-05-15T08:02:34",
        status: "on-time",
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          address: "Bureau principal",
        },
      })

      await db.createTimeRecord({
        userId: 2,
        type: "check-out",
        timestamp: "2023-05-15T17:05:12",
        status: "on-time",
        location: {
          latitude: 48.8566,
          longitude: 2.3522,
          address: "Bureau principal",
        },
      })

      await db.createTimeRecord({
        userId: 2,
        type: "check-in",
        timestamp: "2023-05-16T08:10:45",
        status: "late",
        location: {
          latitude: 48.858,
          longitude: 2.3505,
          address: "Entrée secondaire",
        },
      })

      await db.createTimeRecord({
        userId: 2,
        type: "check-out",
        timestamp: "2023-05-16T17:30:22",
        status: "overtime",
        location: {
          latitude: 48.858,
          longitude: 2.3505,
          address: "Entrée secondaire",
        },
      })

      // For Jane Smith (user ID 3)
      await db.createTimeRecord({
        userId: 3,
        type: "check-in",
        timestamp: "2023-05-15T07:55:18",
        status: "early",
        location: {
          latitude: 48.8584,
          longitude: 2.2945,
          address: "Bureau secondaire",
        },
      })

      await db.createTimeRecord({
        userId: 3,
        type: "check-out",
        timestamp: "2023-05-15T16:45:30",
        status: "early",
        location: {
          latitude: 48.8584,
          longitude: 2.2945,
          address: "Bureau secondaire",
        },
      })

      await db.createTimeRecord({
        userId: 3,
        type: "check-in",
        timestamp: "2023-05-16T08:05:22",
        status: "on-time",
        location: {
          latitude: 48.8584,
          longitude: 2.2945,
          address: "Bureau secondaire",
        },
      })

      console.log("Initial time records seeded successfully")

      // Seed some reports
      console.log("Seeding initial reports...")

      await db.createReport({
        userId: 1,
        name: "Rapport mensuel - Mai 2023",
        type: "monthly",
        dateCreated: "2023-06-01",
        dateRange: {
          start: "2023-05-01",
          end: "2023-05-31",
        },
        format: "pdf",
        url: "/reports/monthly-may-2023.pdf",
        size: "1.2 MB",
      })

      await db.createReport({
        userId: 1,
        name: "Rapport hebdomadaire - Semaine 22",
        type: "weekly",
        dateCreated: "2023-05-29",
        dateRange: {
          start: "2023-05-22",
          end: "2023-05-28",
        },
        format: "excel",
        url: "/reports/weekly-22-2023.xlsx",
        size: "845 KB",
      })

      await db.createReport({
        userId: 2,
        name: "Rapport quotidien - 15 Mai 2023",
        type: "daily",
        dateCreated: "2023-05-16",
        dateRange: {
          start: "2023-05-15",
          end: "2023-05-15",
        },
        format: "pdf",
        url: "/reports/daily-15-05-2023.pdf",
        size: "620 KB",
      })

      console.log("Initial reports seeded successfully")
    } else {
      console.log("Database already contains data, skipping seed")
    }
  },
}
