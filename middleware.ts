import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Exclude all Next.js internals and any file with an extension
    // This ensures middleware only runs for actual application routes
    "/((?!_next/|_vercel/|favicon.ico|.*\\..*).*)",
  ],
}
