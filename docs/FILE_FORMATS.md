# Formatos interoperables

El paquete `@human-genome-labs/file-formats` ofrece lectores mínimos para:

- FASTA: secuencias y descripciones;
- GFF3: nueve columnas, atributos y conversión de coordenadas;
- VCF: cabecera, INFO, FORMAT y muestras.

## Alcance deliberado

Los lectores buscan transparencia y pruebas, no reemplazar herramientas maduras de bioinformática. No implementan todas las extensiones, índices, compresión BGZF, tabix, BCF ni normalización compleja de variantes.

## CLI

```bash
pnpm cli -- gff-summary examples/annotations/example.gff3 --json
pnpm cli -- vcf-summary examples/variants/example.vcf --json
```
