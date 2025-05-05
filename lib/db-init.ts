import { db } from "./db-mysql"

export async function initializeDatabase() {
  try {
    // Create database tables if they don't exist
    await db.initDatabase()

    // Seed initial data if the database is empty
    await db.seedInitialData()

    console.log("Database initialization completed successfully")
    return { success: true }
  } catch (error) {
    console.error("Database initialization failed:", error)
    return { success: false, error }
  }
}
