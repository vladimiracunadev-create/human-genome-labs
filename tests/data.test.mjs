import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const db = JSON.parse(await readFile(new URL("../packages/biology-data/data/biology.json", import.meta.url), "utf8"));

test("base molecular completa dentro del alcance", () => {
  assert.equal(db.codons.length, 64);
  assert.equal(new Set(db.codons.map((item) => item.dna)).size, 64);
  assert.equal(db.amino_acids.filter((item) => item.canonical).length, 20);
  assert.equal(db.iupac_dna_symbols.length, 15);
});

test("referencias humanas registradas", () => {
  assert.ok(db.reference_assemblies.some((item) => item.refseq_accession === "GCF_000001405.40"));
  assert.ok(db.reference_assemblies.some((item) => item.refseq_accession === "GCF_009914755.1"));
  assert.ok(db.proteomes.some((item) => item.id === "UP000005640"));
});

test("genómica de sistemas y trazabilidad", () => {
  assert.equal(db.metadata.version, "1.0.0");
  assert.equal(db.research_frontiers.length, 10);
  assert.equal(db.evidence_levels.length, 5);
  assert.ok(db.genome_representations.some((item) => item.id === "pangenome_graph"));
  assert.ok(db.noncanonical_structures.some((item) => item.id === "g_quadruplex"));
  assert.ok(db.single_cell_modalities.some((item) => item.id === "scrna"));
  assert.ok(db.dna_repair_pathways.some((item) => item.id === "hr"));
  const sourceIds = new Set(db.sources.map((source) => source.id));
  for (const frontier of db.research_frontiers) {
    assert.ok(frontier.source_ids.length > 0);
    assert.ok(frontier.source_ids.every((id) => sourceIds.has(id)));
  }
});
