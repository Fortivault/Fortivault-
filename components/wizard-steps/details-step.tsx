"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { WizardData } from "@/components/fraud-reporting-wizard"

interface DetailsStepProps {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
}

const currencies = [
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
  { value: "BTC", label: "Bitcoin (BTC)" },
  { value: "ETH", label: "Ethereum (ETH)" },
  { value: "USDT", label: "Tether (USDT)" },
  { value: "other", label: "Other" },
]

const timeframes = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this-week", label: "This week" },
  { value: "last-week", label: "Last week" },
  { value: "this-month", label: "This month" },
  { value: "1-3-months", label: "1-3 months ago" },
  { value: "3-6-months", label: "3-6 months ago" },
  { value: "6-months-plus", label: "More than 6 months ago" },
]

export function DetailsStep({ data, updateData }: DetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount Lost *</Label>
          <Input
            id="amount"
            type="number"
            placeholder="Enter amount"
            value={data.amount}
            onChange={(e) => updateData({ amount: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select value={data.currency} onValueChange={(value) => updateData({ currency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline">When did this occur? *</Label>
        <Select value={data.timeline} onValueChange={(value) => updateData({ timeline: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            {timeframes.map((timeframe) => (
              <SelectItem key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          placeholder="Please provide a detailed description of what happened, including how you were contacted, what you were promised, and how the fraud occurred..."
          className="min-h-[120px]"
          value={data.description}
          onChange={(e) => updateData({ description: e.target.value })}
        />
        <p className="text-sm text-muted-foreground">
          Include as much detail as possible. This helps our team understand your case better.
        </p>
      </div>
    </div>
  )
}
