import Link from "next/link"

export default function NotFound() {
  return (
    <main className="wrap">
      <section className="span-12 stack">
        <h1 className="page-title">Page not found</h1>
        <p className="lead">That page does not exist.</p>
        <Link className="btn" href="/">
          Return to scan
        </Link>
      </section>
    </main>
  )
}
