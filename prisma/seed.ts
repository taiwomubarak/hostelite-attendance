import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const username = process.env.ADMIN_USERNAME || "admin"
  const password = process.env.ADMIN_PASSWORD || ""

  if (process.env.NODE_ENV === "production") {
    if (password.length < 12 || password === "changeme") {
      throw new Error("Set ADMIN_PASSWORD to at least 12 characters before seeding production")
    }
  }

  const usablePassword = password || "changeme"
  const passwordHash = await bcrypt.hash(usablePassword, 12)

  await prisma.admin.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash }
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
