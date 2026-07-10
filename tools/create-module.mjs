import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
const root = resolve(import.meta.dirname, "..");
const [id, maturity = "experimental", ...titleParts] = process.argv.slice(2).filter((arg) => arg !== "--");
const title = titleParts.join(" ") || id;
if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error("Uso: pnpm new:module -- id concept|experimental|validated \"Título\"");
if (!["concept","experimental","validated"].includes(maturity)) throw new Error("Madurez inicial permitida: concept, experimental o validated.");
const target = join(root,"modules",maturity,id);
try { await access(target); throw new Error(`El módulo ${target} ya existe.`); } catch (error) { if (error instanceof Error && error.message.includes("ya existe")) throw error; }
await mkdir(join(target,"src"),{recursive:true}); await mkdir(join(target,"tests"),{recursive:true});
const replacements = { "{{id}}": id, "{{maturity}}": maturity, "{{title}}": title };
for (const [sourceName,targetName] of [["module.json.template","module.json"],["README.md.template","README.md"],["src/index.ts.template","src/index.ts"],["tests/module.test.mjs.template","tests/module.test.mjs"]]) {
  let content=await readFile(join(root,"templates/module",sourceName),"utf8");
  for (const [token,value] of Object.entries(replacements)) content=content.split(token).join(value);
  await writeFile(join(target,targetName),content);
}
console.log(`Módulo creado en ${target}. Regístrelo en registry/modules.json antes de considerarlo integrado.`);
