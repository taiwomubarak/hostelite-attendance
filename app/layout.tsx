import type { ReactNode } from "react"
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap"
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap"
})

export const metadata = {
  title: "Hostelite Attendance",
  description: "Daily hostel student attendance with QR scan and ID cards"
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} ${fraunces.variable}`}>{children}</body>
    </html>
  )
}
