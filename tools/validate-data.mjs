import { readFile } from "node:fs/promises";

const database = JSON.parse(await readFile(new URL("../packages/biology-data/data/biology.json", import.meta.url), "utf8"));
const domainManifest = JSON.parse(await readFile(new URL("../packages/biology-data/data/domains/manifest.json", import.meta.url), "utf8"));
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const unique = (items) => new Set(items).size === items.length;

assert(database.metadata.version === "1.0.0", "La base debe declarar la versión 1.0.0.");
assert(database.metadata.schema_version === "3.0.0", "La base debe declarar schema_version 3.0.0.");
assert(domainManifest.schema_version === "1.0.0", "El manifiesto de dominios debe declarar schema_version 1.0.0.");
assert(domainManifest.merge_order.length >= 5, "La base debe estar dividida en al menos cinco dominios.");
assert(database.codons.length === 64, "La tabla debe contener 64 codones.");
assert(unique(database.codons.map((item) => item.dna)), "Los codones de ADN deben ser únicos.");
assert(unique(database.codons.map((item) => item.rna)), "Los codones de ARN deben ser únicos.");
assert(database.amino_acids.filter((item) => item.canonical).length === 20, "Deben existir 20 aminoácidos canónicos.");
assert(database.iupac_dna_symbols.length === 15, "Deben existir 15 símbolos IUPAC de ADN.");
assert(database.reference_assemblies.some((item) => item.refseq_accession === "GCF_000001405.40"), "Falta GRCh38.p14.");
assert(database.reference_assemblies.some((item) => item.refseq_accession === "GCF_009914755.1"), "Falta T2T-CHM13v2.0.");
assert(database.proteomes.some((item) => item.id === "UP000005640"), "Falta el proteoma humano de UniProt.");
assert(database.research_frontiers.length >= 10, "Deben documentarse al menos 10 fronteras de investigación.");
assert(database.evidence_levels.length === 5, "Deben existir cinco niveles explícitos de evidencia.");
assert(database.genome_representations.some((item) => item.id === "pangenome_graph"), "Falta la representación de pangenoma en grafo.");
assert(database.assay_catalog.length >= 10, "El catálogo debe incluir al menos diez ensayos o modalidades.");
assert(database.noncanonical_structures.some((item) => item.id === "g_quadruplex"), "Falta G-cuádruplex.");
assert(database.noncanonical_structures.some((item) => item.id === "triplex"), "Falta tríplex.");
assert(database.dna_repair_pathways.length >= 5, "Faltan vías principales de reparación del ADN.");
assert(database.ethical_principles.length >= 5, "Faltan principios éticos y de gobernanza.");

for (const codon of database.codons) {
  assert(/^[ACGT]{3}$/.test(codon.dna), `Codón de ADN inválido: ${codon.dna}`);
  assert(/^[ACGU]{3}$/.test(codon.rna), `Codón de ARN inválido: ${codon.rna}`);
}

const sourceIds = new Set(database.sources.map((source) => source.id));
assert(sourceIds.size === database.sources.length, "Los identificadores de fuentes deben ser únicos.");
const evidenceIds = new Set(database.evidence_levels.map((level) => level.id));
assert(evidenceIds.size === database.evidence_levels.length, "Los niveles de evidencia deben ser únicos.");

for (const frontier of database.research_frontiers) {
  assert(evidenceIds.has(frontier.evidence_level), `Nivel de evidencia desconocido en ${frontier.id}.`);
  assert(frontier.source_ids.length > 0, `La frontera ${frontier.id} debe declarar fuentes.`);
  for (const sourceId of frontier.source_ids) assert(sourceIds.has(sourceId), `Fuente ${sourceId} no encontrada para ${frontier.id}.`);
}
for (const structure of database.noncanonical_structures) {
  for (const sourceId of structure.source_ids) assert(sourceIds.has(sourceId), `Fuente ${sourceId} no encontrada para ${structure.id}.`);
}
for (const tool of database.genome_editing_tools) {
  for (const sourceId of tool.source_ids) assert(sourceIds.has(sourceId), `Fuente ${sourceId} no encontrada para ${tool.id}.`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(`Base validada: ${database.codons.length} codones, ${domainManifest.merge_order.length} dominios, ${database.research_frontiers.length} fronteras y ${database.sources.length} fuentes.`);
