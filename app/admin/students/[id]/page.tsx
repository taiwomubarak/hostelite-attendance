import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, IdCard as IdCardIcon } from "lucide-react"
import DeleteStudentButton from "@/components/DeleteStudentButton"
import IdCard from "@/components/IdCard"
import StudentForm from "@/components/StudentForm"
import { prisma } from "@/lib/prisma"
import { makeQrDataUrl } from "@/lib/qr"

export const dynamic = "force-dynamic"

export default async function StudentDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await prisma.student.findUnique({ where: { id } })
  if (!student) {
    notFound()
  }

  const qrDataUrl = await makeQrDataUrl(student.code)

  return (
    <main className="wrap">
      <header className="span-12 section-head">
        <div className="stack">
          <p className="page-kicker">
            <IdCardIcon size={16} /> Student record
          </p>
          <h1 className="page-title">{student.name}</h1>
          <p className="lead">Edit details below. The ID card updates when you save.</p>
        </div>
        <div className="actions">
          <Link className="btn btn-ghost" href={`/admin/students/${student.id}/history`}>
            <CalendarDays size={18} />
            Attendance history
          </Link>
          <DeleteStudentButton id={student.id} name={student.name} />
        </div>
      </header>
      <section className="span-12 id-stage">
        <IdCard student={student} qrDataUrl={qrDataUrl} />
      </section>
      <section className="span-12">
        <StudentForm student={student} />
      </section>
    </main>
  )
}
