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

export function createScientificResult<T>(options: Omit<ScientificResult<T>, "contractVersion" | "generatedAt"> & { generatedAt?: string }): ScientificResult<T> {
  return {
    contractVersion: "1.0.0",
    analysis: options.analysis,
    moduleId: options.moduleId,
    moduleVersion: options.moduleVersion,
    maturity: options.maturity,
    status: options.status,
    evidenceLevel: options.evidenceLevel,
    input: options.input,
    parameters: options.parameters,
    result: options.result,
    warnings: [...options.warnings],
    limitations: [...options.limitations],
    generatedAt: options.generatedAt ?? new Date().toISOString(),
  };
}

export function oneBasedClosedToZeroBasedHalfOpen(sequenceId: string, start: number, end: number, strand?: GenomicInterval["strand"]): GenomicInterval {
  if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start) throw new Error("Las coordenadas 1-based closed deben cumplir 1 <= start <= end.");
  const interval: GenomicInterval = { sequenceId, start: start - 1, end, coordinateConvention: "zero_based_half_open" };
  if (strand !== undefined) interval.strand = strand;
  return interval;
}

export function zeroBasedHalfOpenToOneBasedClosed(interval: GenomicInterval): { sequenceId: string; start: number; end: number; strand?: GenomicInterval["strand"]; coordinateConvention: "one_based_closed" } {
  if (!Number.isInteger(interval.start) || !Number.isInteger(interval.end) || interval.start < 0 || interval.end < interval.start) throw new Error("Intervalo 0-based half-open inválido.");
  const result: { sequenceId: string; start: number; end: number; strand?: GenomicInterval["strand"]; coordinateConvention: "one_based_closed" } = {
    sequenceId: interval.sequenceId, start: interval.start + 1, end: interval.end, coordinateConvention: "one_based_closed",
  };
  if (interval.strand !== undefined) result.strand = interval.strand;
  return result;
}
