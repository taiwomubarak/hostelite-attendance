import { UserPlus } from "lucide-react"
import StudentForm from "@/components/StudentForm"

export default function NewStudentPage() {
  return (
    <main className="wrap">
      <header className="span-12 stack">
        <p className="page-kicker">
          <UserPlus size={16} /> New record
        </p>
        <h1 className="page-title">Add student</h1>
        <p className="lead">A unique QR code is created when you save. It appears on the student ID card.</p>
      </header>
      <section className="span-12">
        <StudentForm />
      </section>
    </main>
  )
}
