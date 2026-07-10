import type { ModuleMaturity } from "../../../../packages/scientific-contracts/src/index.js";
import type { OrganismProfileDatabase } from "../../../../packages/organism-profiles/src/index.js";
import { byId, escapeHtml } from "./dom.js";

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
interface CapabilityEntry { id: string; titleEs: string; descriptionEs: string; moduleId: string; maturity: ModuleMaturity; interfaces: string[]; }
interface Registry { projectVersion: string; modules: ModuleEntry[]; capabilities: CapabilityEntry[]; }

const MATURITY_ORDER: ModuleMaturity[] = ["concept", "experimental", "validated", "stable", "deprecated"];

export class EvolutionController {
  readonly #registry: Registry;
  readonly #profiles: OrganismProfileDatabase;

  constructor(registry: Registry, profiles: OrganismProfileDatabase) {
    this.#registry = registry;
    this.#profiles = profiles;
    this.#populateFilter();
    this.#render();
    this.#renderProfiles();
    byId<HTMLSelectElement>("moduleMaturityFilter").addEventListener("change", () => this.#render());
    byId<HTMLElement>("platformVersion").textContent = registry.projectVersion;
  }

  #populateFilter(): void {
    const counts = new Map<ModuleMaturity, number>();
    for (const module of this.#registry.modules) counts.set(module.maturity, (counts.get(module.maturity) ?? 0) + 1);
    byId<HTMLSelectElement>("moduleMaturityFilter").innerHTML = [
      `<option value="all">Todos (${this.#registry.modules.length})</option>`,
      ...MATURITY_ORDER.filter((item) => counts.has(item)).map((item) => `<option value="${item}">${item} (${counts.get(item)})</option>`),
    ].join("");
  }

  #render(): void {
    const filter = byId<HTMLSelectElement>("moduleMaturityFilter").value;
    const modules = this.#registry.modules
      .filter((module) => filter === "all" || module.maturity === filter)
      .sort((left, right) => MATURITY_ORDER.indexOf(left.maturity) - MATURITY_ORDER.indexOf(right.maturity) || left.id.localeCompare(right.id));
    byId<HTMLDivElement>("moduleRegistryGrid").innerHTML = modules.map((module) => {
      const capabilities = this.#registry.capabilities.filter((capability) => capability.moduleId === module.id);
      return `<article class="knowledge-card">
        <p class="eyebrow">${escapeHtml(module.maturity)} · v${escapeHtml(module.version)}</p>
        <h3>${escapeHtml(module.titleEs)}</h3>
        <p>${escapeHtml(module.descriptionEs)}</p>
        <p><strong>Evidencia:</strong> ${escapeHtml(module.evidenceLevel)}</p>
        <p><strong>Capacidades:</strong> ${capabilities.map((item) => `<code>${escapeHtml(item.id)}</code>`).join(" ") || "—"}</p>
        <details><summary>Limitaciones y próximos pasos</summary>
          <ul>${module.limitations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <p><strong>Roadmap:</strong></p><ul>${module.roadmap.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </details>
      </article>`;
    }).join("");
  }

  #renderProfiles(): void {
    byId<HTMLDivElement>("organismProfileGrid").innerHTML = this.#profiles.profiles.map((profile) => `<article class="knowledge-card">
      <p class="eyebrow">${escapeHtml(profile.status)} · ${escapeHtml(profile.polymer)}</p>
      <h3>${escapeHtml(profile.scientificName)}</h3>
      <p>${escapeHtml(profile.compartment)} · ${escapeHtml(profile.strandedness)} · ${escapeHtml(profile.topology)}</p>
      <p><strong>Código:</strong> ${escapeHtml(profile.geneticCode)}</p>
      <p class="warning-note">${escapeHtml(profile.limitations.join(" "))}</p>
    </article>`).join("");
  }
}
