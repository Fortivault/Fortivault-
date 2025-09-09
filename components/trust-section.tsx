"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Lock, Eye, Users } from "lucide-react"
import { motion } from "framer-motion"

const trustFactors = [
  {
    icon: Lock,
    title: "Security",
    description: "Bank-level encryption and secure data handling protocols protect your sensitive information.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Complete visibility into our process with regular updates and detailed case reporting.",
  },
  {
    icon: Users,
    title: "Expert Team",
    description: "Certified fraud investigators and recovery specialists with decades of combined experience.",
  },
]

export function TrustSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Trust Us</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Your security and success are our top priorities. Here's what sets us apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {trustFactors.map((factor, index) => (
            <motion.div
              key={factor.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full text-center p-6">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <factor.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{factor.title}</h3>
                  <p className="text-muted-foreground text-pretty">{factor.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
