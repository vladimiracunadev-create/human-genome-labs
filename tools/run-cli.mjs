import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, [join(root, "tools/build.mjs")], { cwd: root, stdio: "inherit", env: { ...process.env, HGL_QUIET: "1" } });
execFileSync(process.execPath, [join(root, ".build/apps/cli/src/index.js"), ...process.argv.slice(2)], { cwd: root, stdio: "inherit" });
