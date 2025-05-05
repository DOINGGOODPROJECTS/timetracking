// Simulation d'une base de données distribuée avec persistance
// Dans une application réelle, vous utiliseriez une base de données distribuée comme:
// - Cassandra, ScyllaDB ou CockroachDB pour une base SQL distribuée
// - MongoDB Atlas, Amazon DynamoDB ou Cosmos DB pour une base NoSQL distribuée
// - Redis Cluster pour un cache distribué

// Cette simulation utilise des structures en mémoire mais dans une vraie implémentation,
// les données seraient réparties sur plusieurs nœuds avec réplication et partitionnement.

// Types pour notre base de données
export interface User {
  id: number
  name: string
  email: string
  password: string
  isAdmin: boolean
  isCheckedIn: boolean
  isCheckedOut: boolean
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

// Initialisation des données
const users: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // Dans une vraie application, utilisez un hash sécurisé
    isAdmin: true,
    isCheckedIn: false,
    isCheckedOut: false,
    lastActivity: null,
    lastLocation: null,
    department: "Administration",
    language: "fr",
    theme: "system",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    isAdmin: false,
    isCheckedIn: false,
    isCheckedOut: false,
    lastActivity: null,
    lastLocation: null,
    department: "Développement",
    language: "fr",
    theme: "system",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    isAdmin: false,
    isCheckedIn: true,
    isCheckedOut: false,
    lastActivity: "2023-05-19T08:05:22",
    lastLocation: {
      latitude: 48.8584,
      longitude: 2.2945,
      address: "Bureau secondaire",
    },
    department: "Marketing",
    language: "en",
    theme: "light",
  },
]

let timeRecords: TimeRecord[] = [
  // Exemple de données pour John Doe
  {
    id: 1,
    userId: 2,
    type: "check-in",
    timestamp: "2023-05-15T08:02:34",
    status: "on-time",
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: "Bureau principal",
    },
  },
  {
    id: 2,
    userId: 2,
    type: "check-out",
    timestamp: "2023-05-15T17:05:12",
    status: "on-time",
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      address: "Bureau principal",
    },
  },
  {
    id: 3,
    userId: 2,
    type: "check-in",
    timestamp: "2023-05-16T08:10:45",
    status: "late",
    location: {
      latitude: 48.858,
      longitude: 2.3505,
      address: "Entrée secondaire",
    },
  },
  {
    id: 4,
    userId: 2,
    type: "check-out",
    timestamp: "2023-05-16T17:30:22",
    status: "overtime",
    location: {
      latitude: 48.858,
      longitude: 2.3505,
      address: "Entrée secondaire",
    },
  },
  // Exemple de données pour Jane Smith
  {
    id: 5,
    userId: 3,
    type: "check-in",
    timestamp: "2023-05-15T07:55:18",
    status: "early",
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      address: "Bureau secondaire",
    },
  },
  {
    id: 6,
    userId: 3,
    type: "check-out",
    timestamp: "2023-05-15T16:45:30",
    status: "early",
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      address: "Bureau secondaire",
    },
  },
  {
    id: 7,
    userId: 3,
    type: "check-in",
    timestamp: "2023-05-16T08:05:22",
    status: "on-time",
    location: {
      latitude: 48.8584,
      longitude: 2.2945,
      address: "Bureau secondaire",
    },
  },
]

const reports: Report[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
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
  },
  {
    id: 3,
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
  },
]

// Simulation d'une base de données distribuée
// Dans une vraie implémentation, ces fonctions feraient des appels à différents nœuds
// de la base de données distribuée avec des mécanismes de cohérence et de réplication
export const db = {
  // Utilisateurs
  getUsers: () => {
    console.log("DB: Récupération de tous les utilisateurs depuis le cluster distribué")
    return [...users]
  },
  getUserById: (id: number) => {
    console.log(`DB: Récupération de l'utilisateur ${id} depuis le nœud approprié`)
    return users.find((u) => u.id === id) || null
  },
  getUserByEmail: (email: string) => {
    console.log(`DB: Recherche de l'utilisateur par email ${email} avec distribution de la charge`)
    return users.find((u) => u.email === email) || null
  },
  createUser: (user: Omit<User, "id">) => {
    console.log("DB: Création d'un nouvel utilisateur avec réplication sur plusieurs nœuds")
    const newUser = { ...user, id: users.length + 1 }
    users.push(newUser)
    return newUser
  },
  updateUser: (id: number, data: Partial<User>) => {
    console.log(`DB: Mise à jour de l'utilisateur ${id} avec propagation aux réplicas`)
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return null
    users[index] = { ...users[index], ...data }
    return users[index]
  },
  deleteUser: (id: number) => {
    console.log(`DB: Suppression de l'utilisateur ${id} avec synchronisation sur tous les nœuds`)
    const index = users.findIndex((u) => u.id === id)
    if (index === -1) return false
    users.splice(index, 1)
    return true
  },

  // Pointages
  getTimeRecords: () => {
    console.log("DB: Récupération de tous les pointages avec agrégation distribuée")
    return [...timeRecords]
  },
  getTimeRecordsByUserId: (userId: number) => {
    console.log(`DB: Récupération des pointages pour l'utilisateur ${userId} avec partitionnement par utilisateur`)
    return timeRecords.filter((r) => r.userId === userId)
  },
  createTimeRecord: (record: Omit<TimeRecord, "id">) => {
    console.log("DB: Création d'un nouveau pointage avec distribution géographique")
    const newRecord = { ...record, id: timeRecords.length + 1 }
    timeRecords.push(newRecord)
    return newRecord
  },
  deleteTimeRecordsByUserId: (userId: number) => {
    console.log(`DB: Suppression des pointages pour l'utilisateur ${userId} sur tous les nœuds`)
    timeRecords = timeRecords.filter((r) => r.userId !== userId)
    return true
  },

  // Rapports
  getReports: () => {
    console.log("DB: Récupération de tous les rapports avec distribution de la charge")
    return [...reports]
  },
  getReportsByUserId: (userId: number) => {
    console.log(`DB: Récupération des rapports pour l'utilisateur ${userId} avec partitionnement`)
    return reports.filter((r) => r.userId === userId)
  },
  createReport: (report: Omit<Report, "id">) => {
    console.log("DB: Création d'un nouveau rapport avec réplication synchrone")
    const newReport = { ...report, id: reports.length + 1 }
    reports.push(newReport)
    return newReport
  },
  deleteReport: (id: number) => {
    console.log(`DB: Suppression du rapport ${id} avec propagation aux réplicas`)
    const index = reports.findIndex((r) => r.id === id)
    if (index === -1) return false
    reports.splice(index, 1)
    return true
  },
}
