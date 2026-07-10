import type { BiologyDatabase } from "../../../packages/biology-data/src/index.js";
import type { OrganismProfileDatabase } from "../../../packages/organism-profiles/src/index.js";
import { ChallengeController } from "./ui/challenge-controller.js";
import { EncyclopediaController } from "./ui/encyclopedia-controller.js";
import { EvolutionController } from "./ui/evolution-controller.js";
import { LabController } from "./ui/lab-controller.js";
import { initializeNavigation } from "./ui/navigation.js";
import { SequenceController } from "./ui/sequence-controller.js";
import { ResearchController } from "./ui/research-controller.js";

interface Registry { projectVersion: string; modules: Array<{ id: string; titleEs: string; descriptionEs: string; version: string; maturity: "concept" | "experimental" | "validated" | "stable" | "deprecated"; capabilities: string[]; evidenceLevel: string; limitations: string[]; roadmap: string[] }>; capabilities: Array<{ id: string; titleEs: string; descriptionEs: string; moduleId: string; maturity: "concept" | "experimental" | "validated" | "stable" | "deprecated"; interfaces: string[] }>; }

async function loadJson<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`No se pudo cargar ${path} (${response.status}).`);
  return response.json() as Promise<T>;
}

async function main(): Promise<void> {
  const [database, registry, profiles] = await Promise.all([
    loadJson<BiologyDatabase>("data/biology.json"),
    loadJson<Registry>("data/modules.json"),
    loadJson<OrganismProfileDatabase>("data/organism-profiles.json"),
  ]);
  initializeNavigation();
  new SequenceController(database);
  new ResearchController(database);
  new EvolutionController(registry, profiles);
  new LabController(database);
  new ChallengeController(database);
  new EncyclopediaController(database);
  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    window.addEventListener("load", () => navigator.serviceWorker.register("service-worker.js").catch(console.warn));
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Error desconocido";
  document.body.innerHTML = `<main><article class="panel"><h1>No se pudo iniciar Human Genome Labs</h1><p>${message}</p><p>Ejecuta <code>pnpm dev</code> desde la raíz.</p></article></main>`;
});
