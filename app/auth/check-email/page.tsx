import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"
import Link from "next/link"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Check Your Email</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            We've sent you a confirmation link. Please check your email and click the link to verify your account.
          </p>
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or{" "}
            <Link href="/signup" className="text-primary hover:underline">
              try signing up again
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
