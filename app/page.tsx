import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { ServicesSection } from "@/components/services-section"
import { TrustSection } from "@/components/trust-section"
import { CTABanner } from "@/components/cta-banner"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ServicesSection />
        <TrustSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
