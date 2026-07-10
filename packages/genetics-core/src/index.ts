import type {
  AminoAcidRecord,
  BiologyDatabase,
  CodonRecord,
  DnaBase,
  GeneticCodeId,
  IupacDnaSymbol,
  OrfRecord,
  TranslationResult,
} from "../../biology-data/src/index.js";

const IUPAC_COMPLEMENT: Readonly<Record<IupacDnaSymbol, IupacDnaSymbol>> = {
  A: "T", T: "A", C: "G", G: "C", R: "Y", Y: "R", S: "S", W: "W",
  K: "M", M: "K", B: "V", V: "B", D: "H", H: "D", N: "N",
};

const IUPAC_POSSIBILITIES: Readonly<Record<IupacDnaSymbol, readonly DnaBase[]>> = {
  A: ["A"], C: ["C"], G: ["G"], T: ["T"], R: ["A", "G"], Y: ["C", "T"],
  S: ["G", "C"], W: ["A", "T"], K: ["G", "T"], M: ["A", "C"],
  B: ["C", "G", "T"], D: ["A", "G", "T"], H: ["A", "C", "T"],
  V: ["A", "C", "G"], N: ["A", "C", "G", "T"],
};

export interface SequenceValidation {
  normalized: string;
  valid: boolean;
  invalidSymbols: Array<{ symbol: string; position: number }>;
  ambiguousCount: number;
}

export interface SequenceSummary {
  length: number;
  canonicalLength: number;
  ambiguousLength: number;
  counts: Record<string, number>;
  gcCanonicalPercent: number;
  gcExpectedPercent: number;
  shannonEntropyBits: number;
}

export interface CodonUsageRecord { codon: string; aminoAcid: string; count: number; frequency: number; }
export type MutationEffect = "unchanged" | "synonymous" | "missense" | "nonsense" | "stop-loss" | "start-loss" | "invalid";

export function normalizeDna(input: string, allowIupac = true): string {
  const alphabet = allowIupac ? "ACGTRYSWKMBDHVN" : "ACGTN";
  return input.toUpperCase().replace(/U/g, "T").split("").filter((symbol) => alphabet.includes(symbol)).join("");
}

export function validateDna(input: string, allowIupac = true): SequenceValidation {
  const alphabet = allowIupac ? "ACGTRYSWKMBDHVN" : "ACGTN";
  const invalidSymbols: Array<{ symbol: string; position: number }> = [];
  let normalized = "";
  let ambiguousCount = 0;
  [...input.toUpperCase()].forEach((raw, position) => {
    const symbol = raw === "U" ? "T" : raw;
    if (/\s|\d|[,;:_-]/.test(symbol)) return;
    if (!alphabet.includes(symbol)) invalidSymbols.push({ symbol, position });
    else {
      normalized += symbol;
      if (!"ACGT".includes(symbol)) ambiguousCount += 1;
    }
  });
  return { normalized, valid: invalidSymbols.length === 0, invalidSymbols, ambiguousCount };
}

export function invalidDnaSymbols(input: string): string[] {
  return [...new Set(validateDna(input).invalidSymbols.map((item) => item.symbol))];
}

export function transcribeDna(dna: string): string {
  return normalizeDna(dna).replace(/T/g, "U");
}

export function transcribeTemplateDna(templateDna: string): string {
  return reverseComplementDna(templateDna).replace(/T/g, "U");
}

export function complementDna(dna: string): string {
  return normalizeDna(dna).split("").map((base) => IUPAC_COMPLEMENT[base as IupacDnaSymbol]).join("");
}

export function reverseComplementDna(dna: string): string {
  return complementDna(dna).split("").reverse().join("");
}

export function countNucleotides(dna: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const symbol of normalizeDna(dna)) counts[symbol] = (counts[symbol] ?? 0) + 1;
  return counts;
}

export function gcContent(dna: string, mode: "canonical" | "fractional" = "canonical"): number {
  const normalized = normalizeDna(dna);
  if (mode === "canonical") {
    const canonical = [...normalized].filter((symbol) => "ACGT".includes(symbol));
    if (!canonical.length) return 0;
    return canonical.filter((symbol) => symbol === "G" || symbol === "C").length / canonical.length * 100;
  }
  if (!normalized.length) return 0;
  const expectedGc = [...normalized].reduce((total, symbol) => {
    const possible = IUPAC_POSSIBILITIES[symbol as IupacDnaSymbol];
    return total + possible.filter((base) => base === "G" || base === "C").length / possible.length;
  }, 0);
  return expectedGc / normalized.length * 100;
}

export function shannonEntropy(dna: string): number {
  const normalized = normalizeDna(dna, false).replace(/N/g, "");
  if (!normalized.length) return 0;
  const counts = countNucleotides(normalized);
  return Object.values(counts).reduce((entropy, count) => {
    const probability = count / normalized.length;
    return entropy - probability * Math.log2(probability);
  }, 0);
}

export function summarizeSequence(dna: string): SequenceSummary {
  const normalized = normalizeDna(dna);
  const canonicalLength = [...normalized].filter((symbol) => "ACGT".includes(symbol)).length;
  return {
    length: normalized.length,
    canonicalLength,
    ambiguousLength: normalized.length - canonicalLength,
    counts: countNucleotides(normalized),
    gcCanonicalPercent: gcContent(normalized, "canonical"),
    gcExpectedPercent: gcContent(normalized, "fractional"),
    shannonEntropyBits: shannonEntropy(normalized),
  };
}

export function aminoAcidByCode(database: BiologyDatabase, code: string): AminoAcidRecord | undefined {
  return database.amino_acids.find((amino) => amino.one_letter === code);
}

export function codonByDna(database: BiologyDatabase, dna: string): CodonRecord | undefined {
  const normalized = normalizeDna(dna, false);
  return normalized.length === 3 ? database.codons.find((codon) => codon.dna === normalized) : undefined;
}

export function aminoCodeForCodon(codon: CodonRecord, geneticCode: GeneticCodeId): string {
  return geneticCode === "human_mitochondrial" ? codon.amino_acid_mitochondrial_human : codon.amino_acid_standard;
}

export function isStopCodon(codon: CodonRecord, geneticCode: GeneticCodeId): boolean {
  return aminoCodeForCodon(codon, geneticCode) === "*";
}

export function startCodons(geneticCode: GeneticCodeId): readonly string[] {
  return geneticCode === "human_mitochondrial" ? ["ATA", "ATC", "ATG", "ATT", "GTG"] : ["ATG"];
}

export function translateDna(
  dna: string,
  database: BiologyDatabase,
  options: { frame?: 1 | 2 | 3; strand?: "+" | "-"; geneticCode?: GeneticCodeId; stopAtStop?: boolean } = {},
): TranslationResult {
  const frame = options.frame ?? 1;
  const strand = options.strand ?? "+";
  const geneticCode = options.geneticCode ?? "standard";
  const stopAtStop = options.stopAtStop ?? false;
  const normalizedDna = normalizeDna(dna);
  const oriented = strand === "+" ? normalizedDna : reverseComplementDna(normalizedDna);
  const offset = frame - 1;
  const readable = oriented.slice(offset);
  const fullLength = readable.length - (readable.length % 3);
  const codons = [];
  let protein = "";
  let stopped = false;

  for (let index = 0; index < fullLength; index += 3) {
    const dnaCodon = readable.slice(index, index + 3);
    const record = /^[ACGT]{3}$/.test(dnaCodon) ? codonByDna(database, dnaCodon) : undefined;
    const aminoAcid = record ? aminoCodeForCodon(record, geneticCode) : "X";
    const isStop = aminoAcid === "*";
    const isStart = startCodons(geneticCode).includes(dnaCodon);
    codons.push({ index: offset + index, dna: dnaCodon, rna: transcribeDna(dnaCodon), aminoAcid, isStart, isStop });
    protein += aminoAcid;
    if (isStop && stopAtStop) { stopped = true; break; }
  }

  const consumedBases = stopped ? codons.length * 3 : fullLength;
  return { normalizedDna, strand, frame, geneticCode, protein, codons, remainder: readable.slice(consumedBases), stopped };
}

export function translateSixFrames(dna: string, database: BiologyDatabase, geneticCode: GeneticCodeId = "standard"): TranslationResult[] {
  return (["+", "-"] as const).flatMap((strand) => ([1, 2, 3] as const).map((frame) => translateDna(dna, database, { strand, frame, geneticCode })));
}

export function findOpenReadingFrames(
  dna: string,
  database: BiologyDatabase,
  options: { geneticCode?: GeneticCodeId; minAminoAcids?: number; includeIncomplete?: boolean } = {},
): OrfRecord[] {
  const geneticCode = options.geneticCode ?? "standard";
  const minAminoAcids = options.minAminoAcids ?? 0;
  const includeIncomplete = options.includeIncomplete ?? false;
  const normalized = normalizeDna(dna);
  const results: OrfRecord[] = [];

  for (const strand of ["+", "-"] as const) {
    const oriented = strand === "+" ? normalized : reverseComplementDna(normalized);
    for (const frame of [1, 2, 3] as const) {
      const offset = frame - 1;
      for (let start = offset; start <= oriented.length - 3; start += 3) {
        const startCodon = oriented.slice(start, start + 3);
        if (!startCodons(geneticCode).includes(startCodon)) continue;
        let stopPosition: number | null = null;
        for (let cursor = start + 3; cursor <= oriented.length - 3; cursor += 3) {
          const record = codonByDna(database, oriented.slice(cursor, cursor + 3));
          if (record && isStopCodon(record, geneticCode)) { stopPosition = cursor; break; }
        }
        if (stopPosition === null && !includeIncomplete) continue;
        const endExclusive = stopPosition === null ? oriented.length - ((oriented.length - start) % 3) : stopPosition + 3;
        const orfDna = oriented.slice(start, endExclusive);
        const translation = translateDna(orfDna, database, { geneticCode, stopAtStop: true });
        const protein = translation.protein.replace(/\*$/, "");
        if (protein.length < minAminoAcids) continue;
        const genomicStart = strand === "+" ? start : normalized.length - endExclusive;
        const genomicEnd = strand === "+" ? endExclusive : normalized.length - start;
        results.push({
          strand, frame, start: genomicStart, end: genomicEnd,
          nucleotideLength: orfDna.length, aminoAcidLength: protein.length,
          dna: orfDna, protein, startCodon,
          stopCodon: stopPosition === null ? null : oriented.slice(stopPosition, stopPosition + 3),
          complete: stopPosition !== null,
        });
      }
    }
  }
  return results.sort((a, b) => b.aminoAcidLength - a.aminoAcidLength || a.start - b.start);
}

export function codonUsage(dna: string, database: BiologyDatabase, frame: 1 | 2 | 3 = 1, geneticCode: GeneticCodeId = "standard"): CodonUsageRecord[] {
  const normalized = normalizeDna(dna);
  const readable = normalized.slice(frame - 1);
  const counts = new Map<string, number>();
  let total = 0;
  for (let index = 0; index <= readable.length - 3; index += 3) {
    const codon = readable.slice(index, index + 3);
    if (!/^[ACGT]{3}$/.test(codon)) continue;
    counts.set(codon, (counts.get(codon) ?? 0) + 1);
    total += 1;
  }
  return database.codons.map((record) => ({
    codon: record.dna,
    aminoAcid: aminoCodeForCodon(record, geneticCode),
    count: counts.get(record.dna) ?? 0,
    frequency: total ? (counts.get(record.dna) ?? 0) / total : 0,
  })).sort((a, b) => b.count - a.count || a.codon.localeCompare(b.codon));
}

export function classifyCodonMutation(referenceCodon: string, alternateCodon: string, database: BiologyDatabase, geneticCode: GeneticCodeId = "standard"): MutationEffect {
  const reference = codonByDna(database, referenceCodon);
  const alternate = codonByDna(database, alternateCodon);
  if (!reference || !alternate) return "invalid";
  if (reference.dna === alternate.dna) return "unchanged";
  const from = aminoCodeForCodon(reference, geneticCode);
  const to = aminoCodeForCodon(alternate, geneticCode);
  if (startCodons(geneticCode).includes(reference.dna) && !startCodons(geneticCode).includes(alternate.dna)) return "start-loss";
  if (from === to) return "synonymous";
  if (from !== "*" && to === "*") return "nonsense";
  if (from === "*" && to !== "*") return "stop-loss";
  return "missense";
}

export function hammingDistance(left: string, right: string): number | null {
  const a = normalizeDna(left);
  const b = normalizeDna(right);
  if (a.length !== b.length) return null;
  return [...a].reduce((distance, symbol, index) => distance + (symbol === b[index] ? 0 : 1), 0);
}

export function parseFasta(text: string): Array<{ id: string; description: string; sequence: string }> {
  const records: Array<{ id: string; description: string; sequence: string }> = [];
  let header: string | null = null;
  let sequence: string[] = [];
  const flush = (): void => {
    if (header === null) return;
    const [id = "unnamed", ...description] = header.trim().split(/\s+/);
    records.push({ id, description: description.join(" "), sequence: normalizeDna(sequence.join("")) });
  };
  for (const rawLine of text.replace(/\r/g, "").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith(";")) continue;
    if (line.startsWith(">")) { flush(); header = line.slice(1); sequence = []; }
    else {
      if (header === null) header = "sequence_1";
      sequence.push(line);
    }
  }
  flush();
  return records;
}

export function formatFasta(records: Array<{ id: string; description?: string; sequence: string }>, width = 80): string {
  return records.map((record) => {
    const header = `>${record.id}${record.description ? ` ${record.description}` : ""}`;
    const sequence = normalizeDna(record.sequence);
    const lines = Array.from({ length: Math.ceil(sequence.length / width) }, (_, index) => sequence.slice(index * width, (index + 1) * width));
    return [header, ...lines].join("\n");
  }).join("\n");
}

export function randomDna(length: number, random: () => number = Math.random): string {
  const bases: DnaBase[] = ["A", "C", "G", "T"];
  return Array.from({ length: Math.max(0, Math.floor(length)) }, () => bases[Math.floor(random() * bases.length)] ?? "A").join("");
}

export function pointMutation(dna: string, random: () => number = Math.random): { sequence: string; index: number; from: string; to: string } {
  const normalized = normalizeDna(dna, false);
  if (!normalized.length) return { sequence: "", index: -1, from: "", to: "" };
  const index = Math.floor(random() * normalized.length);
  const from = normalized[index] ?? "A";
  const alternatives = ["A", "C", "G", "T"].filter((base) => base !== from);
  const to = alternatives[Math.floor(random() * alternatives.length)] ?? "A";
  return { sequence: `${normalized.slice(0, index)}${to}${normalized.slice(index + 1)}`, index, from, to };
}

export interface SequenceVariant {
  /** Coordenada base cero sobre la secuencia proporcionada. */
  position: number;
  /** Alelo de referencia; cadena vacía para una inserción. */
  reference: string;
  /** Alelo alternativo; cadena vacía para una deleción. */
  alternate: string;
}

export interface VariantApplicationResult {
  valid: boolean;
  sequence: string;
  variant: SequenceVariant;
  error: string | null;
}

export type CodingVariantEffect =
  | "unchanged"
  | "synonymous"
  | "missense"
  | "nonsense"
  | "stop-loss"
  | "start-loss"
  | "inframe-indel"
  | "frameshift"
  | "invalid";

export interface CodingVariantAnalysis {
  valid: boolean;
  effect: CodingVariantEffect;
  referenceSequence: string;
  alternateSequence: string;
  referenceProtein: string;
  alternateProtein: string;
  firstChangedAminoAcid: number | null;
  affectedReferenceCodon: string | null;
  affectedAlternateCodon: string | null;
  nucleotideDelta: number;
  warning: string;
  error: string | null;
}

export interface GQuadruplexCandidate {
  strand: "+" | "-";
  start: number;
  end: number;
  sequence: string;
  guanineRuns: string[];
  loopLengths: number[];
  evidenceLevel: "computational_prediction";
}

export interface AlleleObservationSummary {
  alternateReads: number;
  totalReads: number;
  referenceReads: number;
  observedAlleleFraction: number;
  wilson95: { lower: number; upper: number };
  warning: string;
}

export interface GenomicInterval<T = unknown> {
  start: number;
  end: number;
  value: T;
}

function normalizeAllele(allele: string): string {
  if (allele === "-" || allele === ".") return "";
  return allele.toUpperCase().replace(/U/g, "T").replace(/\s/g, "");
}

/**
 * Aplica una variante simple sobre una secuencia. No realiza alineamiento ni
 * normalización izquierda de variantes; exige que el alelo de referencia
 * coincida exactamente en la coordenada declarada.
 */
export function applySequenceVariant(sequence: string, variant: SequenceVariant): VariantApplicationResult {
  const normalizedSequence = normalizeDna(sequence);
  const normalizedVariant: SequenceVariant = {
    position: variant.position,
    reference: normalizeAllele(variant.reference),
    alternate: normalizeAllele(variant.alternate),
  };
  if (!Number.isInteger(normalizedVariant.position) || normalizedVariant.position < 0 || normalizedVariant.position > normalizedSequence.length) {
    return { valid: false, sequence: normalizedSequence, variant: normalizedVariant, error: "La posición debe ser una coordenada base cero válida." };
  }
  if (!/^[ACGTRYSWKMBDHVN]*$/.test(normalizedVariant.reference) || !/^[ACGTRYSWKMBDHVN]*$/.test(normalizedVariant.alternate)) {
    return { valid: false, sequence: normalizedSequence, variant: normalizedVariant, error: "Los alelos deben contener símbolos IUPAC de DNA o '-' para vacío." };
  }
  const observed = normalizedSequence.slice(normalizedVariant.position, normalizedVariant.position + normalizedVariant.reference.length);
  if (observed !== normalizedVariant.reference) {
    return {
      valid: false,
      sequence: normalizedSequence,
      variant: normalizedVariant,
      error: `El alelo de referencia no coincide: se esperaba ${normalizedVariant.reference || "∅"} y se observó ${observed || "∅"}.`,
    };
  }
  const alternateSequence = `${normalizedSequence.slice(0, normalizedVariant.position)}${normalizedVariant.alternate}${normalizedSequence.slice(normalizedVariant.position + normalizedVariant.reference.length)}`;
  return { valid: true, sequence: alternateSequence, variant: normalizedVariant, error: null };
}

/**
 * Compara el efecto molecular de una variante sobre una CDS aislada. Este
 * resultado no constituye anotación clínica ni demuestra expresión del gen.
 */
export function analyzeCodingVariant(
  codingDna: string,
  variant: SequenceVariant,
  database: BiologyDatabase,
  options: { frame?: 1 | 2 | 3; geneticCode?: GeneticCodeId } = {},
): CodingVariantAnalysis {
  const frame = options.frame ?? 1;
  const geneticCode = options.geneticCode ?? "standard";
  const referenceSequence = normalizeDna(codingDna);
  const applied = applySequenceVariant(referenceSequence, variant);
  const warning = "Interpretación molecular exploratoria sobre una CDS aislada; no sustituye anotación de transcritos, evidencia funcional ni clasificación clínica.";
  if (!applied.valid) {
    return {
      valid: false, effect: "invalid", referenceSequence, alternateSequence: referenceSequence,
      referenceProtein: "", alternateProtein: "", firstChangedAminoAcid: null,
      affectedReferenceCodon: null, affectedAlternateCodon: null, nucleotideDelta: 0,
      warning, error: applied.error,
    };
  }
  const alternateSequence = applied.sequence;
  const referenceTranslation = translateDna(referenceSequence, database, { frame, geneticCode });
  const alternateTranslation = translateDna(alternateSequence, database, { frame, geneticCode });
  const referenceProtein = referenceTranslation.protein;
  const alternateProtein = alternateTranslation.protein;
  const nucleotideDelta = applied.variant.alternate.length - applied.variant.reference.length;
  let firstChangedAminoAcid: number | null = null;
  const longest = Math.max(referenceProtein.length, alternateProtein.length);
  for (let index = 0; index < longest; index += 1) {
    if (referenceProtein[index] !== alternateProtein[index]) { firstChangedAminoAcid = index; break; }
  }

  const offset = frame - 1;
  const relative = applied.variant.position - offset;
  const codonStart = relative >= 0 ? offset + Math.floor(relative / 3) * 3 : null;
  const affectedReferenceCodon = codonStart === null ? null : referenceSequence.slice(codonStart, codonStart + 3) || null;
  const affectedAlternateCodon = codonStart === null ? null : alternateSequence.slice(codonStart, codonStart + 3) || null;

  let effect: CodingVariantEffect;
  if (referenceSequence === alternateSequence) effect = "unchanged";
  else if (nucleotideDelta % 3 !== 0) effect = "frameshift";
  else if (referenceProtein === alternateProtein) effect = "synonymous";
  else if (nucleotideDelta !== 0) effect = "inframe-indel";
  else {
    const index = firstChangedAminoAcid ?? 0;
    const from = referenceProtein[index] ?? "";
    const to = alternateProtein[index] ?? "";
    if (index === 0 && from === "M" && to !== "M") effect = "start-loss";
    else if (from !== "*" && to === "*") effect = "nonsense";
    else if (from === "*" && to !== "*") effect = "stop-loss";
    else effect = "missense";
  }

  return {
    valid: true, effect, referenceSequence, alternateSequence,
    referenceProtein, alternateProtein, firstChangedAminoAcid,
    affectedReferenceCodon, affectedAlternateCodon, nucleotideDelta,
    warning, error: null,
  };
}

/**
 * Detecta motivos candidatos a G-cuádruplex con el patrón clásico de cuatro
 * tractos G (>=3) separados por bucles de 1 a maxLoop bases. Es una predicción
 * de secuencia y no demuestra formación estructural in vivo.
 */
export function findGQuadruplexCandidates(dna: string, maxLoop = 7): GQuadruplexCandidate[] {
  const normalized = normalizeDna(dna);
  const scan = (oriented: string, strand: "+" | "-"): GQuadruplexCandidate[] => {
    const hits: GQuadruplexCandidate[] = [];
    const motif = new RegExp(`^(G{3,})([ACGTN]{1,${maxLoop}})(G{3,})([ACGTN]{1,${maxLoop}})(G{3,})([ACGTN]{1,${maxLoop}})(G{3,})`);
    for (let index = 0; index < oriented.length; index += 1) {
      const match = oriented.slice(index).match(motif);
      if (!match) continue;
      const sequence = match[0];
      const end = index + sequence.length;
      const genomicStart = strand === "+" ? index : normalized.length - end;
      const genomicEnd = strand === "+" ? end : normalized.length - index;
      hits.push({
        strand, start: genomicStart, end: genomicEnd, sequence,
        guanineRuns: [match[1] ?? "", match[3] ?? "", match[5] ?? "", match[7] ?? ""],
        loopLengths: [(match[2] ?? "").length, (match[4] ?? "").length, (match[6] ?? "").length],
        evidenceLevel: "computational_prediction",
      });
    }
    return hits;
  };
  const combined = [...scan(normalized, "+"), ...scan(reverseComplementDna(normalized), "-")];
  const unique = new Map<string, GQuadruplexCandidate>();
  for (const hit of combined) unique.set(`${hit.strand}:${hit.start}:${hit.end}`, hit);
  return [...unique.values()].sort((a, b) => a.start - b.start || a.end - b.end || a.strand.localeCompare(b.strand));
}

/** Calcula fracción alélica observada y un intervalo Wilson del 95 %. */
export function summarizeAlleleObservation(alternateReads: number, totalReads: number): AlleleObservationSummary {
  if (!Number.isInteger(alternateReads) || !Number.isInteger(totalReads) || totalReads <= 0 || alternateReads < 0 || alternateReads > totalReads) {
    throw new Error("Los conteos deben ser enteros, totalReads > 0 y 0 <= alternateReads <= totalReads.");
  }
  const p = alternateReads / totalReads;
  const z = 1.959963984540054;
  const z2 = z * z;
  const denominator = 1 + z2 / totalReads;
  const center = (p + z2 / (2 * totalReads)) / denominator;
  const margin = z * Math.sqrt((p * (1 - p) + z2 / (4 * totalReads)) / totalReads) / denominator;
  return {
    alternateReads,
    totalReads,
    referenceReads: totalReads - alternateReads,
    observedAlleleFraction: p,
    wilson95: { lower: Math.max(0, center - margin), upper: Math.min(1, center + margin) },
    warning: "La fracción de lecturas no equivale directamente a la fracción de células; considere pureza, ploidía, sesgos de captura, mapeo y errores de secuenciación.",
  };
}

export function intervalsOverlap(leftStart: number, leftEnd: number, rightStart: number, rightEnd: number): boolean {
  if (![leftStart, leftEnd, rightStart, rightEnd].every(Number.isFinite)) return false;
  return leftStart < rightEnd && rightStart < leftEnd;
}

export function annotatePositionWithIntervals<T>(position: number, intervals: readonly GenomicInterval<T>[]): T[] {
  if (!Number.isInteger(position) || position < 0) return [];
  return intervals.filter((interval) => interval.start <= position && position < interval.end).map((interval) => interval.value);
}
