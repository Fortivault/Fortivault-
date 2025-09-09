"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function CTABanner() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
            <Clock className="w-4 h-4 mr-2" />
            Time is critical in fraud recovery
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-balance">Lost funds? Don't wait — report now.</h2>
          <p className="text-xl mb-8 text-primary-foreground/80 text-pretty max-w-2xl mx-auto">
            Every moment counts in fraud recovery. The sooner you report, the better your chances of recovering your
            funds.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href="/report">
              Start Your Recovery
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
