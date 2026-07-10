import type { AminoAcidRecord, BiologyDatabase, CodonRecord, GeneticCodeId, OrfRecord, TranslationResult } from "../../biology-data/src/index.js";
export interface SequenceValidation {
    normalized: string;
    valid: boolean;
    invalidSymbols: Array<{
        symbol: string;
        position: number;
    }>;
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
export interface CodonUsageRecord {
    codon: string;
    aminoAcid: string;
    count: number;
    frequency: number;
}
export type MutationEffect = "unchanged" | "synonymous" | "missense" | "nonsense" | "stop-loss" | "start-loss" | "invalid";
export declare function normalizeDna(input: string, allowIupac?: boolean): string;
export declare function validateDna(input: string, allowIupac?: boolean): SequenceValidation;
export declare function invalidDnaSymbols(input: string): string[];
export declare function transcribeDna(dna: string): string;
export declare function transcribeTemplateDna(templateDna: string): string;
export declare function complementDna(dna: string): string;
export declare function reverseComplementDna(dna: string): string;
export declare function countNucleotides(dna: string): Record<string, number>;
export declare function gcContent(dna: string, mode?: "canonical" | "fractional"): number;
export declare function shannonEntropy(dna: string): number;
export declare function summarizeSequence(dna: string): SequenceSummary;
export declare function aminoAcidByCode(database: BiologyDatabase, code: string): AminoAcidRecord | undefined;
export declare function codonByDna(database: BiologyDatabase, dna: string): CodonRecord | undefined;
export declare function aminoCodeForCodon(codon: CodonRecord, geneticCode: GeneticCodeId): string;
export declare function isStopCodon(codon: CodonRecord, geneticCode: GeneticCodeId): boolean;
export declare function startCodons(geneticCode: GeneticCodeId): readonly string[];
export declare function translateDna(dna: string, database: BiologyDatabase, options?: {
    frame?: 1 | 2 | 3;
    strand?: "+" | "-";
    geneticCode?: GeneticCodeId;
    stopAtStop?: boolean;
}): TranslationResult;
export declare function translateSixFrames(dna: string, database: BiologyDatabase, geneticCode?: GeneticCodeId): TranslationResult[];
export declare function findOpenReadingFrames(dna: string, database: BiologyDatabase, options?: {
    geneticCode?: GeneticCodeId;
    minAminoAcids?: number;
    includeIncomplete?: boolean;
}): OrfRecord[];
export declare function codonUsage(dna: string, database: BiologyDatabase, frame?: 1 | 2 | 3, geneticCode?: GeneticCodeId): CodonUsageRecord[];
export declare function classifyCodonMutation(referenceCodon: string, alternateCodon: string, database: BiologyDatabase, geneticCode?: GeneticCodeId): MutationEffect;
export declare function hammingDistance(left: string, right: string): number | null;
export declare function parseFasta(text: string): Array<{
    id: string;
    description: string;
    sequence: string;
}>;
export declare function formatFasta(records: Array<{
    id: string;
    description?: string;
    sequence: string;
}>, width?: number): string;
export declare function randomDna(length: number, random?: () => number): string;
export declare function pointMutation(dna: string, random?: () => number): {
    sequence: string;
    index: number;
    from: string;
    to: string;
};
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
export type CodingVariantEffect = "unchanged" | "synonymous" | "missense" | "nonsense" | "stop-loss" | "start-loss" | "inframe-indel" | "frameshift" | "invalid";
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
    wilson95: {
        lower: number;
        upper: number;
    };
    warning: string;
}
export interface GenomicInterval<T = unknown> {
    start: number;
    end: number;
    value: T;
}
/**
 * Aplica una variante simple sobre una secuencia. No realiza alineamiento ni
 * normalización izquierda de variantes; exige que el alelo de referencia
 * coincida exactamente en la coordenada declarada.
 */
export declare function applySequenceVariant(sequence: string, variant: SequenceVariant): VariantApplicationResult;
/**
 * Compara el efecto molecular de una variante sobre una CDS aislada. Este
 * resultado no constituye anotación clínica ni demuestra expresión del gen.
 */
export declare function analyzeCodingVariant(codingDna: string, variant: SequenceVariant, database: BiologyDatabase, options?: {
    frame?: 1 | 2 | 3;
    geneticCode?: GeneticCodeId;
}): CodingVariantAnalysis;
/**
 * Detecta motivos candidatos a G-cuádruplex con el patrón clásico de cuatro
 * tractos G (>=3) separados por bucles de 1 a maxLoop bases. Es una predicción
 * de secuencia y no demuestra formación estructural in vivo.
 */
export declare function findGQuadruplexCandidates(dna: string, maxLoop?: number): GQuadruplexCandidate[];
/** Calcula fracción alélica observada y un intervalo Wilson del 95 %. */
export declare function summarizeAlleleObservation(alternateReads: number, totalReads: number): AlleleObservationSummary;
export declare function intervalsOverlap(leftStart: number, leftEnd: number, rightStart: number, rightEnd: number): boolean;
export declare function annotatePositionWithIntervals<T>(position: number, intervals: readonly GenomicInterval<T>[]): T[];
