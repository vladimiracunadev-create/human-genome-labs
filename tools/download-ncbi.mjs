import { createHash } from "node:crypto";
import { createReadStream, existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
const assemblies = {
  grch38: { accession: "GCF_000001405.40", filename: "human_GRCh38.p14_dataset.zip" },
  t2t: { accession: "GCF_009914755.1", filename: "human_T2T-CHM13v2.0_dataset.zip" },
};
const selected = assemblies[process.argv[2]];
if (!selected) throw new Error("Usa grch38 o t2t.");
const destination = resolve("datasets/raw");
await mkdir(destination, { recursive: true });
if (!existsSync(process.platform === "win32" ? "datasets.exe" : "/usr/bin/datasets") && process.env.PATH) {
  // La comprobación definitiva la hace el sistema al ejecutar el comando.
}
const output = join(destination, selected.filename);
execFileSync("datasets", ["download", "genome", "accession", selected.accession, "--include", "genome,gff3,rna,cds,protein,seq-report", "--filename", output], { stdio: "inherit" });
const hash = createHash("sha256");
for await (const chunk of createReadStream(output)) hash.update(chunk);
await writeFile(`${output}.sha256`, `${hash.digest("hex")}  ${selected.filename}
`);
console.log(`Descarga y suma SHA-256 guardadas en ${destination}`);
