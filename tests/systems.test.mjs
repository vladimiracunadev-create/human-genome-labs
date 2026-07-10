import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  analyzeCodingVariant,
  applySequenceVariant,
  findGQuadruplexCandidates,
  intervalsOverlap,
  summarizeAlleleObservation,
} from "../.build/packages/genetics-core/src/index.js";

const db = JSON.parse(await readFile(new URL("../packages/biology-data/data/biology.json", import.meta.url), "utf8"));

test("aplicación y análisis molecular de variantes", () => {
  const applied = applySequenceVariant("ATGGCTTAA", { position: 3, reference: "G", alternate: "A" });
  assert.equal(applied.valid, true);
  assert.equal(applied.sequence, "ATGACTTAA");

  const missense = analyzeCodingVariant("ATGGCTTAA", { position: 3, reference: "G", alternate: "A" }, db);
  assert.equal(missense.effect, "missense");
  assert.equal(missense.referenceProtein, "MA*");
  assert.equal(missense.alternateProtein, "MT*");

  const synonymous = analyzeCodingVariant("ATGGCTTAA", { position: 5, reference: "T", alternate: "C" }, db);
  assert.equal(synonymous.effect, "synonymous");

  const frameshift = analyzeCodingVariant("ATGGCTTAA", { position: 4, reference: "-", alternate: "A" }, db);
  assert.equal(frameshift.effect, "frameshift");
});

test("detección de candidatos G-cuádruplex declarada como predicción", () => {
  const hits = findGQuadruplexCandidates("TTAGGGAGGGAGGGAGGGTT");
  assert.ok(hits.length >= 1);
  assert.equal(hits[0].evidenceLevel, "computational_prediction");
  assert.equal(hits[0].sequence, "GGGAGGGAGGGAGGG");
});

test("fracción alélica e intervalo Wilson", () => {
  const result = summarizeAlleleObservation(12, 100);
  assert.equal(result.observedAlleleFraction, 0.12);
  assert.ok(result.wilson95.lower < 0.12);
  assert.ok(result.wilson95.upper > 0.12);
  assert.equal(result.referenceReads, 88);
});

test("solapamiento de intervalos genómicos semiabiertos", () => {
  assert.equal(intervalsOverlap(10, 20, 19, 30), true);
  assert.equal(intervalsOverlap(10, 20, 20, 30), false);
});
