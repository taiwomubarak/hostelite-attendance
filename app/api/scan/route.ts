import { NextResponse } from "next/server"
import { parseQrPayload } from "@/lib/codes"
import { todayStamp } from "@/lib/dates"
import { prisma } from "@/lib/prisma"
import { allowRequest, clientIpFromHeaders } from "@/lib/rate-limit"
import { makeScanToken } from "@/lib/scan-token"

export async function POST(request: Request) {
  const ip = clientIpFromHeaders(request.headers)
  if (!allowRequest(`scan:${ip}`, 40, 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }

  const body = await request.json().catch(() => null)
  const payload = String(body?.payload ?? "").trim()
  if (!payload) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const code = parseQrPayload(payload)
  if (!code) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const student = await prisma.student.findUnique({ where: { code } })
  if (!student) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const date = todayStamp()
  const existing = await prisma.attendance.findUnique({
    where: { studentId_date: { studentId: student.id, date } }
  })

  const token = makeScanToken(student.code)

  if (existing) {
    return NextResponse.json({ ok: true, code: student.code, already: true, token })
  }

  await prisma.attendance.create({
    data: {
      studentId: student.id,
      date
    }
  })

  return NextResponse.json({ ok: true, code: student.code, already: false, token })
}
