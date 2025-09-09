"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bitcoin, CreditCard, FileSearch, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    icon: Bitcoin,
    title: "Crypto Recovery",
    description:
      "Specialized recovery services for cryptocurrency fraud, including wallet tracing and blockchain analysis.",
  },
  {
    icon: CreditCard,
    title: "Fiat Recovery",
    description: "Traditional financial fraud recovery through banking networks and payment processors.",
  },
  {
    icon: FileSearch,
    title: "Evidence Handling",
    description: "Professional evidence collection, preservation, and analysis for legal proceedings.",
  },
  {
    icon: ShieldCheck,
    title: "Prevention",
    description: "Educational resources and proactive measures to protect against future fraud attempts.",
  },
]

export function ServicesSection() {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Comprehensive fraud recovery solutions tailored to your specific situation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-accent" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm text-pretty">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
