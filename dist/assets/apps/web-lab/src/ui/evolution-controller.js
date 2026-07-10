import { byId, escapeHtml } from "./dom.js";
const MATURITY_ORDER = ["concept", "experimental", "validated", "stable", "deprecated"];
export class EvolutionController {
    #registry;
    #profiles;
    constructor(registry, profiles) {
        this.#registry = registry;
        this.#profiles = profiles;
        this.#populateFilter();
        this.#render();
        this.#renderProfiles();
        byId("moduleMaturityFilter").addEventListener("change", () => this.#render());
        byId("platformVersion").textContent = registry.projectVersion;
    }
    #populateFilter() {
        const counts = new Map();
        for (const module of this.#registry.modules)
            counts.set(module.maturity, (counts.get(module.maturity) ?? 0) + 1);
        byId("moduleMaturityFilter").innerHTML = [
            `<option value="all">Todos (${this.#registry.modules.length})</option>`,
            ...MATURITY_ORDER.filter((item) => counts.has(item)).map((item) => `<option value="${item}">${item} (${counts.get(item)})</option>`),
        ].join("");
    }
    #render() {
        const filter = byId("moduleMaturityFilter").value;
        const modules = this.#registry.modules
            .filter((module) => filter === "all" || module.maturity === filter)
            .sort((left, right) => MATURITY_ORDER.indexOf(left.maturity) - MATURITY_ORDER.indexOf(right.maturity) || left.id.localeCompare(right.id));
        byId("moduleRegistryGrid").innerHTML = modules.map((module) => {
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
    #renderProfiles() {
        byId("organismProfileGrid").innerHTML = this.#profiles.profiles.map((profile) => `<article class="knowledge-card">
      <p class="eyebrow">${escapeHtml(profile.status)} · ${escapeHtml(profile.polymer)}</p>
      <h3>${escapeHtml(profile.scientificName)}</h3>
      <p>${escapeHtml(profile.compartment)} · ${escapeHtml(profile.strandedness)} · ${escapeHtml(profile.topology)}</p>
      <p><strong>Código:</strong> ${escapeHtml(profile.geneticCode)}</p>
      <p class="warning-note">${escapeHtml(profile.limitations.join(" "))}</p>
    </article>`).join("");
    }
}
//# sourceMappingURL=evolution-controller.js.map