import Link from "next/link"
import { ClipboardList, UserPlus } from "lucide-react"
import { formatTime, todayStamp } from "@/lib/dates"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function RosterPage() {
  const date = todayStamp()
  const students = await prisma.student.findMany({
    orderBy: { name: "asc" },
    include: {
      attendance: {
        where: { date }
      }
    }
  })

  const present = students.filter((student) => student.attendance.length > 0)
  const waiting = students.filter((student) => student.attendance.length === 0)

  return (
    <main className="wrap">
      <header className="span-12 section-head">
        <div className="stack">
          <p className="page-kicker">
            <ClipboardList size={16} /> Today
          </p>
          <h1 className="page-title">Roster</h1>
          <p className="lead">Students marked present today, and those not yet scanned.</p>
        </div>
        <Link className="btn" href="/admin/students/new">
          <UserPlus size={18} />
          Add student
        </Link>
      </header>

      <section className="span-6 stack">
        <h2>Present ({present.length})</h2>
        <div className="roster-grid">
          {present.length === 0 ? (
            <p className="span-12 meta">No scans yet today.</p>
          ) : (
            present.map((student) => (
              <Link key={student.id} className="roster-row" href={`/admin/students/${student.id}`}>
                <img src={student.imagePath} alt={student.name} />
                <div>
                  <h3 className="font-display">{student.name}</h3>
                  <p className="meta">Room {student.room}</p>
                </div>
                <span className="status-pill status-present">
                  {formatTime(student.attendance[0].scannedAt)}
                </span>
              </Link>
            ))
          )}
        </div>
      </section>

      <section className="span-6 stack">
        <h2>Not yet present ({waiting.length})</h2>
        <div className="roster-grid">
          {waiting.length === 0 && students.length > 0 ? (
            <p className="span-12 meta">Every registered student is present today.</p>
          ) : waiting.length === 0 ? (
            <p className="span-12 meta">No students have been added yet.</p>
          ) : (
            waiting.map((student) => (
              <Link key={student.id} className="roster-row" href={`/admin/students/${student.id}`}>
                <img src={student.imagePath} alt={student.name} />
                <div>
                  <h3 className="font-display">{student.name}</h3>
                  <p className="meta">Room {student.room}</p>
                </div>
                <span className="status-pill status-wait">Waiting</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
