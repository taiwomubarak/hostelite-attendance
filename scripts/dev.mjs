import { spawn, spawnSync } from "child_process"
import { watch } from "fs"
import path from "path"
import { fileURLToPath } from "url"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))

function compileLess() {
  const result = spawnSync(
    "npx",
    ["lessc", "app/globals.less", "app/globals.css"],
    { cwd: root, stdio: "inherit", shell: true }
  )
  if (result.status !== 0) {
    console.error("Less compile failed")
  }
}

compileLess()

let timer = null
function schedule() {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(compileLess, 120)
}

watch(path.join(root, "styles"), { recursive: true }, schedule)
watch(path.join(root, "app", "globals.less"), schedule)

const child = spawn("npx", ["next", "dev"], { cwd: root, stdio: "inherit", shell: true })
child.on("exit", (code) => process.exit(code ?? 0))
