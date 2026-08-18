import bcrypt from "bcryptjs"
import { isProduction } from "@/lib/env"
import { prisma } from "@/lib/prisma"

export async function ensureAdmin() {
  if (isProduction()) {
    return
  }

  const existing = await prisma.admin.findFirst()
  if (existing) {
    return
  }

  const username = process.env.ADMIN_USERNAME || "admin"
  const password = process.env.ADMIN_PASSWORD || "changeme"
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.admin.create({
    data: { username, passwordHash }
  })
}
