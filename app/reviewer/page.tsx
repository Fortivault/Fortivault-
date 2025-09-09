import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ReviewerDashboard } from "@/components/reviewer-dashboard"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ReviewerPage() {
  return (
    <ProtectedRoute requiredRole="reviewer">
      <div className="min-h-screen">
        <Navigation />
        <main className="py-8">
          <div className="container px-4 mx-auto">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Reviewer Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage fraud recovery cases and assist victims with their claims.
                </p>
              </div>
              <ReviewerDashboard />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
