import { Navigation } from "@/components/navigation"
import { ServicesSection } from "@/components/services-section"
import { Footer } from "@/components/footer"
import { CTABanner } from "@/components/cta-banner"

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Our Services</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive fraud recovery and financial protection services tailored to your needs
            </p>
          </div>
        </div>
        <ServicesSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
