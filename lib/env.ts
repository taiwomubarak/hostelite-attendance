const WEAK_SECRETS = new Set([
  "",
  "changeme",
  "hostelite-dev-secret-change-this-32chars",
  "replace-with-a-long-random-string",
  "generate-a-random-string-at-least-32-chars"
])

export function resolveAuthUrl() {
  const configured = (process.env.AUTH_URL || "").trim().replace(/\/$/, "")
  if (configured) {
    return configured
  }

  const vercel = (process.env.VERCEL_URL || "").trim().replace(/\/$/, "")
  if (vercel) {
    return `https://${vercel}`
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

  const authUrl = resolveAuthUrl()
  if (!process.env.AUTH_URL) {
    process.env.AUTH_URL = authUrl
  }

  if (!authUrl.startsWith("https://") && !authUrl.startsWith("http://localhost")) {
    throw new Error("Set AUTH_URL to your https origin")
  }
}

export function isProduction() {
  return process.env.NODE_ENV === "production"
}
