"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"
import type { WizardData } from "@/components/fraud-reporting-wizard"

interface TransactionStepProps {
  data: WizardData
  updateData: (updates: Partial<WizardData>) => void
}

export function TransactionStep({ data, updateData }: TransactionStepProps) {
  const [newHash, setNewHash] = useState("")
  const [newReference, setNewReference] = useState("")

  const addTransactionHash = () => {
    if (newHash.trim()) {
      updateData({
        transactionHashes: [...data.transactionHashes, newHash.trim()],
      })
      setNewHash("")
    }
  }

  const removeTransactionHash = (index: number) => {
    updateData({
      transactionHashes: data.transactionHashes.filter((_, i) => i !== index),
    })
  }

  const addBankReference = () => {
    if (newReference.trim()) {
      updateData({
        bankReferences: [...data.bankReferences, newReference.trim()],
      })
      setNewReference("")
    }
  }

  const removeBankReference = (index: number) => {
    updateData({
      bankReferences: data.bankReferences.filter((_, i) => i !== index),
    })
  }

  if (data.scamType === "crypto") {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Cryptocurrency Transaction Information</h3>
          <p className="text-muted-foreground mb-4">
            Please provide any transaction hashes (TXIDs) related to the fraudulent transfers.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter transaction hash (TXID)"
              value={newHash}
              onChange={(e) => setNewHash(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTransactionHash()}
            />
            <Button onClick={addTransactionHash} disabled={!newHash.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {data.transactionHashes.length > 0 && (
            <div className="space-y-2">
              <Label>Transaction Hashes:</Label>
              <div className="flex flex-wrap gap-2">
                {data.transactionHashes.map((hash, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    <span className="font-mono text-xs">{hash.slice(0, 16)}...</span>
                    <button onClick={() => removeTransactionHash(index)} className="hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bank Transfer Information</h3>
        <p className="text-muted-foreground mb-4">
          Please provide any bank transfer references, wire transfer numbers, or payment confirmation numbers.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter reference number"
            value={newReference}
            onChange={(e) => setNewReference(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addBankReference()}
          />
          <Button onClick={addBankReference} disabled={!newReference.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {data.bankReferences.length > 0 && (
          <div className="space-y-2">
            <Label>Bank References:</Label>
            <div className="flex flex-wrap gap-2">
              {data.bankReferences.map((ref, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2">
                  <span>{ref}</span>
                  <button onClick={() => removeBankReference(index)} className="hover:text-destructive">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
