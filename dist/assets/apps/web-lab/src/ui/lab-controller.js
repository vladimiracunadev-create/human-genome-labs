import { aminoAcidByCode, aminoCodeForCodon, codonByDna } from "../../../../packages/genetics-core/src/index.js";
import { all, byId, escapeHtml } from "./dom.js";
export class LabController {
    #database;
    #dna = [];
    #protein = [];
    constructor(database) {
        this.#database = database;
        this.#renderSlots();
        this.#renderBaseButtons();
        this.#bindEvents();
        this.#update();
    }
    #bindEvents() {
        byId("clearCodon").addEventListener("click", () => this.#clearCodon());
        byId("undoBase").addEventListener("click", () => {
            this.#dna.pop();
            this.#update();
        });
        byId("randomCodon").addEventListener("click", () => {
            const random = this.#database.codons[Math.floor(Math.random() * this.#database.codons.length)];
            this.#dna = (random?.dna.split("") ?? []);
            this.#update();
        });
        byId("addAmino").addEventListener("click", () => this.#addToProtein());
        byId("clearProtein").addEventListener("click", () => {
            this.#protein = [];
            this.#renderProtein();
        });
        document.addEventListener("keydown", (event) => {
            if (!byId("lab").classList.contains("active"))
                return;
            const base = event.key.toUpperCase();
            if (["A", "C", "G", "T"].includes(base))
                this.#addBase(base);
            if (event.key === "Backspace") {
                event.preventDefault();
                this.#dna.pop();
                this.#update();
            }
        });
    }
    #renderSlots() {
        byId("dnaSlots").innerHTML = [0, 1, 2]
            .map((index) => `<div class="slot" data-slot="${index}">·</div>`)
            .join("");
    }
    #renderBaseButtons() {
        byId("baseButtons").innerHTML = ["A", "C", "G", "T"]
            .map((base) => `<button class="base" data-base="${base}" aria-label="Agregar base ${base}">${base}</button>`)
            .join("");
        all(".base").forEach((button) => {
            button.addEventListener("click", () => this.#addBase(button.dataset.base));
        });
    }
    #addBase(base) {
        if (this.#dna.length >= 3)
            return;
        this.#dna.push(base);
        this.#update();
    }
    #clearCodon() {
        this.#dna = [];
        this.#update();
    }
    #currentCodon() {
        return this.#dna.length === 3 ? codonByDna(this.#database, this.#dna.join("")) : undefined;
    }
    #update() {
        all(".slot").forEach((slot, index) => {
            slot.textContent = this.#dna[index] ?? "·";
            slot.classList.toggle("filled", Boolean(this.#dna[index]));
        });
        byId("dnaResult").textContent = this.#dna.length ? this.#dna.join("") : "— — —";
        const codon = this.#currentCodon();
        const addButton = byId("addAmino");
        const card = byId("aminoCard");
        if (!codon) {
            byId("rnaResult").textContent = "— — —";
            byId("aaResult").textContent = "Esperando";
            card.className = "amino-card empty";
            card.textContent = "Completa las tres posiciones para traducir el codón.";
            addButton.disabled = true;
            return;
        }
        byId("rnaResult").textContent = codon.rna;
        const code = aminoCodeForCodon(codon, "standard");
        if (code === "*") {
            byId("aaResult").textContent = "STOP";
            card.className = "amino-card";
            card.innerHTML = `<h4>Señal de terminación</h4><p>${codon.dna} → ${codon.rna}</p><p>Indica al ribosoma que debe terminar la traducción.</p>`;
        }
        else {
            const amino = aminoAcidByCode(this.#database, code);
            byId("aaResult").textContent = `${code} · ${amino?.name_es ?? "Desconocido"}`;
            card.className = "amino-card";
            card.innerHTML = `<h4>${escapeHtml(amino?.name_es ?? code)} <small>(${escapeHtml(amino?.three_letter ?? code)}, ${code})</small></h4>
        <p><strong>${escapeHtml(amino?.category ?? "")}</strong> · ${escapeHtml(amino?.charge ?? "")} · ${escapeHtml(amino?.side_chain ?? "")}</p>
        <p>${escapeHtml(amino?.description ?? "")}</p>
        ${codon.is_start ? "<p><strong>También es el codón de inicio estándar.</strong></p>" : ""}`;
        }
        addButton.disabled = false;
    }
    #addToProtein() {
        const codon = this.#currentCodon();
        if (!codon)
            return;
        this.#protein.push({ code: aminoCodeForCodon(codon, "standard"), codon: codon.dna });
        this.#renderProtein();
        this.#clearCodon();
    }
    #renderProtein() {
        const container = byId("proteinChain");
        if (!this.#protein.length) {
            container.className = "protein-chain empty";
            container.textContent = "Aún no agregas aminoácidos.";
            byId("proteinSequence").textContent = "Secuencia: —";
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
        byId("proteinSequence").textContent = `Secuencia: ${sequence} · Codones: ${codons}`;
    }
}
//# sourceMappingURL=lab-controller.js.map