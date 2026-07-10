import type { ModuleMaturity } from "../../../../packages/scientific-contracts/src/index.js";
import type { OrganismProfileDatabase } from "../../../../packages/organism-profiles/src/index.js";
interface ModuleEntry {
    id: string;
    titleEs: string;
    descriptionEs: string;
    version: string;
    maturity: ModuleMaturity;
    capabilities: string[];
    evidenceLevel: string;
    limitations: string[];
    roadmap: string[];
}
interface CapabilityEntry {
    id: string;
    titleEs: string;
    descriptionEs: string;
    moduleId: string;
    maturity: ModuleMaturity;
    interfaces: string[];
}
interface Registry {
    projectVersion: string;
    modules: ModuleEntry[];
    capabilities: CapabilityEntry[];
}
export declare class EvolutionController {
    #private;
    constructor(registry: Registry, profiles: OrganismProfileDatabase);
}
export {};
