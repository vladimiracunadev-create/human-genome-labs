import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  createScientificResult,
  oneBasedClosedToZeroBasedHalfOpen,
  zeroBasedHalfOpenToOneBasedClosed,
} from "../.build/packages/scientific-contracts/src/index.js";
import { parseFasta, parseGff3, parseVcf } from "../.build/packages/file-formats/src/index.js";
import { validateOrganismProfile } from "../.build/packages/organism-profiles/src/index.js";

const registry = JSON.parse(await readFile(new URL("../registry/modules.json", import.meta.url), "utf8"));
const profiles = JSON.parse(await readFile(new URL("../packages/organism-profiles/data/profiles.json", import.meta.url), "utf8"));

test("contrato científico conserva evidencia y limitaciones", () => {
  const result = createScientificResult({
    analysis: "demo",
    moduleId: "sequence-analysis",
    moduleVersion: "1.0.0",
    maturity: "validated",
    status: "warning",
    evidenceLevel: "computational_prediction",
    input: { source: "example.fasta", coordinateConvention: "zero_based_half_open" },
    parameters: { frame: 1 },
    result: { protein: "MA*" },
    warnings: ["ejemplo"],
    limitations: ["no demuestra expresión"],
    generatedAt: "2026-07-10T00:00:00.000Z",
  });
  assert.equal(result.contractVersion, "1.0.0");
  assert.equal(result.evidenceLevel, "computational_prediction");
  assert.deepEqual(result.limitations, ["no demuestra expresión"]);
});

test("conversión de coordenadas es reversible", () => {
  const internal = oneBasedClosedToZeroBasedHalfOpen("chr1", 10, 20, "+");
  assert.deepEqual(internal, { sequenceId: "chr1", start: 9, end: 20, strand: "+", coordinateConvention: "zero_based_half_open" });
  assert.deepEqual(zeroBasedHalfOpenToOneBasedClosed(internal), { sequenceId: "chr1", start: 10, end: 20, strand: "+", coordinateConvention: "one_based_closed" });
});

test("lectores FASTA, GFF3 y VCF exponen estructuras tipadas", () => {
  const fasta = parseFasta(">seq demo\nATG GCC TAA");
  assert.equal(fasta[0].sequence, "ATGGCCTAA");

  const gff = parseGff3("##gff-version 3\nchr1\tHGL\tgene\t2\t10\t.\t+\t.\tID=g1;Name=Demo");
  assert.equal(gff.version, "3");
  assert.equal(gff.features[0].interval.start, 1);
  assert.deepEqual(gff.features[0].attributes.Name, ["Demo"]);

  const vcf = parseVcf("##fileformat=VCFv4.3\n#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\nchr1\t4\t.\tG\tA,T\t60\tPASS\tDP=20;SOMATIC");
  assert.equal(vcf.records[0].position0, 3);
  assert.deepEqual(vcf.records[0].alternates, ["A", "T"]);
  assert.equal(vcf.records[0].info.SOMATIC, true);
});

test("registro evolutivo conecta módulos y capacidades", () => {
  const moduleIds = new Set(registry.modules.map((item) => item.id));
  assert.ok(registry.modules.some((item) => item.maturity === "concept"));
  assert.ok(registry.modules.some((item) => item.maturity === "experimental"));
  assert.ok(registry.modules.some((item) => item.maturity === "validated"));
  for (const capability of registry.capabilities) assert.ok(moduleIds.has(capability.moduleId));
});

test("perfiles no asumen una sola clase de genoma", () => {
  assert.ok(profiles.profiles.some((profile) => profile.polymer === "RNA"));
  assert.ok(profiles.profiles.some((profile) => profile.strandedness === "configurable"));
  for (const profile of profiles.profiles) assert.deepEqual(validateOrganismProfile(profile), []);
});
