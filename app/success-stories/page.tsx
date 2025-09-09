import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Clock, CheckCircle } from "lucide-react"

export default function SuccessStoriesPage() {
  const stories = [
    {
      amount: "$125,000",
      type: "Cryptocurrency Scam",
      timeframe: "3 months",
      recovery: "98%",
      description:
        "Client fell victim to a fake investment platform. Our team traced the blockchain transactions and recovered nearly all funds through legal channels.",
    },
    {
      amount: "$85,000",
      type: "Romance Scam",
      timeframe: "2 months",
      recovery: "100%",
      description:
        "Victim was manipulated into wire transfers. We worked with international banks to freeze and recover all transferred funds.",
    },
    {
      amount: "$200,000",
      type: "Business Email Compromise",
      timeframe: "6 weeks",
      recovery: "95%",
      description:
        "Company CFO received fraudulent wire instructions. Quick action and our banking partnerships enabled rapid fund recovery.",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real recoveries from real victims. See how Fortivault has helped people reclaim their stolen funds.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span className="text-2xl font-bold text-accent">{story.amount}</span>
                  </div>
                  <Badge variant="outline">{story.recovery} recovered</Badge>
                </div>

                <h3 className="text-lg font-semibold mb-2">{story.type}</h3>

                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{story.timeframe}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Resolved</span>
                  </div>
                </div>

                <p className="text-muted-foreground">{story.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
