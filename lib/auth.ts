import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { ensureAdmin } from "@/lib/ensure-admin"
import { prisma } from "@/lib/prisma"

const production = process.env.NODE_ENV === "production"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  useSecureCookies: production,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await ensureAdmin()
        const username = String(credentials?.username ?? "")
        const password = String(credentials?.password ?? "")
        if (!username || !password) {
          return null
        }

        const admin = await prisma.admin.findUnique({ where: { username } })
        if (!admin) {
          return null
        }

        const ok = await bcrypt.compare(password, admin.passwordHash)
        if (!ok) {
          return null
        }

        return { id: admin.id, name: admin.username }
      }
    })
  ]
})
