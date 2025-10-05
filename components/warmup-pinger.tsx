"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface WarmupGateProps {
  children: React.ReactNode
  minDelayMs?: number
  maxWaitMs?: number
}

function timeout(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms)
    if (signal) {
      signal.addEventListener(
        "abort",
        () => {
          clearTimeout(id)
          reject(new DOMException("Aborted", "AbortError"))
        },
        { once: true },
      )
    }
  })
}

async function ping(url: string, signal: AbortSignal): Promise<Response> {
  try {
    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      keepalive: true,
      signal,
    })
    return res
  } catch (e) {
    // Try a HEAD as fallback to still wake the route runtime
    const res = await fetch(url, {
      method: "HEAD",
      cache: "no-store",
      keepalive: true,
      signal,
    })
    return res
  }
}

export function WarmupGate({ children, minDelayMs = 800, maxWaitMs = 2500 }: WarmupGateProps) {
  const [ready, setReady] = useState(false)
  const started = useRef(false)

  const targets = useMemo(
    () => [
      "/api/env-health",
      "/api/submit-case",
      "/api/send-otp",
      "/api/verify-otp",
    ],
    [],
  )

  useEffect(() => {
    if (started.current) return
    started.current = true

    const abort = new AbortController()

    const doWarmup = async () => {
      const minDelay = timeout(minDelayMs, abort.signal)
      const perReqTimeout = 1500

      const pings = targets.map(async (url) => {
        const controller = new AbortController()
        const t = setTimeout(() => controller.abort(), perReqTimeout)
        try {
          const res = await ping(url, controller.signal)
          return res
        } finally {
          clearTimeout(t)
        }
      })

      // We consider warmed when at least one ping settles (even 405/404 warms the runtime)
      const anySettled = Promise.race([
        Promise.any(pings).catch(() => undefined),
        timeout(1200, abort.signal),
      ])

      // Also cap the total wait time
      const cap = timeout(maxWaitMs, abort.signal)

      await Promise.race([Promise.allSettled([anySettled, minDelay]), cap])
      if (!abort.signal.aborted) setReady(true)
    }

    doWarmup()
    return () => abort.abort()
  }, [minDelayMs, maxWaitMs, targets])

  if (!ready) {
    return (
      <Card className="text-center">
        <CardContent className="p-8 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Preparing system…</p>
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
