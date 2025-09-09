import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Lead Recovery Specialist",
      experience: "8+ years",
      specialization: "Cryptocurrency Recovery",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Rodriguez",
      role: "Fraud Investigation Director",
      experience: "12+ years",
      specialization: "Banking & Wire Fraud",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Dr. Emily Watson",
      role: "Legal Counsel",
      experience: "15+ years",
      specialization: "Financial Law & Compliance",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Our Expert Team</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet the dedicated professionals who work tirelessly to recover your funds and bring fraudsters to justice.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <img
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.role}</p>
                <Badge variant="secondary" className="mb-3">
                  {member.experience}
                </Badge>
                <p className="text-muted-foreground">{member.specialization}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
