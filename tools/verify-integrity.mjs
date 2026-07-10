import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve, join } from "node:path";
const root = resolve(import.meta.dirname, "..");
const manifest = await readFile(join(root, "INTEGRITY.sha256"), "utf8");
const failures = [];
let checked = 0;
for (const line of manifest.split("\n")) {
  if (!line.trim()) continue;
  const match = line.match(/^([a-f0-9]{64})  (.+)$/);
  if (!match) { failures.push(`Línea inválida: ${line}`); continue; }
  const [, expected, relative] = match;
  try {
    const actual = createHash("sha256").update(await readFile(join(root, relative))).digest("hex");
    checked += 1;
    if (actual !== expected) failures.push(`${relative}: checksum distinto`);
  } catch (error) {
    failures.push(`${relative}: ${error instanceof Error ? error.message : "no se pudo leer"}`);
  }
}
if (failures.length) {
  console.error(failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}
console.log(`Integridad verificada: ${checked} archivos.`);
