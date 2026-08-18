"use server"

import { AuthError } from "next-auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { signIn, signOut } from "@/lib/auth"
import { allowRequest, clientIpFromHeaders } from "@/lib/rate-limit"

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  )
}

export async function loginAction(formData: FormData) {
  const headerList = await headers()
  const ip = clientIpFromHeaders(headerList)
  if (!allowRequest(`login:${ip}`, 5, 15 * 60 * 1000)) {
    redirect("/login?error=2")
  }

  try {
    await signIn("credentials", {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin"
    })
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error
    }
    if (error instanceof AuthError) {
      redirect("/login?error=1")
    }
    redirect("/login?error=1")
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
