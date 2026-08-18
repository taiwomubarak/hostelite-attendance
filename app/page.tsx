import Link from "next/link"
import { ScanLine } from "lucide-react"
import ScanPanel from "@/components/ScanPanel"

export default function HomePage() {
  return (
    <main className="wrap">
      <header className="span-12 site-header">
        <div className="stack">
          <p className="page-kicker">Daily hostel scan in</p>
          <h1 className="page-title">Hostelite Attendance</h1>
          <p className="lead">
            Point the camera at a student QR code. If the student is registered, they are marked present for today.
          </p>
        </div>
        <Link className="btn btn-ghost" href="/login">
          Admin login
        </Link>
      </header>
      <section className="span-12 scan-layout">
        <div className="scan-main stack">
          <h2>
            <ScanLine size={28} /> Scan station
          </h2>
          <ScanPanel from="kiosk" />
        </div>
        <aside className="scan-side panel stack">
          <h2>How it works</h2>
          <p className="meta">Each student has a unique QR on their ID card.</p>
          <p className="meta">A valid scan marks them present for the calendar day.</p>
          <p className="meta">Unknown codes show Not a student. No ID card is shown.</p>
        </aside>
      </section>
      <footer className="span-12 site-footer">
        <Link href="/login">Admin login</Link>
      </footer>
    </main>
  )
}
