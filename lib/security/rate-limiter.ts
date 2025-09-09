interface RateLimitConfig {
  windowMs: number
  maxRequests: number
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const windowStart = now - config.windowMs

    // Get existing requests for this identifier
    const userRequests = this.requests.get(identifier) || []

    // Filter out requests outside the current window
    const validRequests = userRequests.filter((time) => time > windowStart)

    // Check if under limit
    if (validRequests.length >= config.maxRequests) {
      return false
    }

    // Add current request
    validRequests.push(now)
    this.requests.set(identifier, validRequests)

    return true
  }

  cleanup(): void {
    const now = Date.now()
    for (const [identifier, requests] of this.requests.entries()) {
      const validRequests = requests.filter((time) => time > now - 3600000) // Keep 1 hour
      if (validRequests.length === 0) {
        this.requests.delete(identifier)
      } else {
        this.requests.set(identifier, validRequests)
      }
    }
  }
}

export const rateLimiter = new RateLimiter()

// Cleanup old entries every 10 minutes
setInterval(() => rateLimiter.cleanup(), 600000)
