export type DnaBase = "A" | "C" | "G" | "T";
export type RnaBase = "A" | "C" | "G" | "U";
export type IupacDnaSymbol = DnaBase | "R" | "Y" | "S" | "W" | "K" | "M" | "B" | "D" | "H" | "V" | "N";
export type GeneticCodeId = "standard" | "human_mitochondrial";
export type GameMode = "codon_to_amino" | "amino_to_codon" | "dna_to_rna" | "complement" | "mixed";
export type EvidenceLevelId = "observed" | "experimentally_supported" | "computational_prediction" | "hypothesis" | "unknown";

export interface BaseRecord {
  symbol: string;
  name_es: string;
  type: string;
  in_dna: boolean;
  in_rna: boolean;
  pairs_dna_with?: string;
  pairs_rna_with?: string;
}

export interface IupacSymbolRecord {
  symbol: IupacDnaSymbol;
  name_es: string;
  possible_bases: DnaBase[];
  complement: IupacDnaSymbol;
  ambiguous: boolean;
}

export interface AminoAcidRecord {
  one_letter: string;
  three_letter: string;
  name_es: string;
  name_en: string;
  category: string;
  charge: string;
  polarity: string;
  side_chain: string;
  mass: number | null;
  description: string;
  codons_dna: string[];
  codons_rna: string[];
  canonical: boolean;
}

export interface CodonRecord {
  dna: string;
  rna: string;
  amino_acid: string;
  is_start: boolean;
  is_stop: boolean;
  amino_acid_standard: string;
  amino_acid_mitochondrial_human: string;
}

export interface SourceRecord {
  id: string;
  name: string;
  authority: string;
  url: string;
  accessed: string;
  purpose?: string;
}

export interface EvidenceLevelRecord {
  id: EvidenceLevelId;
  name_es: string;
  description_es: string;
  rank: number;
}

export interface GenomeRepresentationRecord {
  id: string;
  name_es: string;
  unit: string;
  description_es: string;
  strengths: string[];
  limitations: string[];
  source_ids: string[];
}

export interface ResearchFrontierRecord {
  id: string;
  order: number;
  title_es: string;
  question_es: string;
  why_open_es: string;
  current_approaches: string[];
  data_types: string[];
  maturity: string;
  evidence_level: EvidenceLevelId;
  source_ids: string[];
}

export interface AssayRecord {
  id: string;
  name: string;
  domain: string;
  measures_es: string;
  typical_outputs: string[];
  strengths: string[];
  limitations: string[];
  evidence_level: EvidenceLevelId;
}

export interface EpigeneticMarkRecord {
  id: string;
  name: string;
  molecule: string;
  typical_association_es: string;
  caution_es: string;
}

export interface ChromatinFeatureRecord {
  id: string;
  name_es: string;
  scale: string;
  description_es: string;
}

export interface SingleCellModalityRecord {
  id: string;
  name: string;
  measures: string[];
  unit: string;
  main_challenges: string[];
}

export interface DnaRepairPathwayRecord {
  id: string;
  name_es: string;
  abbreviation: string;
  primary_damage: string[];
  template_use: string;
  notes_es: string;
}

export interface NoncanonicalStructureRecord {
  id: string;
  name_es: string;
  polymer: string[];
  scope: string;
  participants_es: string;
  sequence_signal_es: string;
  evidence_warning_es: string;
  source_ids: string[];
}

export interface GenomeEditingToolRecord {
  id: string;
  name: string;
  edit_class: string;
  capability_es: string;
  main_risks: string[];
  source_ids: string[];
}

export interface EthicalPrincipleRecord {
  id: string;
  name_es: string;
  requirement_es: string;
}

export interface ConceptRecord { term: string; definition_es: string; }
export interface GameModeRecord { id: GameMode; name_es: string; }

export interface BiologyDatabase {
  metadata: Record<string, unknown> & { title: string; version: string; schema_version: string; limitations: string[] };
  sources: SourceRecord[];
  reference_assemblies: Array<Record<string, unknown> & { id: string; assembly_name: string; refseq_accession: string }>;
  proteomes: Array<Record<string, unknown> & { id: string; organism: string }>;
  iupac_dna_symbols: IupacSymbolRecord[];
  bases: BaseRecord[];
  base_pairs?: unknown[];
  amino_acids: AminoAcidRecord[];
  codons: CodonRecord[];
  signals: {
    standard_start: Array<{ dna: string; rna: string; amino_acid?: string; name_es?: string }>;
    standard_stop: Array<{ dna: string; rna: string }>;
  };
  genetic_codes: {
    standard: { table_number: number; description_es: string };
    human_mitochondrial: {
      table_number: number;
      description_es: string;
      differences_from_standard: Array<{ dna: string; rna: string; standard: string; mitochondrial: string }>;
    };
  };
  concepts: ConceptRecord[];
  human_chromosomes?: unknown[];
  game: {
    modes: GameModeRecord[];
    scoring: { correct_base: number; streak_bonus: number; rounds: number; lives: number };
    role?: string;
  };
  molecules: unknown[];
  processes: unknown[];
  mutation_types: unknown[];
  evidence_levels: EvidenceLevelRecord[];
  genome_representations: GenomeRepresentationRecord[];
  research_frontiers: ResearchFrontierRecord[];
  assay_catalog: AssayRecord[];
  epigenetic_marks: EpigeneticMarkRecord[];
  chromatin_features: ChromatinFeatureRecord[];
  single_cell_modalities: SingleCellModalityRecord[];
  dna_repair_pathways: DnaRepairPathwayRecord[];
  noncanonical_structures: NoncanonicalStructureRecord[];
  genome_editing_tools: GenomeEditingToolRecord[];
  ethical_principles: EthicalPrincipleRecord[];
}

export interface TranslationCodon {
  index: number;
  dna: string;
  rna: string;
  aminoAcid: string;
  isStart: boolean;
  isStop: boolean;
}

export interface TranslationResult {
  normalizedDna: string;
  strand: "+" | "-";
  frame: 1 | 2 | 3;
  geneticCode: GeneticCodeId;
  protein: string;
  codons: TranslationCodon[];
  remainder: string;
  stopped: boolean;
}

export interface OrfRecord {
  strand: "+" | "-";
  frame: 1 | 2 | 3;
  start: number;
  end: number;
  nucleotideLength: number;
  aminoAcidLength: number;
  dna: string;
  protein: string;
  startCodon: string;
  stopCodon: string | null;
  complete: boolean;
}

export interface GameQuestion {
  mode: Exclude<GameMode, "mixed">;
  label: string;
  text: string;
  visual: string;
  correct: string;
  options: string[];
  explanation: string;
}
