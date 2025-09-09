"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Search, Zap } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
  {
    icon: FileText,
    title: "Submit",
    description: "Report your case with detailed information about the fraud incident and upload supporting evidence.",
  },
  {
    icon: Search,
    title: "Review",
    description: "Our expert team analyzes your case, verifies evidence, and develops a recovery strategy.",
  },
  {
    icon: Zap,
    title: "Action",
    description: "We execute the recovery plan, working with authorities and financial institutions on your behalf.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground text-pretty">
            Our streamlined process ensures efficient case handling and maximum recovery potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="relative h-full text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-accent" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
