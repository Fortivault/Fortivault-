"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, UserCheck } from "lucide-react"
import { useAgentAuth } from "@/hooks/use-agent-auth"

export default function AgentLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAgentAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(formData.email, formData.password)
      if (!success) {
        setError("Invalid agent credentials")
      }
    } catch (error) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-2 border-blue-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-6 h-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">Agent Portal</h1>
          <p className="text-sm text-muted-foreground">Recovery Specialist Access</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Agent Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your agent email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Agent Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Access Agent Portal"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
