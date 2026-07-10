# Ejemplos

Todos los archivos son sintéticos y no pertenecen a personas reales.

- `sequences/example.fasta`: traducción, ORF y variante sobre CDS.
- `sequences/ambiguous_iupac.fasta`: símbolos ambiguos IUPAC.
- `sequences/g4_candidate.fasta`: candidato G-cuádruplex y control negativo.

```bash
pnpm cli -- summary examples/sequences/example.fasta
pnpm cli -- variant examples/sequences/example.fasta --position 3 --ref G --alt A
pnpm cli -- structures examples/sequences/g4_candidate.fasta
```
