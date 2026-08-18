import Link from "next/link"
import { UserPlus, Users } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function StudentsPage() {
  const students = await prisma.student.findMany({ orderBy: { name: "asc" } })

  return (
    <main className="wrap">
      <header className="span-12 section-head">
        <div className="stack">
          <p className="page-kicker">
            <Users size={16} /> Directory
          </p>
          <h1 className="page-title">Students</h1>
          <p className="lead">Open a student to edit details, view the ID card, or see attendance history.</p>
        </div>
        <Link className="btn" href="/admin/students/new">
          <UserPlus size={18} />
          Add student
        </Link>
      </header>
      <section className="span-12">
        {students.length === 0 ? (
          <div className="panel">
            <p className="meta">No students yet. Add a name, photo, room, and academic level to generate a QR code.</p>
          </div>
        ) : (
          <div className="tile-grid">
            {students.map((student) => (
              <Link key={student.id} className="student-tile" href={`/admin/students/${student.id}`}>
                <img src={student.imagePath} alt={student.name} />
                <div className="student-tile-body">
                  <h3>{student.name}</h3>
                  <p className="meta">Room {student.room}</p>
                  <p className="meta">Academic Level {student.academicLevel}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
