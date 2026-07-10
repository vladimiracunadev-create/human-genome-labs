import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
execFileSync(process.execPath, [join(root, "tools/build.mjs")], { cwd: root, stdio: "inherit" });
const files = readdirSync(join(root, "tests")).filter((name)=>name.endsWith(".test.mjs")).sort().map((name)=>join(root,"tests",name));
execFileSync(process.execPath, ["--test", ...files], { cwd: root, stdio: "inherit" });
