"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Trash2 } from "lucide-react"

export default function DeleteStudentButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function onDelete() {
    const ok = window.confirm(`Delete ${name} and their attendance records?`)
    if (!ok || busy) {
      return
    }
    setBusy(true)
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" })
    if (res.ok) {
      router.push("/admin/students")
      router.refresh()
      return
    }
    setBusy(false)
  }

  return (
    <button className="btn btn-orange" type="button" onClick={onDelete} disabled={busy}>
      <Trash2 size={18} />
      Delete student
    </button>
  )
}
