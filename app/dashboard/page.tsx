import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { UserDashboard } from "@/components/user-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <div className="container px-4 mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Case Dashboard</h1>
                <p className="text-muted-foreground">Track your fraud recovery cases and view progress updates.</p>
              </div>
              <UserDashboard />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
