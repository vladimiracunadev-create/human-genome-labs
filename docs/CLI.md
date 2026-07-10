# CLI

Ejecute desde la raíz con `pnpm cli --`.

## Descubrimiento evolutivo

```bash
pnpm cli -- capabilities [--maturity validated] [--json]
pnpm cli -- modules [--maturity experimental] [--json]
pnpm cli -- profiles [--id homo-sapiens-nuclear] [--json]
```

## Secuencias

```bash
pnpm cli -- summary archivo.fasta [--json]
pnpm cli -- translate archivo.fasta [--frame 1|2|3] [--strand +|-] [--code standard|human_mitochondrial] [--six-frames] [--stop-at-stop]
pnpm cli -- orfs archivo.fasta [--min-aa 20] [--include-incomplete]
pnpm cli -- codon-usage archivo.fasta [--frame 1|2|3]
pnpm cli -- validate archivo.fasta
```

## Formatos

```bash
pnpm cli -- gff-summary archivo.gff3 [--json]
pnpm cli -- vcf-summary archivo.vcf [--json]
```

## Sistemas

```bash
pnpm cli -- variant archivo.fasta --position 3 --ref G --alt A
pnpm cli -- structures archivo.fasta [--max-loop 7]
pnpm cli -- allele-fraction --alt-reads 12 --total-reads 100
pnpm cli -- frontiers [--domain human_pangenome]
```

Las coordenadas internas son base cero con extremo final exclusivo; la CLI conserva las coordenadas originales al resumir GFF3 y VCF.
