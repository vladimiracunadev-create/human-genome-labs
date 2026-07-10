import { analyzeCodingVariant, findGQuadruplexCandidates, summarizeAlleleObservation } from "../../../../packages/genetics-core/src/index.js";
import { byId, escapeHtml } from "./dom.js";
const effectLabels = {
    unchanged: "sin cambio",
    synonymous: "sinónima",
    missense: "missense",
    nonsense: "nonsense",
    "stop-loss": "pérdida de STOP",
    "start-loss": "pérdida de inicio",
    "inframe-indel": "indel en marco",
    frameshift: "cambio de marco",
    invalid: "inválida",
};
export class ResearchController {
    #database;
    constructor(database) {
        this.#database = database;
        this.#initializeFrontiers();
        this.#renderAssays();
        byId("analyzeVariant").addEventListener("click", () => this.#analyzeVariant());
        byId("scanG4").addEventListener("click", () => this.#scanG4());
        byId("summarizeAllele").addEventListener("click", () => this.#summarizeAllele());
    }
    #initializeFrontiers() {
        const select = byId("frontierFilter");
        select.innerHTML = [
            '<option value="all">Todas las fronteras</option>',
            ...this.#database.research_frontiers
                .sort((a, b) => a.order - b.order)
                .map((frontier) => `<option value="${escapeHtml(frontier.id)}">${frontier.order}. ${escapeHtml(frontier.title_es)}</option>`),
        ].join("");
        select.addEventListener("change", () => this.#renderFrontiers());
        this.#renderFrontiers();
    }
    #sourceNames(frontier) {
        return frontier.source_ids
            .map((id) => this.#database.sources.find((source) => source.id === id)?.name ?? id)
            .map(escapeHtml)
            .join(" · ");
    }
    #renderFrontiers() {
        const selected = byId("frontierFilter").value;
        const frontiers = this.#database.research_frontiers
            .filter((frontier) => selected === "all" || frontier.id === selected)
            .sort((a, b) => a.order - b.order);
        byId("researchFrontierGrid").innerHTML = frontiers.map((frontier) => `
      <article class="info-card frontier-card">
        <p class="eyebrow">FRONTERA ${frontier.order} · ${escapeHtml(frontier.evidence_level)}</p>
        <h3>${escapeHtml(frontier.title_es)}</h3>
        <p><strong>Pregunta:</strong> ${escapeHtml(frontier.question_es)}</p>
        <p><strong>Por qué sigue abierta:</strong> ${escapeHtml(frontier.why_open_es)}</p>
        <div class="badges">${frontier.current_approaches.map((value) => `<span class="badge">${escapeHtml(value)}</span>`).join("")}</div>
        <p class="source-line"><strong>Datos:</strong> ${frontier.data_types.map(escapeHtml).join(", ")}</p>
        <p class="source-line"><strong>Fuentes:</strong> ${this.#sourceNames(frontier)}</p>
      </article>`).join("");
    }
    #renderAssays() {
        byId("assayGrid").innerHTML = this.#database.assay_catalog.map((assay) => `
      <article class="info-card">
        <p class="eyebrow">${escapeHtml(assay.domain)}</p>
        <h3>${escapeHtml(assay.name)}</h3>
        <p>${escapeHtml(assay.measures_es)}</p>
        <p><strong>Salidas:</strong> ${assay.typical_outputs.map(escapeHtml).join(", ")}</p>
        <p><strong>Limitaciones:</strong> ${assay.limitations.map(escapeHtml).join("; ")}</p>
        <span class="badge evidence-badge">${escapeHtml(assay.evidence_level)}</span>
      </article>`).join("");
    }
    #analyzeVariant() {
        const sequence = byId("researchSequence").value;
        const position = Number(byId("variantPosition").value);
        const reference = byId("variantRef").value || "-";
        const alternate = byId("variantAlt").value || "-";
        const frame = Number(byId("variantFrame").value);
        const geneticCode = byId("variantCode").value;
        const analysis = analyzeCodingVariant(sequence, { position, reference, alternate }, this.#database, { frame, geneticCode });
        const target = byId("variantResult");
        if (!analysis.valid) {
            target.innerHTML = `<p class="feedback bad">${escapeHtml(analysis.error ?? "Variante inválida")}</p>`;
            return;
        }
        target.innerHTML = `
      <div class="result-callout">
        <p class="eyebrow">EFECTO MOLECULAR EXPLORATORIO</p>
        <h3>${escapeHtml(effectLabels[analysis.effect] ?? analysis.effect)}</h3>
        <dl class="sequence-results">
          <dt>CDS de referencia</dt><dd>${escapeHtml(analysis.referenceSequence)}</dd>
          <dt>CDS alternativa</dt><dd>${escapeHtml(analysis.alternateSequence)}</dd>
          <dt>Proteína de referencia</dt><dd>${escapeHtml(analysis.referenceProtein || "—")}</dd>
          <dt>Proteína alternativa</dt><dd>${escapeHtml(analysis.alternateProtein || "—")}</dd>
          <dt>Codón afectado</dt><dd>${escapeHtml(analysis.affectedReferenceCodon ?? "—")} → ${escapeHtml(analysis.affectedAlternateCodon ?? "—")}</dd>
        </dl>
        <p class="warning-note">${escapeHtml(analysis.warning)}</p>
      </div>`;
    }
    #scanG4() {
        const sequence = byId("researchSequence").value;
        const candidates = findGQuadruplexCandidates(sequence);
        byId("g4Result").innerHTML = candidates.length
            ? `<p><strong>${candidates.length}</strong> candidato(s) encontrados.</p>${candidates.slice(0, 20).map((hit) => `
          <article class="mini-result"><strong>${hit.strand}:${hit.start}-${hit.end}</strong><code>${escapeHtml(hit.sequence)}</code><small>Bucles: ${hit.loopLengths.join(" / ")}</small></article>`).join("")}
          <p class="warning-note">Predicción de motivo: no demuestra formación de G-cuádruplex in vivo.</p>`
            : '<p>No se encontraron candidatos con el patrón clásico G≥3–bucle 1–7 repetido cuatro veces.</p>';
    }
    #summarizeAllele() {
        const alternateReads = Number(byId("altReads").value);
        const totalReads = Number(byId("totalReads").value);
        const target = byId("alleleResult");
        try {
            const result = summarizeAlleleObservation(alternateReads, totalReads);
            target.innerHTML = `
        <div class="result-callout">
          <p class="eyebrow">OBSERVACIÓN DE LECTURAS</p>
          <h3>${(result.observedAlleleFraction * 100).toFixed(2)} %</h3>
          <p>Intervalo Wilson 95 %: ${(result.wilson95.lower * 100).toFixed(2)}–${(result.wilson95.upper * 100).toFixed(2)} %</p>
          <p class="warning-note">${escapeHtml(result.warning)}</p>
        </div>`;
        }
        catch (error) {
            target.innerHTML = `<p class="feedback bad">${escapeHtml(error instanceof Error ? error.message : "Conteos inválidos")}</p>`;
        }
    }
}
//# sourceMappingURL=research-controller.js.map