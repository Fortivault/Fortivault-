import { randomBytes } from "crypto"

export function generateCSRFToken(): string {
  return randomBytes(32).toString("hex")
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length === 64
}
