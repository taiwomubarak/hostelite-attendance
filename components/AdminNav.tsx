"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ClipboardList, LogOut, ScanLine, Users } from "lucide-react"
import { logoutAction } from "@/lib/actions"

export default function AdminNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="admin-top">
      <div className="admin-nav-wrap">
        <p className="brand">Hostelite Attendance</p>
        <nav className="nav-links">
          <Link className={`nav-link ${isActive("/admin") && pathname === "/admin" ? "active" : ""}`} href="/admin">
            <ClipboardList size={18} />
            Roster
          </Link>
          <Link className={`nav-link ${isActive("/admin/scan") ? "active" : ""}`} href="/admin/scan">
            <ScanLine size={18} />
            Scan
          </Link>
          <Link className={`nav-link ${isActive("/admin/students") ? "active" : ""}`} href="/admin/students">
            <Users size={18} />
            Students
          </Link>
          <form action={logoutAction}>
            <button className="nav-link quiet" type="submit">
              <LogOut size={18} />
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  )
}
