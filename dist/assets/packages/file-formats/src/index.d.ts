import { type GenomicInterval } from "../../scientific-contracts/src/index.js";
export interface FastaRecord {
    id: string;
    description: string;
    sequence: string;
}
export interface Gff3Feature {
    sequenceId: string;
    source: string;
    type: string;
    start: number;
    end: number;
    score: number | null;
    strand: "+" | "-" | "." | "?";
    phase: 0 | 1 | 2 | null;
    attributes: Record<string, string[]>;
    interval: GenomicInterval;
    lineNumber: number;
}
export interface VcfHeader {
    fileFormat: string | null;
    metadata: Record<string, string[]>;
    columns: string[];
    samples: string[];
}
export interface VcfRecord {
    chromosome: string;
    position1: number;
    position0: number;
    id: string | null;
    reference: string;
    alternates: string[];
    quality: number | null;
    filters: string[];
    info: Record<string, string | true | string[]>;
    formatKeys: string[];
    sampleValues: Record<string, Record<string, string>>;
    lineNumber: number;
}
export declare function parseFasta(text: string, options?: {
    normalizeWhitespace?: boolean;
}): FastaRecord[];
export declare function formatFasta(records: readonly FastaRecord[], width?: number): string;
export declare function parseGff3(text: string): {
    version: string | null;
    directives: string[];
    features: Gff3Feature[];
};
export declare function parseVcf(text: string): {
    header: VcfHeader;
    records: VcfRecord[];
};
