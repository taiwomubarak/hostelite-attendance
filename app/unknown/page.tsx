import Link from "next/link"
import { QrCode } from "lucide-react"

export default function UnknownPage() {
  return (
    <main className="wrap">
      <section className="span-12 result-head warn">
        <p className="page-kicker">
          <QrCode size={18} /> Unknown QR
        </p>
        <h1>Not a student</h1>
        <p className="lead">This QR code is not registered. Ask an admin to add the student first.</p>
        <div className="center-actions">
          <Link className="btn" href="/">
            Return to scan
          </Link>
        </div>
      </section>
    </main>
  )
}
