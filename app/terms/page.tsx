import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using Fortivault's services, you agree to be bound by these Terms of Service and all
              applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
            <p className="text-muted-foreground mb-4">
              Fortivault provides fraud recovery consultation and assistance services. We do not guarantee specific
              outcomes but will use our best efforts to assist in fund recovery.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Client Responsibilities</h2>
            <p className="text-muted-foreground mb-4">
              Clients must provide accurate and complete information about their fraud case. Any false or misleading
              information may result in termination of services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Privacy and Confidentiality</h2>
            <p className="text-muted-foreground mb-4">
              All client information is treated with strict confidentiality and is protected under our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us at fortivault@aol.com or +14582983729.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
