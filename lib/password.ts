import { createHash, randomBytes, timingSafeEqual } from "node:crypto"

const HASH_PREFIX = "sha256"
const SEP = "."

function pepper() {
  return process.env.ADMIN_PASSWORD_PEPPER || process.env.AUTH_SECRET || ""
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const pep = pepper()
  if (!pep) {
    throw new Error("Set AUTH_SECRET or ADMIN_PASSWORD_PEPPER before hashing")
  }
  const digest = createHash("sha256")
    .update(pep, "utf8")
    .update(":")
    .update(salt, "utf8")
    .update(":")
    .update(password, "utf8")
    .digest("hex")
  return `${HASH_PREFIX}${SEP}${salt}${SEP}${digest}`
}

export function verifyPassword(password: string, stored: string) {
  if (!password || !stored || !looksLikePasswordHash(stored)) {
    return false
  }
  const parts = stored.split(SEP)
  if (parts.length !== 3 || parts[0] !== HASH_PREFIX) {
    return false
  }
  const [, salt] = parts
  const expected = hashPassword(password, salt)
  const left = Buffer.from(expected)
  const right = Buffer.from(stored)
  if (left.length !== right.length) {
    return false
  }
  return timingSafeEqual(left, right)
}

export function looksLikePasswordHash(value: string) {
  return /^sha256\.[a-f0-9]{32}\.[a-f0-9]{64}$/i.test(value)
}
