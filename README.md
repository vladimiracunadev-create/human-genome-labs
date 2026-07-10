# Human Genome Labs

[![CI](https://github.com/vladimiracunadev-create/human-genome-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/human-genome-labs/actions/workflows/ci.yml)

Plataforma científica **evolutiva**, reproducible y educativa para genética molecular y genómica. No pretende cerrar el campo ni presentarse como producto definitivo: mantiene un núcleo verificable y permite incorporar investigación mediante módulos con madurez, evidencia, versiones y limitaciones explícitas.

> No realiza diagnóstico ni interpretación clínica. Las predicciones computacionales no equivalen a evidencia funcional.

## Qué integra

- núcleo TypeScript para secuencias, traducción, ORF, variantes, G4 y estadísticas;
- base científica JSON dividida por dominios y compilada como bundle;
- contratos comunes `ScientificResult<T>` y coordenadas genómicas;
- lectores iniciales FASTA, GFF3 y VCF;
- perfiles de organismo y compartimento;
- registro de módulos y capacidades;
- CLI científica, laboratorio web y juego secundario;
- RFCs, roadmap, plantillas y criterios de promoción de madurez;
- distribución web precompilada dentro del mismo repositorio.

## Requisitos

- Node.js 20 o superior;
- pnpm 11. No se admite npm ni yarn para desarrollar el repositorio.

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

## Abrir sin instalar dependencias

Windows:

```text
start_prebuilt_windows.bat
```

Linux/macOS:

```bash
./start_prebuilt.sh
```

## CLI

```bash
pnpm cli -- capabilities --json
pnpm cli -- modules --maturity experimental --json
pnpm cli -- profiles --json
pnpm cli -- summary examples/sequences/example.fasta --json
pnpm cli -- gff-summary examples/annotations/example.gff3 --json
pnpm cli -- vcf-summary examples/variants/example.vcf --json
```

## Crear la próxima capacidad

```bash
pnpm new:module -- methylation-analysis experimental "Análisis de metilación"
```

Luego complete el manifiesto, registre capacidades, agregue pruebas, referencias y limitaciones. Consulte [Sistema de módulos](docs/MODULE_SYSTEM.md) y [Definición de terminado](docs/DEFINITION_OF_DONE.md).

## Estructura

```text
apps/                       interfaces CLI y web
packages/                   contratos, datos, formatos y núcleos
modules/                    concept, experimental y validated
registry/                   módulos y capacidades
packages/biology-data/data/domains/  fuentes del bundle JSON
datasets/                   datos externos y manifiestos
examples/                   FASTA, GFF3 y VCF pequeños
docs/rfcs/                  decisiones futuras
services/                   reservado para APIs futuras
templates/                  creación de módulos
```

## Evolución

La versión 5.0 establece la plataforma; no declara finalizada la genómica. El [roadmap](docs/ROADMAP.md) prioriza anotaciones, transcritos, variantes interoperables, regulación, pangenomas y genómica de sistemas conforme exista validación suficiente.

## Licencias

Código MIT. Los hechos estructurados propios se distribuyen bajo CC0-1.0; cada fuente y dataset externo conserva sus propios términos.
