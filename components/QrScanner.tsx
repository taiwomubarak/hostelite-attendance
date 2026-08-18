"use client"

import { Camera, Upload } from "lucide-react"
import { useEffect, useId, useRef, useState, type ChangeEvent } from "react"

type QrScannerProps = {
  onDecode: (payload: string) => void
  busy: boolean
}

export default function QrScanner({ onDecode, busy }: QrScannerProps) {
  const reactId = useId().replace(/:/g, "")
  const cameraId = `qr-reader-${reactId}`
  const fileId = `qr-file-${reactId}`
  const handled = useRef(false)
  const onDecodeRef = useRef(onDecode)
  const [camError, setCamError] = useState("")
  const [fileError, setFileError] = useState("")

  onDecodeRef.current = onDecode

  useEffect(() => {
    let active = true
    let scanner: { stop: () => Promise<void>; clear: () => void } | null = null

    async function start() {
      const { Html5Qrcode } = await import("html5-qrcode")
      if (!active || !document.getElementById(cameraId)) {
        return
      }

      const instance = new Html5Qrcode(cameraId)
      scanner = instance

      const onScan = (text: string) => {
        if (handled.current || !text.trim()) {
          return
        }
        handled.current = true
        instance
          .stop()
          .catch(() => undefined)
          .finally(() => onDecodeRef.current(text.trim()))
      }

      try {
        const cameras = await Html5Qrcode.getCameras()
        if (!cameras.length) {
          throw new Error("No camera")
        }
        const rear = cameras.find((item) => /back|rear|environment/i.test(item.label))
        const cameraIdToUse = rear?.id ?? cameras[0].id
        await instance.start(
          cameraIdToUse,
          {
            fps: 8,
            qrbox: (viewWidth: number, viewHeight: number) => {
              const edge = Math.max(140, Math.floor(Math.min(viewWidth, viewHeight) * 0.7))
              return { width: edge, height: edge }
            }
          },
          onScan,
          () => undefined
        )
      } catch {
        if (active) {
          setCamError("Camera could not start. Upload a photo of the QR code.")
        }
      }
    }

    start()

    return () => {
      active = false
      const current = scanner
      scanner = null
      if (!current) {
        return
      }
      current
        .stop()
        .catch(() => undefined)
        .finally(() => {
          try {
            current.clear()
          } catch {
            return
          }
        })
    }
  }, [cameraId])

  async function onFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file || busy || handled.current) {
      return
    }
    setFileError("")
    try {
      const { Html5Qrcode } = await import("html5-qrcode")
      const reader = new Html5Qrcode(fileId)
      const text = await reader.scanFile(file, false)
      reader.clear()
      if (!text.trim()) {
        setFileError("That image did not contain a readable QR code.")
        return
      }
      handled.current = true
      onDecode(text.trim())
    } catch {
      setFileError("That image did not contain a readable QR code.")
    }
  }

  return (
    <div className="stack-lg">
      <div className="panel stack">
        <p className="page-kicker">
          <Camera size={16} /> Live camera
        </p>
        <div id={cameraId} className="scanner-frame" />
        {camError ? <p className="hint">{camError}</p> : null}
      </div>
      <div className="panel stack">
        <p className="page-kicker">
          <Upload size={16} /> Photo of a QR code
        </p>
        <label className="file-btn">
          <Upload size={22} />
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} />
        </label>
        <div id={fileId} className="qr-file-host" />
        {fileError ? <p className="hint">{fileError}</p> : null}
      </div>
    </div>
  )
}
