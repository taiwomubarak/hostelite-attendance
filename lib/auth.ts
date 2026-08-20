import { timingSafeEqual } from "node:crypto"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { looksLikePasswordHash, verifyPassword } from "@/lib/password"

const production = process.env.NODE_ENV === "production"

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  if (a.length !== b.length) {
    return false
  }
  return timingSafeEqual(a, b)
}

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
        const expectedUser = process.env.ADMIN_USERNAME || "admin"
        const passwordHash = process.env.ADMIN_PASSWORD_HASH || ""
        const plainPassword = production ? "" : process.env.ADMIN_PASSWORD || ""

        const username = String(credentials?.username ?? "")
        const password = String(credentials?.password ?? "")
        if (!username || !password) {
          return null
        }

        if (!safeEqual(username, expectedUser)) {
          return null
        }

        if (passwordHash && looksLikePasswordHash(passwordHash)) {
          if (!verifyPassword(password, passwordHash)) {
            return null
          }
          return { id: "env-admin", name: expectedUser }
        }

        if (!production && plainPassword && safeEqual(password, plainPassword)) {
          return { id: "env-admin", name: expectedUser }
        }

        return null
      }
    })
  ]
})
