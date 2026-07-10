export type Polymer = "DNA" | "RNA";
export type Strandedness = "single" | "double" | "mixed" | "partially_double" | "configurable" | "unknown";
export interface OrganismProfile {
    id: string;
    version: string;
    taxonomyId: number | null;
    scientificName: string;
    compartment: string;
    polymer: Polymer;
    strandedness: Strandedness;
    topology: string;
    segmentation: string;
    geneticCode: string;
    defaultReferenceAssembly: string | null;
    status: "concept" | "experimental" | "validated" | "stable" | "deprecated";
    limitations: string[];
}
export interface OrganismProfileDatabase {
    schemaVersion: string;
    profiles: OrganismProfile[];
}
export declare function profileById(database: OrganismProfileDatabase, id: string): OrganismProfile | undefined;
export declare function validateOrganismProfile(profile: OrganismProfile): string[];
