import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const build = join(root, ".build");
const dist = join(root, "dist");
const localTscJs = join(root, "node_modules", "typescript", "lib", "tsc.js");

execFileSync(process.execPath, [join(root, "tools/bundle-data.mjs")], { cwd: root, stdio: process.env.HGL_QUIET === "1" ? "ignore" : "inherit" });
await Promise.all([rm(build, { recursive: true, force: true }), rm(dist, { recursive: true, force: true })]);
// Ejecuta tsc vía Node para evitar el spawn de tsc.cmd (EINVAL en Windows con Node reciente) y soportar rutas con espacios.
if (existsSync(localTscJs)) {
  execFileSync(process.execPath, [localTscJs, "-p", join(root, "tsconfig.json")], { cwd: root, stdio: "inherit" });
} else {
  execFileSync(process.platform === "win32" ? "tsc.cmd" : "tsc", ["-p", join(root, "tsconfig.json")], { cwd: root, stdio: "inherit", shell: process.platform === "win32" });
}
await mkdir(dist, { recursive: true });
await cp(join(root, "apps/web-lab/public"), dist, { recursive: true });
await mkdir(join(dist, "assets"), { recursive: true });
await cp(join(build, "apps"), join(dist, "assets/apps"), { recursive: true });
await cp(join(build, "packages"), join(dist, "assets/packages"), { recursive: true });
await mkdir(join(dist, "data"), { recursive: true });
await cp(join(root, "packages/biology-data/data/biology.json"), join(dist, "data/biology.json"));
await cp(join(root, "packages/biology-data/schema/biology.schema.json"), join(dist, "data/biology.schema.json"));
await cp(join(root, "registry/modules.json"), join(dist, "data/modules.json"));
await cp(join(root, "registry/schema/module.schema.json"), join(dist, "data/module.schema.json"));
await cp(join(root, "packages/organism-profiles/data/profiles.json"), join(dist, "data/organism-profiles.json"));
const pkg = JSON.parse(await readFile(join(root, "package.json"), "utf8"));
await writeFile(join(dist, "build-info.json"), JSON.stringify({ name: pkg.name, version: pkg.version, architecture: "evolutionary-module-platform", builtAt: new Date().toISOString() }, null, 2));
if (process.env.HGL_QUIET !== "1") console.log(`Laboratorio compilado en ${dist}`);
