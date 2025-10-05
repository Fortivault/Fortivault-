import type { NextRequest } from "next/server"

export async function middleware(_request: NextRequest) {
  return new Response(null, { status: 204 })
}

export const config = {
  matcher: [
    "/((?!_next/|_vercel/|favicon.ico|.*\\..*).*)",
  ],
}
