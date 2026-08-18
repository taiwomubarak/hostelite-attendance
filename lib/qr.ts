import QRCode from "qrcode"
import { qrPayloadFor } from "@/lib/codes"

export async function makeQrDataUrl(code: string) {
  return QRCode.toDataURL(qrPayloadFor(code), {
    margin: 1,
    width: 220,
    color: {
      dark: "#14261C",
      light: "#FFFFFF"
    }
  })
}
