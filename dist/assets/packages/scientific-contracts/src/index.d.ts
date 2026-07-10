export type ModuleMaturity = "concept" | "experimental" | "validated" | "stable" | "deprecated";
export type EvidenceLevel = "observed" | "experimentally_supported" | "computational_prediction" | "hypothesis" | "unknown";
export type ScientificStatus = "success" | "warning" | "error";
export type CoordinateConvention = "zero_based_half_open" | "one_based_closed";
export interface ScientificInputProvenance {
    source?: string;
    checksumSha256?: string;
    referenceAssembly?: string;
    organismProfile?: string;
    coordinateConvention?: CoordinateConvention;
}
export interface ScientificResult<T> {
    contractVersion: "1.0.0";
    analysis: string;
    moduleId: string;
    moduleVersion: string;
    maturity: ModuleMaturity;
    status: ScientificStatus;
    evidenceLevel: EvidenceLevel;
    input: ScientificInputProvenance;
    parameters: Record<string, unknown>;
    result: T;
    warnings: string[];
    limitations: string[];
    generatedAt: string;
}
export interface GenomicInterval {
    sequenceId: string;
    start: number;
    end: number;
    strand?: "+" | "-" | "." | "?";
    coordinateConvention: "zero_based_half_open";
}
export interface CapabilityDescriptor {
    id: string;
    titleEs: string;
    descriptionEs: string;
    moduleId: string;
    maturity: ModuleMaturity;
    evidenceLevel: EvidenceLevel;
    inputs: string[];
    outputs: string[];
    interfaces: Array<"library" | "cli" | "web" | "game" | "api">;
    limitations: string[];
}
export interface ModuleManifest {
    schemaVersion: "1.0.0";
    id: string;
    titleEs: string;
    descriptionEs: string;
    version: string;
    maturity: ModuleMaturity;
    package?: string;
    entrypoint?: string;
    capabilities: string[];
    evidenceLevel: EvidenceLevel;
    clinicalUse: false;
    inputs: string[];
    outputs: string[];
    limitations: string[];
    sourceIds: string[];
    owners: string[];
    roadmap: string[];
}
export declare function createScientificResult<T>(options: Omit<ScientificResult<T>, "contractVersion" | "generatedAt"> & {
    generatedAt?: string;
}): ScientificResult<T>;
export declare function oneBasedClosedToZeroBasedHalfOpen(sequenceId: string, start: number, end: number, strand?: GenomicInterval["strand"]): GenomicInterval;
export declare function zeroBasedHalfOpenToOneBasedClosed(interval: GenomicInterval): {
    sequenceId: string;
    start: number;
    end: number;
    strand?: GenomicInterval["strand"];
    coordinateConvention: "one_based_closed";
};
