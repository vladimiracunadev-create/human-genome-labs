import { aminoAcidByCode, aminoCodeForCodon, complementDna } from "../../../../packages/genetics-core/src/index.js";
import type { BiologyDatabase, GameMode, GameQuestion } from "../../../../packages/biology-data/src/index.js";

const LABELS: Record<Exclude<GameMode, "mixed">, string> = {
  codon_to_amino: "CODÓN → AMINOÁCIDO",
  amino_to_codon: "AMINOÁCIDO → CODÓN",
  dna_to_rna: "TRANSCRIPCIÓN",
  complement: "APAREAMIENTO DE BASES",
};

function sample<T>(items: readonly T[], random: () => number): T {
  if (!items.length) throw new Error("No se puede seleccionar desde una lista vacía.");
  return items[Math.floor(random() * items.length)] ?? items[0]!;
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [copy[index], copy[target]] = [copy[target]!, copy[index]!];
  }
  return copy;
}

function makeQuestion(
  mode: Exclude<GameMode, "mixed">,
  text: string,
  visual: string,
  correct: string,
  pool: readonly string[],
  explanation: string,
  random: () => number,
): GameQuestion {
  const wrong = shuffle([...new Set(pool.filter((value) => value !== correct))], random).slice(0, 3);
  return {
    mode,
    label: LABELS[mode],
    text,
    visual,
    correct,
    options: shuffle([correct, ...wrong], random),
    explanation,
  };
}

export function resolveGameMode(mode: GameMode, random: () => number = Math.random): Exclude<GameMode, "mixed"> {
  if (mode !== "mixed") return mode;
  return sample(["codon_to_amino", "amino_to_codon", "dna_to_rna", "complement"] as const, random);
}

export function createQuestion(
  mode: GameMode,
  database: BiologyDatabase,
  random: () => number = Math.random,
): GameQuestion {
  const resolved = resolveGameMode(mode, random);
  const senseCodons = database.codons.filter((codon) => aminoCodeForCodon(codon, "standard") !== "*");

  if (resolved === "codon_to_amino") {
    const target = sample(database.codons, random);
    const code = aminoCodeForCodon(target, "standard");
    const amino = aminoAcidByCode(database, code);
    const correct = code === "*" ? "STOP" : `${amino?.name_es ?? code} (${code})`;
    const pool = database.amino_acids
      .filter((item) => item.canonical)
      .map((item) => `${item.name_es} (${item.one_letter})`)
      .concat("STOP");
    const explanation = code === "*"
      ? `${target.rna} es una señal de terminación del código genético estándar.`
      : `${target.rna} codifica ${amino?.name_es ?? code} (${code}).`;
    return makeQuestion(resolved, "¿Qué produce este codón de ARN?", target.rna, correct, pool, explanation, random);
  }

  if (resolved === "amino_to_codon") {
    const target = sample(senseCodons, random);
    const code = aminoCodeForCodon(target, "standard");
    const amino = aminoAcidByCode(database, code);
    const valid = database.codons
      .filter((codon) => aminoCodeForCodon(codon, "standard") === code)
      .map((codon) => codon.rna);
    const correct = sample(valid, random);
    const pool = database.codons.map((codon) => codon.rna).filter((codon) => !valid.includes(codon));
    return makeQuestion(
      resolved,
      `¿Cuál de estos codones puede producir ${amino?.name_es ?? code} (${code})?`,
      code,
      correct,
      pool,
      `${amino?.name_es ?? code} puede ser codificada por: ${valid.join(", ")}.`,
      random,
    );
  }

  if (resolved === "dna_to_rna") {
    const target = sample(database.codons, random);
    return makeQuestion(
      resolved,
      "Transcribe este codón de ADN a ARN mensajero.",
      target.dna,
      target.rna,
      database.codons.map((codon) => codon.rna),
      `Durante la transcripción, T se representa como U: ${target.dna} → ${target.rna}.`,
      random,
    );
  }

  const target = sample(database.codons, random).dna;
  const correct = complementDna(target);
  return makeQuestion(
    resolved,
    "¿Cuál es la secuencia complementaria de este ADN?",
    target,
    correct,
    database.codons.map((codon) => codon.dna),
    `A se aparea con T y C con G: ${target} ↔ ${correct}.`,
    random,
  );
}

export function calculateQuestionScore(correct: boolean, previousStreak: number, base: number, bonus: number): number {
  if (!correct) return 0;
  return base + Math.max(0, previousStreak) * bonus;
}
