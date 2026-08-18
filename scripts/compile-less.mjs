import { spawnSync } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const result = spawnSync(
  "npx",
  ["lessc", "app/globals.less", "app/globals.css"],
  { cwd: root, stdio: "inherit", shell: true }
)

if (result.status !== 0) {
  process.exit(result.status ?? 1)
}
