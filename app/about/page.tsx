import { Navigation } from "@/components/navigation"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"
import { CTABanner } from "@/components/cta-banner"
import { Shield, Users, Award, Clock } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">About Fortivault</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Built to protect. Trusted to Secure. We are the leading fraud recovery specialists dedicated to helping
                victims reclaim their funds and rebuild their financial security.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  At Fortivault, we believe that no one should suffer financial loss due to fraud. Our mission is to
                  provide comprehensive recovery services, advanced security solutions, and expert guidance to help
                  victims reclaim their funds and protect their financial future.
                </p>
                <p className="text-muted-foreground">
                  With years of experience in cybersecurity, financial recovery, and legal advocacy, our team combines
                  cutting-edge technology with personalized service to deliver results for our clients.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-card rounded-lg border">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Secure</h3>
                  <p className="text-sm text-muted-foreground">Bank-level security protocols</p>
                </div>
                <div className="text-center p-6 bg-card rounded-lg border">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Expert Team</h3>
                  <p className="text-sm text-muted-foreground">Certified recovery specialists</p>
                </div>
                <div className="text-center p-6 bg-card rounded-lg border">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Proven Results</h3>
                  <p className="text-sm text-muted-foreground">95% success rate</p>
                </div>
                <div className="text-center p-6 bg-card rounded-lg border">
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">24/7 Support</h3>
                  <p className="text-sm text-muted-foreground">Round-the-clock assistance</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TrustSection />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
