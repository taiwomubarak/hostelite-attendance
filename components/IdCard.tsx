import type { StudentCardData } from "@/lib/types"

type IdCardProps = {
  student: StudentCardData
  qrDataUrl: string
}

export default function IdCard({ student, qrDataUrl }: IdCardProps) {
  return (
    <article className="id-card">
      <header className="id-header">
        <p>Hostel ID</p>
        <h2>Hostelite Attendance</h2>
      </header>
      <div className="id-body">
        <img className="id-photo" src={student.imagePath} alt={student.name} />
        <div className="id-facts">
          <h3 className="id-name font-display">{student.name}</h3>
          <p className="id-code">{student.code}</p>
          <div className="id-field">
            <span>Room</span>
            <strong>{student.room}</strong>
          </div>
          <div className="id-field">
            <span>Sex</span>
            <strong>{student.sex}</strong>
          </div>
          <div className="id-field">
            <span>Age</span>
            <strong>{student.age}</strong>
          </div>
          <div className="id-field">
            <span>Academic Level</span>
            <strong>{student.academicLevel}</strong>
          </div>
        </div>
      </div>
      <div className="id-footer">
        <p>Present this card for daily scan in.</p>
        <img className="id-qr" src={qrDataUrl} alt={`QR code for ${student.name}`} />
      </div>
      <div className="id-accent" />
    </article>
  )
}
