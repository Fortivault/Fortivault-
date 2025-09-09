import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProviderWrapper } from "@/components/auth/auth-provider"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fortivault - Built to protect. Trusted to Secure",
  description:
    "Built to protect. Trusted to Secure. Professional fraud recovery and scam reporting platform. We support victims of crypto and fiat fraud with secure reporting and recovery guidance.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <AuthProviderWrapper>{children}</AuthProviderWrapper>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
