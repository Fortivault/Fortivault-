import { Navigation } from "@/components/navigation"
import dynamic from "next/dynamic"
import { Footer } from "@/components/footer"

const HeroSection = dynamic(() => import("@/components/hero-section").then((m) => m.HeroSection), { ssr: false })
const HowItWorksSection = dynamic(
  () => import("@/components/how-it-works-section").then((m) => m.HowItWorksSection),
  { ssr: false },
)
const ServicesSection = dynamic(() => import("@/components/services-section").then((m) => m.ServicesSection), {
  ssr: false,
})
const TrustSection = dynamic(() => import("@/components/trust-section").then((m) => m.TrustSection), { ssr: false })
const CTABanner = dynamic(() => import("@/components/cta-banner").then((m) => m.CTABanner), { ssr: false })

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
