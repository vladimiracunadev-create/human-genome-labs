export type Polymer = "DNA" | "RNA";
export type Strandedness = "single" | "double" | "mixed" | "partially_double" | "configurable" | "unknown";
export interface OrganismProfile {
  id: string; version: string; taxonomyId: number | null; scientificName: string; compartment: string;
  polymer: Polymer; strandedness: Strandedness; topology: string; segmentation: string; geneticCode: string;
  defaultReferenceAssembly: string | null; status: "concept" | "experimental" | "validated" | "stable" | "deprecated";
  limitations: string[];
}
export interface OrganismProfileDatabase { schemaVersion: string; profiles: OrganismProfile[]; }
export function profileById(database: OrganismProfileDatabase, id: string): OrganismProfile | undefined { return database.profiles.find((profile) => profile.id === id); }
export function validateOrganismProfile(profile: OrganismProfile): string[] {
  const errors: string[] = [];
  if (!profile.id.trim()) errors.push("id obligatorio");
  if (!profile.version.trim()) errors.push("version obligatoria");
  if (!profile.scientificName.trim()) errors.push("scientificName obligatorio");
  if (!profile.limitations.length) errors.push("debe declarar al menos una limitación");
  return errors;
}
