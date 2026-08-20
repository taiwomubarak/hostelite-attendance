import { hashPassword } from "../lib/password"

async function main() {
  const password = process.argv.slice(2).join(" ").trim()
  if (!password) {
    console.error("Usage: npm run hash-password -- your-password-here")
    process.exit(1)
  }
  if (password.length < 12) {
    console.error("Use a password with at least 12 characters")
    process.exit(1)
  }
  const hash = await hashPassword(password)
  console.log(hash)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
