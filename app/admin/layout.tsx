import type { ReactNode } from "react"
import AdminNav from "@/components/AdminNav"
import { requireAdmin } from "@/lib/guard"

export default async function AdminLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  await requireAdmin()

  return (
    <>
      <AdminNav />
      {children}
    </>
  )
}
