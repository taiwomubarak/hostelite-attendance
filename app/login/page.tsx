import { redirect } from "next/navigation"
import { LogIn } from "lucide-react"
import { loginAction } from "@/lib/actions"
import { auth } from "@/lib/auth"

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const session = await auth()
  if (session) {
    redirect("/admin")
  }

  const query = await searchParams

  return (
    <div className="login-shell">
      <section className="login-panel">
        <div className="stack">
          <p className="page-kicker">Admin access</p>
          <h1 className="page-title">Log in</h1>
          <p className="lead">Hostelite Attendance administration.</p>
        </div>
        {query.error === "2" ? (
          <p className="error-banner">Too many login attempts. Wait and try again.</p>
        ) : query.error ? (
          <p className="error-banner">Username or password is not correct.</p>
        ) : null}
        <form className="stack" action={loginAction}>
          <label className="field wide">
            Username
            <input name="username" autoComplete="username" required />
          </label>
          <label className="field wide">
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button className="btn" type="submit">
            <LogIn size={18} />
            Log in
          </button>
        </form>
      </section>
    </div>
  )
}
