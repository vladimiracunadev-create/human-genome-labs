import { readFile, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
const root=resolve(import.meta.dirname,".."); const domainDir=join(root,"packages/biology-data/data/domains");
const manifest=JSON.parse(await readFile(join(domainDir,"manifest.json"),"utf8")); const output={}; const seen=new Set();
for (const filename of manifest.merge_order) {
  const domain=JSON.parse(await readFile(join(domainDir,filename),"utf8"));
  for (const [key,value] of Object.entries(domain)) { if (seen.has(key)) throw new Error(`Clave duplicada '${key}' en ${filename}.`); seen.add(key); output[key]=value; }
}
await writeFile(join(root,"packages/biology-data/data/biology.json"),JSON.stringify(output,null,2)+"\n");
if (process.env.HGL_QUIET !== "1") console.log(`Bundle científico generado con ${seen.size} dominios raíz.`);
