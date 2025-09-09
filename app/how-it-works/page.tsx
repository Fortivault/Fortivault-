import { Navigation } from "@/components/navigation"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { Footer } from "@/components/footer"
import { CTABanner } from "@/components/cta-banner"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">How Fortivault Works</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proven 3-step process helps fraud victims recover their funds and secure their financial future
            </p>
          </div>
        </div>
        <HowItWorksSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
