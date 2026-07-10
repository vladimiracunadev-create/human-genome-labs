import { execFileSync, spawn } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, [join(root, "tools/build.mjs")], { cwd: root, stdio: "inherit" });
const child = spawn(process.execPath, [join(root, "tools/server.mjs"), join(root, "dist")], { cwd: root, stdio: "inherit" });
process.on("SIGINT",()=>child.kill("SIGINT"));
