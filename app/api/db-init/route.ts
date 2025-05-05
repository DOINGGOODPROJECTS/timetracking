import { NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db-init"

// This endpoint is used to initialize the database
// It should be called once when the application is first deployed
export async function GET() {
  try {
    const result = await initializeDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database initialized successfully" })
    } else {
      return NextResponse.json({ error: "Database initialization failed", details: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
