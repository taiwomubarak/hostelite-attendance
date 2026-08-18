import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, CalendarDays } from "lucide-react"
import { formatDay, formatTime } from "@/lib/dates"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function StudentHistoryPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      attendance: { orderBy: { date: "desc" } }
    }
  })
  if (!student) {
    notFound()
  }

  return (
    <main className="wrap">
      <header className="span-12 stack">
        <p className="page-kicker">
          <CalendarDays size={16} /> Attendance
        </p>
        <h1 className="page-title">{student.name}</h1>
        <p className="lead">Every day this student has scanned in.</p>
        <div className="actions">
          <Link className="btn btn-ghost" href={`/admin/students/${student.id}`}>
            <ArrowLeft size={18} />
            Back to student
          </Link>
        </div>
      </header>
      <section className="span-12">
        {student.attendance.length === 0 ? (
          <div className="panel">
            <p className="meta">No attendance days yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {student.attendance.map((row) => (
              <article key={row.id} className="history-item">
                <h2>{formatDay(row.date)}</h2>
                <p className="meta">Scanned at {formatTime(row.scannedAt)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
