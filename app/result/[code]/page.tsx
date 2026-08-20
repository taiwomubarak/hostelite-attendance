import Link from "next/link"
import { redirect } from "next/navigation"
import { Check } from "lucide-react"
import IdCard from "@/components/IdCard"
import { prisma } from "@/lib/prisma"
import { makeQrDataUrl } from "@/lib/qr"
import { verifyScanToken } from "@/lib/scan-token"

export const dynamic = "force-dynamic"

export default async function ResultPage({
  params,
  searchParams
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ status?: string; from?: string; t?: string }>
}) {
  let code: string
  let query: { status?: string; from?: string; t?: string }

  try {
    const p = await params
    code = p.code
    query = await searchParams
  } catch {
    redirect("/unknown")
  }

  const token = String(query.t ?? "")
  if (!token || !verifyScanToken(token, code)) {
    redirect("/unknown")
  }

  const student = await prisma.student.findUnique({ where: { code } })
  if (!student) {
    redirect("/unknown")
  }

  const qrDataUrl = await makeQrDataUrl(student.code)
  const already = query.status === "already"
  const backHref = query.from === "admin" ? "/admin/scan" : "/"
  const heading = already ? "Already marked present today" : "Attended"

  return (
    <main className="wrap">
      <section className="span-12 result-head">
        <p className="page-kicker">
          <Check size={18} /> Scan complete
        </p>
        <h1>{heading}</h1>
      </section>
      <section className="span-12 id-stage">
        <IdCard student={student} qrDataUrl={qrDataUrl} />
      </section>
      <section className="span-12 center-actions">
        <Link className="btn" href={backHref}>
          Scan another
        </Link>
      </section>
    </main>
  )
}
