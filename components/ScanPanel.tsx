"use client"

import dynamic from "next/dynamic"
import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"

const QrScanner = dynamic(() => import("@/components/QrScanner"), { ssr: false })

type ScanPanelProps = {
  from: "kiosk" | "admin"
}

export default function ScanPanel({ from }: ScanPanelProps) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")

  const onDecode = useCallback(
    async (payload: string) => {
      if (busy) {
        return
      }
      setBusy(true)
      setError("")
      if (!payload.trim()) {
        setBusy(false)
        return
      }
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload })
        })
        const data = await res.json()
        if (!res.ok || !data.ok) {
          router.push("/unknown")
          return
        }
        const status = data.already ? "already" : "attended"
        const token = encodeURIComponent(String(data.token || ""))
        router.push(`/result/${data.code}?status=${status}&from=${from}&t=${token}`)
      } catch {
        setBusy(false)
        setError("Scan could not be saved. Try again.")
      }
    },
    [busy, from, router]
  )

  return (
    <div className="stack-lg">
      {error ? <p className="error-banner">{error}</p> : null}
      <QrScanner onDecode={onDecode} busy={busy} />
    </div>
  )
}
