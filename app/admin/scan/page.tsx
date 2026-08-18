import { ScanLine } from "lucide-react"
import ScanPanel from "@/components/ScanPanel"

export default function AdminScanPage() {
  return (
    <main className="wrap">
      <header className="span-12 stack">
        <p className="page-kicker">
          <ScanLine size={16} /> Warden scan
        </p>
        <h1 className="page-title">Scan</h1>
        <p className="lead">Scan a student ID card to mark them present for today.</p>
      </header>
      <section className="span-12">
        <ScanPanel from="admin" />
      </section>
    </main>
  )
}
