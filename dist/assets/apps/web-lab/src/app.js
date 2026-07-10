import { ChallengeController } from "./ui/challenge-controller.js";
import { EncyclopediaController } from "./ui/encyclopedia-controller.js";
import { EvolutionController } from "./ui/evolution-controller.js";
import { LabController } from "./ui/lab-controller.js";
import { initializeNavigation } from "./ui/navigation.js";
import { SequenceController } from "./ui/sequence-controller.js";
import { ResearchController } from "./ui/research-controller.js";
async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok)
        throw new Error(`No se pudo cargar ${path} (${response.status}).`);
    return response.json();
}
async function main() {
    const [database, registry, profiles] = await Promise.all([
        loadJson("data/biology.json"),
        loadJson("data/modules.json"),
        loadJson("data/organism-profiles.json"),
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
main().catch((error) => {
    const message = error instanceof Error ? error.message : "Error desconocido";
    document.body.innerHTML = `<main><article class="panel"><h1>No se pudo iniciar Human Genome Labs</h1><p>${message}</p><p>Ejecuta <code>pnpm dev</code> desde la raíz.</p></article></main>`;
});
//# sourceMappingURL=app.js.map