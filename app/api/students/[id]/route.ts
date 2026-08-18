import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { allowRequest, clientIpFromHeaders } from "@/lib/rate-limit"
import { parseStudentFields } from "@/lib/student-fields"
import { saveStudentPhoto } from "@/lib/uploads"

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!allowRequest(`students:${clientIpFromHeaders(request.headers)}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { id } = await context.params
  const existing = await prisma.student.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 })
  }

  const formData = await request.formData()
  const parsed = parseStudentFields(formData)
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 })
  }

  let imagePath = existing.imagePath
  const photo = formData.get("photo")
  if (photo instanceof File && photo.size > 0) {
    try {
      imagePath = await saveStudentPhoto(photo)
    } catch {
      return NextResponse.json({ error: "Could not save photo" }, { status: 400 })
    }
  }

  await prisma.student.update({
    where: { id },
    data: {
      name: parsed.name,
      sex: parsed.sex,
      age: parsed.age,
      room: parsed.room,
      academicLevel: parsed.academicLevel,
      imagePath
    }
  })

  return NextResponse.json({ ok: true, id })
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!allowRequest(`students:${clientIpFromHeaders(_request.headers)}`, 30, 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { id } = await context.params
  await prisma.student.delete({ where: { id } }).catch(() => null)
  return NextResponse.json({ ok: true })
}
