"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-primary text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Built to protect. Trusted to Secure
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance mb-6">
              Report scams. <span className="text-primary">Recover funds.</span> Protect your money.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              We support victims of crypto and fiat fraud with secure reporting and recovery guidance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/report">
                Report a Case
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Link href="/how-it-works">
                How Recovery Works
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          >
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">$2.4M+</div>
              <div className="text-sm text-muted-foreground">Funds Recovered</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <div className="text-sm text-muted-foreground">Cases Resolved</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-muted-foreground">Expert Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
