import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { FraudReportingWizard } from "@/components/fraud-reporting-wizard"

export default function ReportPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Report a Fraud Case</h1>
              <p className="text-xl text-muted-foreground text-pretty">
                Help us help you recover your funds by providing detailed information about the fraud incident.
              </p>
            </div>
            <FraudReportingWizard />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
