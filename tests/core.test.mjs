import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { classifyCodonMutation, complementDna, findOpenReadingFrames, gcContent, parseFasta, reverseComplementDna, summarizeSequence, transcribeDna, transcribeTemplateDna, translateDna, translateSixFrames } from "../.build/packages/genetics-core/src/index.js";
const db = JSON.parse(await readFile(new URL("../packages/biology-data/data/biology.json", import.meta.url), "utf8"));

test("complemento IUPAC y transcripción",()=>{
  assert.equal(complementDna("ACGTRYN"), "TGCAYRN");
  assert.equal(reverseComplementDna("ATGC"), "GCAT");
  assert.equal(transcribeDna("ATGT"), "AUGU");
  assert.equal(transcribeTemplateDna("TAC"), "GUA");
});

test("estadísticas de secuencia",()=>{
  assert.equal(gcContent("GGCCAT", "canonical"), 4/6*100);
  const summary = summarizeSequence("ACGTNN");
  assert.equal(summary.length, 6);
  assert.equal(summary.ambiguousLength, 2);
  assert.equal(summary.gcExpectedPercent, 50);
});

test("traducción estándar y mitocondrial",()=>{
  assert.equal(translateDna("ATGTGA", db).protein, "M*");
  assert.equal(translateDna("ATGTGA", db, { geneticCode: "human_mitochondrial" }).protein, "MW");
  assert.equal(translateSixFrames("ATGGCC", db).length, 6);
});

test("clasificación de mutaciones de codón",()=>{
  assert.equal(classifyCodonMutation("GCT", "GCC", db), "synonymous");
  assert.equal(classifyCodonMutation("TGG", "TGA", db), "nonsense");
  assert.equal(classifyCodonMutation("TAA", "CAA", db), "stop-loss");
});

test("detección de ORF",()=>{
  const orfs = findOpenReadingFrames("CCCATGGCTGCTTAACCC", db, { minAminoAcids: 2 });
  assert.ok(orfs.some((orf)=>orf.complete && orf.protein === "MAA"));
});

test("lector FASTA",()=>{
  const records = parseFasta(">seq1 ejemplo\nATG GCC TAA\n>seq2\nACGT");
  assert.equal(records.length, 2);
  assert.equal(records[0].sequence, "ATGGCCTAA");
});
