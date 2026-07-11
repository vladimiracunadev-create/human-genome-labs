# 🚀 Guía de arranque

De cero a tu primer resultado científico en pocos minutos. Para la referencia completa de comandos, ver [docs/CLI.md](docs/CLI.md).

## Opción A — Solo mirar (sin instalar nada)

La forma más rápida de explorar es el **laboratorio web en vivo**:

👉 **<https://vladimiracunadev-create.github.io/human-genome-labs/>**

O ejecuta la distribución precompilada localmente:

- **Windows:** doble clic en `start_prebuilt_windows.bat`
- **Linux/macOS:** `./start_prebuilt.sh`

## Opción B — Entorno de desarrollo completo

### Requisitos

- **Node.js 20** o superior
- **pnpm 11** (no se admite npm ni yarn)

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
```

### Instalar y verificar

```bash
pnpm install --frozen-lockfile
pnpm check   # bundle + typecheck + validaciones + tests + build
```

Si `pnpm check` termina en verde, tu entorno está listo.

## Tu primer análisis (CLI)

El repositorio incluye ejemplos pequeños en `examples/`. Prueba:

```bash
# Resumen de una secuencia FASTA (composición, GC, ORFs…)
pnpm cli -- summary examples/sequences/example.fasta --json

# Traducción por marco y código genético
pnpm cli -- translate examples/sequences/example.fasta --frame 1 --json

# Marcos abiertos de lectura (ORF)
pnpm cli -- orfs examples/sequences/example.fasta --min-aa 20 --json

# Leer una anotación GFF3 y un VCF
pnpm cli -- gff-summary examples/annotations/example.gff3 --json
pnpm cli -- vcf-summary examples/variants/example.vcf --json
```

Descubre qué puede hacer la plataforma sin abrir el código:

```bash
pnpm cli -- capabilities --json
pnpm cli -- modules --maturity validated --json
pnpm cli -- profiles --json
```

## Cómo leer los resultados

Cada análisis devuelve un contrato [`ScientificResult<T>`](docs/SCIENTIFIC_RESULT_CONTRACT.md) que **siempre** declara:

- `evidenceLevel` — `observed`, `experimentally_supported`, `computational_prediction` o `hypothesis`
- `maturity` del módulo — `concept`, `experimental` o `validated`
- `limitations` y `warnings` explícitos

> Una predicción computacional (por ejemplo, un ORF o un candidato G-cuádruplex) **no** demuestra función biológica. Consulta el [Modelo de evidencia](docs/EVIDENCE_MODEL.md).

## Siguientes pasos

- ¿Términos nuevos? → [Glosario](docs/GLOSSARY.md)
- ¿Dudas comunes? → [FAQ](docs/FAQ.md)
- ¿Quieres crear una capacidad? → [Sistema de módulos](docs/MODULE_SYSTEM.md)
- Panorama completo → [Índice de documentación](docs/INDEX.md)
