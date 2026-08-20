const WEAK_SECRETS = new Set([
  "",
  "changeme",
  "hostelite-dev-secret-change-this-32chars",
  "replace-with-a-long-random-string",
  "generate-a-random-string-at-least-32-chars"
])

function normalizeOrigin(value: string) {
  const trimmed = value.trim().replace(/\/$/, "")
  if (!trimmed) {
    return ""
  }
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed
  }
  return `https://${trimmed}`
}

function looksLikePasswordHash(value: string) {
  return /^sha256\$[a-f0-9]{32}\$[a-f0-9]{64}$/i.test(value)
}

export function resolveAuthUrl() {
  const configured = normalizeOrigin(process.env.AUTH_URL || "")
  if (configured.startsWith("https://") || configured.startsWith("http://localhost")) {
    return configured
  }

  const vercel = normalizeOrigin(process.env.VERCEL_URL || "")
  if (vercel) {
    return vercel.startsWith("http") ? vercel : `https://${vercel.replace(/^https?:\/\//, "")}`
  }

  if (configured) {
    return configured
  }

  return "http://localhost:3000"
}

export function assertProductionEnv() {
  if (process.env.NODE_ENV !== "production") {
    return
  }

  const secret = process.env.AUTH_SECRET || ""
  if (secret.length < 32 || WEAK_SECRETS.has(secret)) {
    throw new Error("Set AUTH_SECRET to a random string of at least 32 characters")
  }

  const adminHash = process.env.ADMIN_PASSWORD_HASH || ""
  if (!looksLikePasswordHash(adminHash)) {
    throw new Error("Set ADMIN_PASSWORD_HASH to a sha256$salt$digest hash from npm run hash-password")
  }

  const authUrl = resolveAuthUrl()
  process.env.AUTH_URL = authUrl
}

export function isProduction() {
  return process.env.NODE_ENV === "production"
}
