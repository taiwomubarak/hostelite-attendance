export type ParsedStudent = {
  name: string
  sex: string
  age: number
  room: string
  academicLevel: number
}

export function parseStudentFields(formData: FormData): ParsedStudent | { error: string } {
  const name = String(formData.get("name") ?? "").trim()
  const sex = String(formData.get("sex") ?? "").trim()
  const age = Number(formData.get("age"))
  const room = String(formData.get("room") ?? "").trim()
  const academicLevel = Number(formData.get("academicLevel"))

  if (!name) {
    return { error: "Name is required" }
  }
  if (sex !== "Male" && sex !== "Female") {
    return { error: "Sex must be Male or Female" }
  }
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    return { error: "Age must be a number between 1 and 120" }
  }
  if (!room) {
    return { error: "Room is required" }
  }
  if (!Number.isInteger(academicLevel) || academicLevel < 1 || academicLevel > 5) {
    return { error: "Academic Level must be from 1 to 5" }
  }

  return { name, sex, age, room, academicLevel }
}
