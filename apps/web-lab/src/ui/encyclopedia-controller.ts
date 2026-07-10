import { aminoAcidByCode, aminoCodeForCodon } from "../../../../packages/genetics-core/src/index.js";
import type { BiologyDatabase } from "../../../../packages/biology-data/src/index.js";
import { byId, escapeHtml } from "./dom.js";

export class EncyclopediaController {
  readonly #database: BiologyDatabase;

  constructor(database: BiologyDatabase) {
    this.#database = database;
    byId<HTMLInputElement>("searchInput").addEventListener("input", () => this.render());
    byId<HTMLSelectElement>("encyclopediaType").addEventListener("change", () => this.render());
    this.render();
  }

  render(): void {
    const type = byId<HTMLSelectElement>("encyclopediaType").value;
    const query = byId<HTMLInputElement>("searchInput").value.trim().toLocaleLowerCase("es");
    let cards: string[] = [];

    if (type === "amino") {
      cards = this.#database.amino_acids
        .filter((amino) => JSON.stringify(amino).toLocaleLowerCase("es").includes(query))
        .map((amino) => `<article class="info-card">
          <p class="eyebrow">${escapeHtml(amino.one_letter)} · ${escapeHtml(amino.three_letter)}</p>
          <h3>${escapeHtml(amino.name_es)}</h3>
          <p>${escapeHtml(amino.description)}</p>
          <div class="badges"><span class="badge">${escapeHtml(amino.category)}</span><span class="badge">${escapeHtml(amino.charge)}</span><span class="badge">${escapeHtml(amino.side_chain)}</span></div>
          <p><strong>Codones ARN:</strong> ${amino.codons_rna.map(escapeHtml).join(", ") || "Contexto especial"}</p>
        </article>`);
    } else if (type === "codon") {
      cards = this.#database.codons
        .filter((codon) => {
          const code = aminoCodeForCodon(codon, "standard");
          const aminoName = aminoAcidByCode(this.#database, code)?.name_es ?? "";
          return JSON.stringify(codon).toLocaleLowerCase("es").includes(query) || aminoName.toLocaleLowerCase("es").includes(query);
        })
        .map((codon) => {
          const standardCode = aminoCodeForCodon(codon, "standard");
          const mitochondrialCode = aminoCodeForCodon(codon, "human_mitochondrial");
          const name = standardCode === "*" ? "Terminación" : aminoAcidByCode(this.#database, standardCode)?.name_es ?? standardCode;
          const difference = standardCode !== mitochondrialCode
            ? `<p><strong>Mitocondria humana:</strong> ${escapeHtml(mitochondrialCode === "*" ? "STOP" : mitochondrialCode)}</p>`
            : "";
          return `<article class="info-card">
            <p class="eyebrow">ADN ${escapeHtml(codon.dna)}</p>
            <h3>${escapeHtml(codon.rna)} → ${escapeHtml(standardCode === "*" ? "STOP" : standardCode)}</h3>
            <p>${escapeHtml(name)}</p>${difference}
            <div class="badges">${codon.is_start ? '<span class="badge">Inicio</span>' : ""}${standardCode === "*" ? '<span class="badge">Parada</span>' : '<span class="badge">Sentido</span>'}</div>
          </article>`;
        });
    } else {
      cards = this.#database.concepts
        .filter((concept) => JSON.stringify(concept).toLocaleLowerCase("es").includes(query))
        .map((concept) => `<article class="info-card"><p class="eyebrow">CONCEPTO</p><h3>${escapeHtml(concept.term)}</h3><p>${escapeHtml(concept.definition_es)}</p></article>`);
    }

    byId<HTMLDivElement>("encyclopediaGrid").innerHTML = cards.join("") || '<article class="info-card"><h3>Sin resultados</h3><p>Prueba otra búsqueda.</p></article>';
  }
}
