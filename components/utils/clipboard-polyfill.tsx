"use client"

import { useEffect } from "react"

export function ClipboardPolyfill() {
  useEffect(() => {
    try {
      const nav: any = typeof navigator !== "undefined" ? navigator : null
      if (!nav || !nav.clipboard) return

      const originalWriteText = nav.clipboard.writeText?.bind(nav.clipboard)
      if (!originalWriteText) return

      nav.clipboard.writeText = async (text: string) => {
        try {
          return await originalWriteText(text)
        } catch (err: any) {
          // Attempt a DOM-based fallback
          try {
            const textarea = document.createElement("textarea")
            textarea.value = String(text ?? "")
            textarea.style.position = "fixed"
            textarea.style.left = "-9999px"
            textarea.setAttribute("readonly", "")
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
            return
          } catch {
            // Swallow NotAllowedError in restricted iframes to avoid noisy console errors
            return
          }
        }
      }
    } catch {
      // no-op
    }
  }, [])

  return null
}
