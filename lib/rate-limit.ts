type Bucket = {
  count: number
  reset: number
}

const buckets = new Map<string, Bucket>()

export function clientIpFromHeaders(headerList: Headers) {
  const forwarded = headerList.get("x-forwarded-for")
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  return headerList.get("x-real-ip") || "unknown"
}

export function allowRequest(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  if (buckets.size > 4000) {
    for (const [id, slot] of buckets) {
      if (now > slot.reset) {
        buckets.delete(id)
      }
    }
  }

  const slot = buckets.get(key)
  if (!slot || now > slot.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    return true
  }
  if (slot.count >= limit) {
    return false
  }
  slot.count += 1
  return true
}
