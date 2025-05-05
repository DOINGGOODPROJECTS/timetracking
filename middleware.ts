import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login"

  // Get the token from the cookies
  const userId = request.cookies.get("userId")?.value

  // If the path is a public path and the user is logged in, redirect to dashboard
  if (isPublicPath && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If the path is not a public path and the user is not logged in, redirect to login
  if (!isPublicPath && !userId && !path.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/((?!api/db-init|_next/static|_next/image|favicon.ico).*)"],
}
