<div align="center">

# 🧬 Human Genome Labs

**Plataforma científica evolutiva, reproducible y educativa para genética molecular y genómica.**

[![CI](https://github.com/vladimiracunadev-create/human-genome-labs/actions/workflows/ci.yml/badge.svg)](https://github.com/vladimiracunadev-create/human-genome-labs/actions/workflows/ci.yml)
[![Demo en vivo](https://img.shields.io/badge/demo-en_vivo-4de3b5?logo=github&logoColor=white)](https://vladimiracunadev-create.github.io/human-genome-labs/)
[![Release](https://img.shields.io/badge/release-v1.0.0-6bb5ff)](https://github.com/vladimiracunadev-create/human-genome-labs/releases/tag/v1.0.0)
[![License: MIT](https://img.shields.io/badge/license-MIT-3fb950)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=node.js&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-11-f69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](tsconfig.json)

[**🔬 Demo en vivo**](https://vladimiracunadev-create.github.io/human-genome-labs/) · [Documentación](docs/README.md) · [Roadmap](docs/ROADMAP.md) · [Changelog](CHANGELOG.md)

</div>

---

Human Genome Labs mantiene un **núcleo verificable** y permite incorporar investigación mediante módulos con madurez, evidencia, versiones y limitaciones explícitas. No pretende cerrar el campo ni presentarse como producto definitivo.

> ⚠️ No realiza diagnóstico ni interpretación clínica. Las predicciones computacionales no equivalen a evidencia funcional.

## ✨ Qué integra

- 🧪 **núcleo TypeScript** para secuencias, traducción, ORF, variantes, G-cuádruplex y estadísticas;
- 📚 **base científica JSON** dividida por dominios y compilada como bundle;
- 🧾 **contratos comunes** `ScientificResult<T>` y coordenadas genómicas 0-based half-open;
- 📄 **lectores** FASTA, GFF3 y VCF;
- 🧬 **perfiles de organismo** y compartimento;
- 🗂️ **registro de módulos y capacidades** con madurez y evidencia;
- 🖥️ **CLI científica**, laboratorio web (PWA) y juego educativo secundario;
- 🧭 RFCs, roadmap, plantillas y criterios de promoción de madurez;
- 📦 **distribución web precompilada** dentro del mismo repositorio.

## 🚀 Requisitos y arranque

- Node.js 20 o superior;
- pnpm 11. No se admite npm ni yarn para desarrollar el repositorio.

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm check
pnpm dev
```

## 🖥️ Abrir sin instalar dependencias

Windows:

```text
start_prebuilt_windows.bat
```

Linux/macOS:

```bash
./start_prebuilt.sh
```

## ⌨️ CLI

```bash
pnpm cli -- capabilities --json
pnpm cli -- modules --maturity experimental --json
pnpm cli -- profiles --json
pnpm cli -- summary examples/sequences/example.fasta --json
pnpm cli -- gff-summary examples/annotations/example.gff3 --json
pnpm cli -- vcf-summary examples/variants/example.vcf --json
```

## 🧩 Crear la próxima capacidad

```bash
pnpm new:module -- methylation-analysis experimental "Análisis de metilación"
```

Luego complete el manifiesto, registre capacidades, agregue pruebas, referencias y limitaciones. Consulte [Sistema de módulos](docs/MODULE_SYSTEM.md) y [Definición de terminado](docs/DEFINITION_OF_DONE.md).

## 🗂️ Estructura

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

## 🧭 Evolución

La versión 1.0 establece la plataforma; no declara finalizada la genómica. El [roadmap](docs/ROADMAP.md) prioriza anotaciones, transcritos, variantes interoperables, regulación, pangenomas y genómica de sistemas conforme exista validación suficiente.

## 📄 Licencias

Código MIT. Los hechos estructurados propios se distribuyen bajo CC0-1.0; cada fuente y dataset externo conserva sus propios términos.
