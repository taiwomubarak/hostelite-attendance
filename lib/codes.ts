import { randomBytes } from "node:crypto"
import { prisma } from "@/lib/prisma"

export async function createStudentCode() {
  for (let i = 0; i < 12; i += 1) {
    const code = `HST-${randomBytes(3).toString("hex").toUpperCase()}`
    const existing = await prisma.student.findUnique({ where: { code } })
    if (!existing) {
      return code
    }
  }
  throw new Error("Could not create a unique student code")
}

export function parseQrPayload(payload: string) {
  const trimmed = payload.trim()
  const prefix = "HOSTELITE:"
  if (trimmed.toUpperCase().startsWith(prefix)) {
    return trimmed.slice(prefix.length).trim().toUpperCase()
  }
  return trimmed.toUpperCase()
}

export function qrPayloadFor(code: string) {
  return `HOSTELITE:${code}`
}
