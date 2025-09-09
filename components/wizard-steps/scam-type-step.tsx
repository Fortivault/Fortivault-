"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bitcoin, CreditCard, AlertTriangle } from "lucide-react"
import type { WizardData } from "@/components/fraud-reporting-wizard"

interface ScamTypeStepProps {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
}

const scamTypes = [
  {
    id: "crypto",
    title: "Cryptocurrency Fraud",
    description: "Bitcoin, Ethereum, or other digital currency scams",
    icon: Bitcoin,
  },
  {
    id: "fiat",
    title: "Traditional Financial Fraud",
    description: "Bank transfers, credit cards, or wire fraud",
    icon: CreditCard,
  },
  {
    id: "other",
    title: "Other Fraud Types",
    description: "Investment scams, romance scams, or other fraud",
    icon: AlertTriangle,
  },
]

export function ScamTypeStep({ data, updateData }: ScamTypeStepProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scamTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              data.scamType === type.id ? "ring-2 ring-primary bg-primary/5" : ""
            }`}
            onClick={() => updateData({ scamType: type.id })}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 mx-auto bg-accent/10 rounded-lg flex items-center justify-center">
                <type.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">{type.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{type.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
