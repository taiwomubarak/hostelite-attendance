import { put } from "@vercel/blob"
import { randomBytes } from "node:crypto"
import { mkdir, writeFile } from "fs/promises"
import path from "path"

function sniffExt(bytes: Buffer) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "jpg"
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "png"
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp"
  }
  return null
}

function contentType(ext: string) {
  if (ext === "jpg") {
    return "image/jpeg"
  }
  if (ext === "png") {
    return "image/png"
  }
  return "image/webp"
}

export async function saveStudentPhoto(file: File) {
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Photo must be 5 MB or smaller")
  }

  const bytes = Buffer.from(await file.arrayBuffer())
  const ext = sniffExt(bytes)
  if (!ext) {
    throw new Error("Photo must be a JPG, PNG, or WEBP file")
  }

  const filename = `${randomBytes(16).toString("hex")}.${ext}`

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`students/${filename}`, bytes, {
      access: "public",
      contentType: contentType(ext),
      token: process.env.BLOB_READ_WRITE_TOKEN
    })
    return blob.url
  }

  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for photo uploads on Vercel")
  }

  const dir = path.join(process.cwd(), "public", "uploads")
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, filename), bytes)
  return `/uploads/${filename}`
}
