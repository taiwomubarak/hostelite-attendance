import { createHmac, timingSafeEqual } from "crypto"

function secret() {
  const value = process.env.AUTH_SECRET
  if (!value) {
    throw new Error("AUTH_SECRET is required")
  }
  return value
}

export function makeScanToken(code: string) {
  const exp = Date.now() + 5 * 60 * 1000
  const body = `${code}.${exp}`
  const sig = createHmac("sha256", secret()).update(body).digest("hex")
  return `${body}.${sig}`
}

export function verifyScanToken(token: string, code: string) {
  const lastDot = token.lastIndexOf(".")
  if (lastDot <= 0) {
    return false
  }
  const body = token.slice(0, lastDot)
  const sig = token.slice(lastDot + 1)
  const parts = body.split(".")
  if (parts.length !== 2) {
    return false
  }
  const [tokenCode, expRaw] = parts
  if (tokenCode !== code) {
    return false
  }
  const exp = Number(expRaw)
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return false
  }
  const expected = createHmac("sha256", secret()).update(body).digest("hex")
  const left = Buffer.from(sig, "hex")
  const right = Buffer.from(expected, "hex")
  if (left.length === 0 || left.length !== right.length) {
    return false
  }
  return timingSafeEqual(left, right)
}
