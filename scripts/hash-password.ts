import { hashPassword } from "../lib/password"

async function main() {
  const password = process.argv.slice(2).join(" ").trim()
  if (!password) {
    console.error('Usage: npm run hash-password -- "your-password"')
    console.error("Set AUTH_SECRET or ADMIN_PASSWORD_PEPPER in the environment first.")
    process.exit(1)
  }
  if (!process.env.AUTH_SECRET && !process.env.ADMIN_PASSWORD_PEPPER) {
    console.error("Set AUTH_SECRET or ADMIN_PASSWORD_PEPPER before hashing")
    process.exit(1)
  }
  console.log(hashPassword(password))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
