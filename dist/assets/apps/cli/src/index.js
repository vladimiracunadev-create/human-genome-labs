import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseFasta, parseGff3, parseVcf } from "../../../packages/file-formats/src/index.js";
import { createScientificResult } from "../../../packages/scientific-contracts/src/index.js";
import { analyzeCodingVariant, codonUsage, findGQuadruplexCandidates, findOpenReadingFrames, summarizeAlleleObservation, summarizeSequence, translateDna, translateSixFrames, validateDna, } from "../../../packages/genetics-core/src/index.js";
const root = resolve(import.meta.dirname, "../../../..");
const database = JSON.parse(await readFile(resolve(root, "packages/biology-data/data/biology.json"), "utf8"));
const registry = JSON.parse(await readFile(resolve(root, "registry/modules.json"), "utf8"));
const profiles = JSON.parse(await readFile(resolve(root, "packages/organism-profiles/data/profiles.json"), "utf8"));
function usage() {
    console.error(`Human Genome Labs CLI v1

Descubrimiento:
  pnpm cli -- capabilities [--maturity concept|experimental|validated|stable] [--json]
  pnpm cli -- modules [--maturity concept|experimental|validated|stable] [--json]
  pnpm cli -- profiles [--id homo-sapiens-nuclear] [--json]

Secuencias:
  pnpm cli -- summary <archivo.fasta> [--json]
  pnpm cli -- translate <archivo.fasta> [--frame 1|2|3] [--strand +|-] [--code standard|human_mitochondrial] [--six-frames] [--stop-at-stop] [--json]
  pnpm cli -- orfs <archivo.fasta> [--min-aa 20] [--include-incomplete] [--json]
  pnpm cli -- codon-usage <archivo.fasta> [--frame 1|2|3] [--json]
  pnpm cli -- validate <archivo.fasta> [--json]

Formatos:
  pnpm cli -- gff-summary <archivo.gff3> [--json]
  pnpm cli -- vcf-summary <archivo.vcf> [--json]

Genómica de sistemas:
  pnpm cli -- variant <archivo.fasta> --position 3 --ref G --alt A [--frame 1|2|3] [--code standard|human_mitochondrial] [--json]
  pnpm cli -- structures <archivo.fasta> [--max-loop 7] [--json]
  pnpm cli -- allele-fraction --alt-reads 12 --total-reads 100 [--json]
  pnpm cli -- frontiers [--domain human_pangenome] [--json]

Notas:
  - El contrato interno usa coordenadas base cero, extremo final exclusivo.
  - Use '-' para representar un alelo vacío.
  - Los resultados no constituyen interpretación clínica.`);
    process.exit(1);
}
function option(args, name, fallback) {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : fallback;
}
function printOutput(output, asJson) {
    if (asJson)
        console.log(JSON.stringify(output, null, 2));
    else
        console.dir(output, { depth: null, colors: process.stdout.isTTY });
}
function moduleById(id) {
    const found = registry.modules.find((item) => item.id === id);
    if (!found)
        throw new Error(`Módulo no registrado: ${id}`);
    return found;
}
function result(moduleId, analysis, value, options = {}) {
    const module = moduleById(moduleId);
    return createScientificResult({
        analysis,
        moduleId,
        moduleVersion: module.version,
        maturity: module.maturity,
        status: options.status ?? (options.warnings?.length ? "warning" : "success"),
        evidenceLevel: options.evidenceLevel ?? module.evidenceLevel,
        input: { ...(options.source ? { source: options.source } : {}), coordinateConvention: "zero_based_half_open" },
        parameters: options.parameters ?? {},
        result: value,
        warnings: options.warnings ?? [],
        limitations: options.limitations ?? module.limitations,
    });
}
const args = process.argv.slice(2);
const command = args[0];
if (!command)
    usage();
const asJson = args.includes("--json");
const maturity = option(args, "--maturity");
if (command === "capabilities") {
    const capabilities = registry.capabilities.filter((item) => !maturity || item.maturity === maturity);
    printOutput({ registryVersion: registry.schemaVersion, projectVersion: registry.projectVersion, capabilities }, asJson);
    process.exit(0);
}
if (command === "modules") {
    const modules = registry.modules.filter((item) => !maturity || item.maturity === maturity);
    printOutput({ registryVersion: registry.schemaVersion, projectVersion: registry.projectVersion, modules }, asJson);
    process.exit(0);
}
if (command === "profiles") {
    const id = option(args, "--id");
    const selected = profiles.profiles.filter((profile) => !id || profile.id === id);
    if (!selected.length)
        throw new Error(`No existe el perfil '${id}'.`);
    printOutput({ schemaVersion: profiles.schemaVersion, profiles: selected }, asJson);
    process.exit(0);
}
if (command === "frontiers") {
    const domain = option(args, "--domain");
    const frontiers = database.research_frontiers
        .filter((frontier) => !domain || frontier.id === domain)
        .sort((a, b) => a.order - b.order)
        .map((frontier) => ({ ...frontier, sources: frontier.source_ids.map((id) => database.sources.find((source) => source.id === id)).filter(Boolean) }));
    if (!frontiers.length)
        throw new Error(`No existe la frontera '${domain}'.`);
    printOutput(frontiers, asJson);
    process.exit(0);
}
if (command === "allele-fraction") {
    const alternateReads = Number(option(args, "--alt-reads"));
    const totalReads = Number(option(args, "--total-reads"));
    const value = summarizeAlleleObservation(alternateReads, totalReads);
    printOutput(result("somatic-observation", "somatic.allele_fraction", value, { evidenceLevel: "observed", parameters: { alternateReads, totalReads }, warnings: [value.warning] }), asJson);
    process.exit(0);
}
const filename = args[1];
if (!filename || filename.startsWith("--"))
    usage();
const absoluteFilename = resolve(filename);
const text = await readFile(absoluteFilename, "utf8");
if (command === "gff-summary") {
    const parsed = parseGff3(text);
    const byType = Object.fromEntries([...new Set(parsed.features.map((feature) => feature.type))].sort().map((type) => [type, parsed.features.filter((feature) => feature.type === type).length]));
    const value = { version: parsed.version, directives: parsed.directives, featureCount: parsed.features.length, byType, firstFeatures: parsed.features.slice(0, 20) };
    printOutput(createScientificResult({ analysis: "format.gff3_summary", moduleId: "file-formats", moduleVersion: "1.0.0", maturity: "validated", status: "success", evidenceLevel: "observed", input: { source: filename, coordinateConvention: "one_based_closed" }, parameters: {}, result: value, warnings: ["Las coordenadas originales GFF3 se conservan y también se exponen como intervalos internos 0-based half-open."], limitations: ["Lector inicial sin soporte de indexación, FASTA embebido ni todas las extensiones de proveedores."] }), asJson);
    process.exit(0);
}
if (command === "vcf-summary") {
    const parsed = parseVcf(text);
    const value = { header: parsed.header, recordCount: parsed.records.length, multiAllelicCount: parsed.records.filter((record) => record.alternates.length > 1).length, filteredCount: parsed.records.filter((record) => record.filters.length && !record.filters.includes("PASS")).length, firstRecords: parsed.records.slice(0, 20) };
    printOutput(createScientificResult({ analysis: "format.vcf_summary", moduleId: "file-formats", moduleVersion: "1.0.0", maturity: "validated", status: "success", evidenceLevel: "observed", input: { source: filename, coordinateConvention: "one_based_closed" }, parameters: {}, result: value, warnings: ["POS se conserva como position1 y se convierte a position0 para uso interno."], limitations: ["No normaliza variantes ni implementa BCF, BGZF o tabix."] }), asJson);
    process.exit(0);
}
const records = parseFasta(text);
if (!records.length)
    throw new Error("El archivo no contiene secuencias FASTA.");
const output = records.map((record) => {
    if (command === "summary")
        return result("sequence-analysis", "sequence.summary", { id: record.id, description: record.description, ...summarizeSequence(record.sequence) }, { source: filename });
    if (command === "validate")
        return result("sequence-analysis", "sequence.validate", { id: record.id, ...validateDna(record.sequence) }, { source: filename, evidenceLevel: "observed" });
    const code = (option(args, "--code", "standard") ?? "standard");
    const frame = Number(option(args, "--frame", "1"));
    if (![1, 2, 3].includes(frame))
        throw new Error("--frame debe ser 1, 2 o 3.");
    if (command === "translate") {
        if (args.includes("--six-frames"))
            return result("sequence-analysis", "sequence.translation.six_frames", { id: record.id, translations: translateSixFrames(record.sequence, database, code) }, { source: filename, parameters: { code } });
        const strand = option(args, "--strand", "+");
        if (!["+", "-"].includes(strand))
            throw new Error("--strand debe ser + o -.");
        return result("sequence-analysis", "sequence.translation", { id: record.id, translation: translateDna(record.sequence, database, { frame, strand, geneticCode: code, stopAtStop: args.includes("--stop-at-stop") }) }, { source: filename, parameters: { frame, strand, code, stopAtStop: args.includes("--stop-at-stop") } });
    }
    if (command === "orfs") {
        const minAminoAcids = Number(option(args, "--min-aa", "20"));
        return result("sequence-analysis", "sequence.orf", { id: record.id, orfs: findOpenReadingFrames(record.sequence, database, { geneticCode: code, minAminoAcids, includeIncomplete: args.includes("--include-incomplete") }) }, { source: filename, parameters: { code, minAminoAcids, includeIncomplete: args.includes("--include-incomplete") } });
    }
    if (command === "codon-usage")
        return result("sequence-analysis", "sequence.codon_usage", { id: record.id, usage: codonUsage(record.sequence, database, frame, code).filter((item) => item.count > 0) }, { source: filename, parameters: { frame, code } });
    if (command === "variant") {
        const position = Number(option(args, "--position"));
        const reference = option(args, "--ref");
        const alternate = option(args, "--alt");
        if (!Number.isInteger(position) || reference === undefined || alternate === undefined)
            throw new Error("variant requiere --position, --ref y --alt.");
        const analysis = analyzeCodingVariant(record.sequence, { position, reference, alternate }, database, { frame, geneticCode: code });
        return result("variant-analysis", "variant.coding_effect", { id: record.id, analysis }, { source: filename, parameters: { position, reference, alternate, frame, code }, warnings: [analysis.warning], status: analysis.valid ? "warning" : "error" });
    }
    if (command === "structures") {
        const maxLoop = Number(option(args, "--max-loop", "7"));
        if (!Number.isInteger(maxLoop) || maxLoop < 1 || maxLoop > 20)
            throw new Error("--max-loop debe ser un entero entre 1 y 20.");
        return result("noncanonical-structures", "structure.g4_candidate", { id: record.id, candidates: findGQuadruplexCandidates(record.sequence, maxLoop) }, { source: filename, parameters: { maxLoop }, warnings: ["Los motivos candidatos no demuestran formación de G-cuádruplex in vivo."], status: "warning" });
    }
    usage();
});
printOutput(output, asJson);
//# sourceMappingURL=index.js.map