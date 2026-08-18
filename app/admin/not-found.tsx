import Link from "next/link"

export default function AdminNotFound() {
  return (
    <main className="wrap">
      <section className="span-12 stack">
        <h1 className="page-title">Page not found</h1>
        <p className="lead">That admin page does not exist.</p>
        <Link className="btn" href="/admin">
          Return to roster
        </Link>
      </section>
    </main>
  )
}
