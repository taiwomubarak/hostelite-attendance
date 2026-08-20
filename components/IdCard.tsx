import type { StudentCardData } from "@/lib/types"

type IdCardProps = {
  student: StudentCardData
  qrDataUrl: string
}

export default function IdCard({ student, qrDataUrl }: IdCardProps) {
  return (
    <article className="id-card">
      <div className="id-top-bar" />
      <header className="id-header">
        <h2 className="id-brand font-display">Hostelite</h2>
        <p className="id-sub">Student Identity Card</p>
      </header>
      <div className="id-body">
        <div className="id-photo-wrap">
          <img className="id-photo" src={student.imagePath} alt={student.name} />
        </div>
        <div className="id-info">
          <h3 className="id-name font-display">{student.name}</h3>
          <p className="id-code">{student.code}</p>
          <div className="id-fields">
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
              <span>Level</span>
              <strong>{student.academicLevel}</strong>
            </div>
          </div>
        </div>
      </div>
      <footer className="id-footer">
        <img className="id-qr" src={qrDataUrl} alt={`QR code for ${student.name}`} />
        <p className="id-scan-hint">Scan for daily attendance</p>
      </footer>
      <div className="id-bottom-bar" />
    </article>
  )
}
