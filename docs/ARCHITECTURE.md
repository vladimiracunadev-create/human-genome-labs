# Arquitectura

```text
Datos de dominio → contratos y formatos → núcleos científicos → módulos → interfaces
```

## Capas

- `packages/biology-data`: hechos estructurados y bundle generado.
- `packages/scientific-contracts`: resultados, evidencia, coordenadas y capacidades.
- `packages/file-formats`: límites de interoperabilidad FASTA/GFF3/VCF.
- `packages/organism-profiles`: contexto biológico configurable.
- `packages/genetics-core`: algoritmos moleculares puros.
- `modules/`: manifiestos de madurez y alcance.
- `apps/`: CLI y laboratorio web; no deben duplicar ciencia.
- `registry/`: catálogo consultable de capacidades.

## Dependencias permitidas

```text
apps → modules/packages
modules → packages
packages científicos → contracts/data
contracts → sin dependencias de dominio
```

La UI nunca es la fuente de verdad científica. Los datos grandes permanecen fuera de Git y se descargan mediante manifiestos.
