"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"
import { Save, UserPlus } from "lucide-react"

type StudentValues = {
  id: string
  name: string
  sex: string
  age: number
  room: string
  academicLevel: number
  imagePath: string
}

type StudentFormProps = {
  student?: StudentValues
}

export default function StudentForm({ student }: StudentFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const isEdit = Boolean(student)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError("")
    const form = event.currentTarget
    const body = new FormData(form)
    const url = isEdit ? `/api/students/${student?.id}` : "/api/students"
    const method = isEdit ? "PUT" : "POST"

    try {
      const res = await fetch(url, { method, body })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not save student")
        setSaving(false)
        return
      }
      router.push(`/admin/students/${data.id}`)
      router.refresh()
    } catch {
      setError("Could not save student")
      setSaving(false)
    }
  }

  return (
    <form className="panel stack-lg" onSubmit={onSubmit}>
      {error ? <p className="error-banner">{error}</p> : null}
      {student ? <img className="photo-preview" src={student.imagePath} alt={student.name} /> : null}
      <div className="form-grid">
        <label className="field">
          Name
          <input name="name" defaultValue={student?.name ?? ""} required />
        </label>
        <label className="field">
          Room
          <input name="room" defaultValue={student?.room ?? ""} required />
        </label>
        <label className="field">
          Sex
          <select name="sex" defaultValue={student?.sex ?? "Male"} required>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </label>
        <label className="field">
          Age
          <input name="age" type="number" min={10} max={80} defaultValue={student?.age ?? 18} required />
        </label>
        <label className="field">
          Academic Level
          <select name="academicLevel" defaultValue={student?.academicLevel ?? 1} required>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </label>
        <label className="field">
          Photo
          <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required={!isEdit} />
        </label>
      </div>
      <div className="actions">
        <button className="btn" type="submit" disabled={saving}>
          {isEdit ? <Save size={18} /> : <UserPlus size={18} />}
          {saving ? "Saving" : isEdit ? "Save student" : "Add student"}
        </button>
      </div>
    </form>
  )
}
