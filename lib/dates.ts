export function todayStamp() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function formatDay(date: string) {
  const [year, month, day] = date.split("-")
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const monthIndex = Number(month) - 1
  const label = months[monthIndex] ?? month
  return `${Number(day)} ${label} ${year}`
}

export function formatTime(value: Date) {
  const hours = value.getHours()
  const minutes = String(value.getMinutes()).padStart(2, "0")
  const suffix = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 || 12
  return `${hour12}:${minutes} ${suffix}`
}
