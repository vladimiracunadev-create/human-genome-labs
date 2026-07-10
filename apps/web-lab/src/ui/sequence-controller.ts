import {
  complementDna,
  findOpenReadingFrames,
  gcContent,
  invalidDnaSymbols,
  normalizeDna,
  pointMutation,
  randomDna,
  reverseComplementDna,
  summarizeSequence,
  transcribeDna,
  translateDna,
  translateSixFrames,
} from "../../../../packages/genetics-core/src/index.js";
import type { BiologyDatabase, GeneticCodeId } from "../../../../packages/biology-data/src/index.js";
import { byId, escapeHtml } from "./dom.js";

export class SequenceController {
  readonly #database: BiologyDatabase;

  constructor(database: BiologyDatabase) {
    this.#database = database;
    this.#bindEvents();
    byId<HTMLTextAreaElement>("sequenceInput").value = "ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG";
    this.analyze();
  }

  #bindEvents(): void {
    byId<HTMLButtonElement>("analyzeSequence").addEventListener("click", () => this.analyze());
    byId<HTMLButtonElement>("randomSequence").addEventListener("click", () => {
      byId<HTMLTextAreaElement>("sequenceInput").value = `ATG${randomDna(42)}TAA`;
      this.analyze();
    });
    byId<HTMLButtonElement>("mutateSequence").addEventListener("click", () => this.#mutate());
    byId<HTMLButtonElement>("copyProtein").addEventListener("click", () => this.#copyProtein());
    byId<HTMLSelectElement>("frameSelect").addEventListener("change", () => this.analyze());
    byId<HTMLSelectElement>("geneticCodeSelect").addEventListener("change", () => this.analyze());
    byId<HTMLInputElement>("stopAtStop").addEventListener("change", () => this.analyze());
  }

  analyze(): void {
    const raw = byId<HTMLTextAreaElement>("sequenceInput").value;
    const invalid = invalidDnaSymbols(raw);
    const dna = normalizeDna(raw);
    const status = byId<HTMLParagraphElement>("sequenceStatus");

    if (!dna.length) {
      status.className = "feedback bad";
      status.textContent = "Ingresa una secuencia de ADN con símbolos IUPAC válidos.";
      this.#clearResults();
      return;
    }

    if (invalid.length) {
      status.className = "feedback bad";
      status.textContent = `Se ignoraron símbolos no válidos: ${invalid.join(", ")}.`;
    } else if (/[^ACGT]/.test(dna)) {
      status.className = "feedback";
      status.textContent = "La secuencia contiene símbolos IUPAC ambiguos. El GC esperado se calcula de forma fraccional y los codones ambiguos se traducen como X.";
    } else {
      status.className = "feedback good";
      status.textContent = "Secuencia válida. El análisis se actualizó correctamente.";
    }

    const frame = Number(byId<HTMLSelectElement>("frameSelect").value) as 1 | 2 | 3;
    const geneticCode = byId<HTMLSelectElement>("geneticCodeSelect").value as GeneticCodeId;
    const stopAtStop = byId<HTMLInputElement>("stopAtStop").checked;
    const result = translateDna(dna, this.#database, { frame, geneticCode, stopAtStop });
    const summary = summarizeSequence(dna);
    const sixFrames = translateSixFrames(dna, this.#database, geneticCode);
    const orfs = findOpenReadingFrames(dna, this.#database, { geneticCode, minAminoAcids: 1 });

    byId<HTMLElement>("sequenceLength").textContent = summary.length.toLocaleString("es-CL");
    byId<HTMLElement>("gcValue").textContent = `${summary.gcCanonicalPercent.toFixed(2)} %`;
    byId<HTMLElement>("gcExpectedValue").textContent = `${summary.gcExpectedPercent.toFixed(2)} %`;
    byId<HTMLElement>("ambiguousCount").textContent = summary.ambiguousLength.toLocaleString("es-CL");
    byId<HTMLElement>("orfCount").textContent = orfs.length.toLocaleString("es-CL");
    byId<HTMLElement>("largestOrf").textContent = orfs[0] ? `${orfs[0].aminoAcidLength} aa` : "0 aa";
    byId<HTMLElement>("codonCount").textContent = result.codons.length.toLocaleString("es-CL");
    byId<HTMLElement>("proteinLength").textContent = result.protein.replace(/\*/g, "").length.toLocaleString("es-CL");
    byId<HTMLElement>("normalizedDna").textContent = dna;
    byId<HTMLElement>("complementResult").textContent = complementDna(dna);
    byId<HTMLElement>("reverseComplementResult").textContent = reverseComplementDna(dna);
    byId<HTMLElement>("rnaSequence").textContent = transcribeDna(dna);
    byId<HTMLElement>("proteinResult").textContent = result.protein || "—";
    byId<HTMLElement>("remainderResult").textContent = result.remainder || "Sin bases sobrantes";

    const codonGrid = byId<HTMLDivElement>("codonTranslationGrid");
    codonGrid.innerHTML = result.codons.length
      ? result.codons.map((codon) => {
          const classes = ["translation-token", codon.isStart ? "start" : "", codon.isStop ? "stop" : ""].filter(Boolean).join(" ");
          return `<span class="${classes}" title="Posición ${codon.index + 1}">
            <small>${escapeHtml(codon.dna)}</small><strong>${escapeHtml(codon.aminoAcid)}</strong>
          </span>`;
        }).join("")
      : "<p>No hay un codón completo en el marco seleccionado.</p>";

    byId<HTMLDivElement>("sixFramesGrid").innerHTML = sixFrames.map((translation) => `
      <article class="knowledge-card">
        <p class="eyebrow">Hebra ${translation.strand} · Marco ${translation.frame}</p>
        <h3>${escapeHtml(translation.protein || "—")}</h3>
        <p>${translation.codons.length} codones completos</p>
      </article>`).join("");

    byId<HTMLDivElement>("orfGrid").innerHTML = orfs.length
      ? orfs.slice(0, 12).map((orf) => `
        <article class="knowledge-card">
          <p class="eyebrow">Hebra ${orf.strand} · Marco ${orf.frame}</p>
          <h3>${orf.aminoAcidLength} aa</h3>
          <p>Coordenadas ${orf.start}–${orf.end}; ${escapeHtml(orf.startCodon)} → ${escapeHtml(orf.stopCodon ?? "sin STOP")}</p>
          <code>${escapeHtml(orf.protein)}</code>
        </article>`).join("")
      : "<p>No se detectaron ORF completas con las reglas seleccionadas.</p>";
  }

  #mutate(): void {
    const input = byId<HTMLTextAreaElement>("sequenceInput");
    const mutation = pointMutation(input.value);
    if (mutation.index < 0) return;
    input.value = mutation.sequence;
    const message = byId<HTMLParagraphElement>("mutationMessage");
    message.textContent = `Mutación puntual simulada en la posición ${mutation.index + 1}: ${mutation.from} → ${mutation.to}.`;
    this.analyze();
  }

  async #copyProtein(): Promise<void> {
    const protein = byId<HTMLElement>("proteinResult").textContent ?? "";
    const button = byId<HTMLButtonElement>("copyProtein");
    try {
      await navigator.clipboard.writeText(protein);
      button.textContent = "Copiado";
    } catch {
      button.textContent = "No se pudo copiar";
    }
    window.setTimeout(() => { button.textContent = "Copiar proteína"; }, 1400);
  }

  #clearResults(): void {
    ["sequenceLength", "gcValue", "gcExpectedValue", "ambiguousCount", "codonCount", "proteinLength", "orfCount", "largestOrf"].forEach((id) => {
      byId<HTMLElement>(id).textContent = "0";
    });
    ["normalizedDna", "complementResult", "reverseComplementResult", "rnaSequence", "proteinResult", "remainderResult"].forEach((id) => {
      byId<HTMLElement>(id).textContent = "—";
    });
    byId<HTMLDivElement>("codonTranslationGrid").innerHTML = "";
    byId<HTMLDivElement>("sixFramesGrid").innerHTML = "";
    byId<HTMLDivElement>("orfGrid").innerHTML = "";
  }
}
