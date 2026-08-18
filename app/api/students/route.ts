import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { createStudentCode } from "@/lib/codes"
import { prisma } from "@/lib/prisma"
import { allowRequest, clientIpFromHeaders } from "@/lib/rate-limit"
import { parseStudentFields } from "@/lib/student-fields"
import { saveStudentPhoto } from "@/lib/uploads"

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!allowRequest(`students:${clientIpFromHeaders(request.headers)}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const formData = await request.formData()
  const parsed = parseStudentFields(formData)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  const photo = formData.get("photo")
  if (!(photo instanceof File) || photo.size === 0) {
    return NextResponse.json({ error: "A student photo is required" }, { status: 400 })
  }

  try {
    const imagePath = await saveStudentPhoto(photo)
    const code = await createStudentCode()
    const student = await prisma.student.create({
      data: {
        code,
        name: parsed.name,
        sex: parsed.sex,
        age: parsed.age,
        room: parsed.room,
        academicLevel: parsed.academicLevel,
        imagePath
      }
    })
    return NextResponse.json({ ok: true, id: student.id })
  } catch {
    return NextResponse.json({ error: "Could not save student" }, { status: 400 })
  }
}
