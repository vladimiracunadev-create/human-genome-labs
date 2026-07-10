import { aminoAcidByCode, aminoCodeForCodon, codonByDna } from "../../../../packages/genetics-core/src/index.js";
import type { BiologyDatabase, DnaBase } from "../../../../packages/biology-data/src/index.js";
import { all, byId, escapeHtml } from "./dom.js";

interface ProteinToken {
  code: string;
  codon: string;
}

export class LabController {
  readonly #database: BiologyDatabase;
  #dna: DnaBase[] = [];
  #protein: ProteinToken[] = [];

  constructor(database: BiologyDatabase) {
    this.#database = database;
    this.#renderSlots();
    this.#renderBaseButtons();
    this.#bindEvents();
    this.#update();
  }

  #bindEvents(): void {
    byId<HTMLButtonElement>("clearCodon").addEventListener("click", () => this.#clearCodon());
    byId<HTMLButtonElement>("undoBase").addEventListener("click", () => {
      this.#dna.pop();
      this.#update();
    });
    byId<HTMLButtonElement>("randomCodon").addEventListener("click", () => {
      const random = this.#database.codons[Math.floor(Math.random() * this.#database.codons.length)];
      this.#dna = (random?.dna.split("") ?? []) as DnaBase[];
      this.#update();
    });
    byId<HTMLButtonElement>("addAmino").addEventListener("click", () => this.#addToProtein());
    byId<HTMLButtonElement>("clearProtein").addEventListener("click", () => {
      this.#protein = [];
      this.#renderProtein();
    });
    document.addEventListener("keydown", (event) => {
      if (!byId<HTMLElement>("lab").classList.contains("active")) return;
      const base = event.key.toUpperCase();
      if (["A", "C", "G", "T"].includes(base)) this.#addBase(base as DnaBase);
      if (event.key === "Backspace") {
        event.preventDefault();
        this.#dna.pop();
        this.#update();
      }
    });
  }

  #renderSlots(): void {
    byId<HTMLDivElement>("dnaSlots").innerHTML = [0, 1, 2]
      .map((index) => `<div class="slot" data-slot="${index}">·</div>`)
      .join("");
  }

  #renderBaseButtons(): void {
    byId<HTMLDivElement>("baseButtons").innerHTML = (["A", "C", "G", "T"] as DnaBase[])
      .map((base) => `<button class="base" data-base="${base}" aria-label="Agregar base ${base}">${base}</button>`)
      .join("");
    all<HTMLButtonElement>(".base").forEach((button) => {
      button.addEventListener("click", () => this.#addBase(button.dataset.base as DnaBase));
    });
  }

  #addBase(base: DnaBase): void {
    if (this.#dna.length >= 3) return;
    this.#dna.push(base);
    this.#update();
  }

  #clearCodon(): void {
    this.#dna = [];
    this.#update();
  }

  #currentCodon() {
    return this.#dna.length === 3 ? codonByDna(this.#database, this.#dna.join("")) : undefined;
  }

  #update(): void {
    all<HTMLDivElement>(".slot").forEach((slot, index) => {
      slot.textContent = this.#dna[index] ?? "·";
      slot.classList.toggle("filled", Boolean(this.#dna[index]));
    });

    byId<HTMLElement>("dnaResult").textContent = this.#dna.length ? this.#dna.join("") : "— — —";
    const codon = this.#currentCodon();
    const addButton = byId<HTMLButtonElement>("addAmino");
    const card = byId<HTMLDivElement>("aminoCard");

    if (!codon) {
      byId<HTMLElement>("rnaResult").textContent = "— — —";
      byId<HTMLElement>("aaResult").textContent = "Esperando";
      card.className = "amino-card empty";
      card.textContent = "Completa las tres posiciones para traducir el codón.";
      addButton.disabled = true;
      return;
    }

    byId<HTMLElement>("rnaResult").textContent = codon.rna;
    const code = aminoCodeForCodon(codon, "standard");
    if (code === "*") {
      byId<HTMLElement>("aaResult").textContent = "STOP";
      card.className = "amino-card";
      card.innerHTML = `<h4>Señal de terminación</h4><p>${codon.dna} → ${codon.rna}</p><p>Indica al ribosoma que debe terminar la traducción.</p>`;
    } else {
      const amino = aminoAcidByCode(this.#database, code);
      byId<HTMLElement>("aaResult").textContent = `${code} · ${amino?.name_es ?? "Desconocido"}`;
      card.className = "amino-card";
      card.innerHTML = `<h4>${escapeHtml(amino?.name_es ?? code)} <small>(${escapeHtml(amino?.three_letter ?? code)}, ${code})</small></h4>
        <p><strong>${escapeHtml(amino?.category ?? "")}</strong> · ${escapeHtml(amino?.charge ?? "")} · ${escapeHtml(amino?.side_chain ?? "")}</p>
        <p>${escapeHtml(amino?.description ?? "")}</p>
        ${codon.is_start ? "<p><strong>También es el codón de inicio estándar.</strong></p>" : ""}`;
    }
    addButton.disabled = false;
  }

  #addToProtein(): void {
    const codon = this.#currentCodon();
    if (!codon) return;
    this.#protein.push({ code: aminoCodeForCodon(codon, "standard"), codon: codon.dna });
    this.#renderProtein();
    this.#clearCodon();
  }

  #renderProtein(): void {
    const container = byId<HTMLDivElement>("proteinChain");
    if (!this.#protein.length) {
      container.className = "protein-chain empty";
      container.textContent = "Aún no agregas aminoácidos.";
      byId<HTMLParagraphElement>("proteinSequence").textContent = "Secuencia: —";
      return;
    }

    container.className = "protein-chain";
    container.innerHTML = this.#protein.map((item) => {
      const amino = item.code === "*" ? undefined : aminoAcidByCode(this.#database, item.code);
      const title = item.code === "*" ? "STOP" : amino?.name_es ?? item.code;
      return `<span class="amino-token ${item.code === "*" ? "stop" : ""}" title="${escapeHtml(title)} · ${item.codon}">${item.code}</span>`;
    }).join("");
    const sequence = this.#protein.map((item) => item.code).join("");
    const codons = this.#protein.map((item) => item.codon).join("-");
    byId<HTMLParagraphElement>("proteinSequence").textContent = `Secuencia: ${sequence} · Codones: ${codons}`;
  }
}
