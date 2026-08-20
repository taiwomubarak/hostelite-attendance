import bcrypt from "bcryptjs"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  if (!password || !passwordHash) {
    return false
  }
  return bcrypt.compare(password, passwordHash)
}

export function looksLikeBcryptHash(value: string) {
  return /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value)
}
