# ❓ Preguntas frecuentes

## Sobre el propósito

### ¿Sirve para diagnóstico o interpretación clínica?

**No.** La plataforma no realiza diagnóstico ni interpretación clínica, y las predicciones computacionales no equivalen a evidencia funcional. Consulta a un profesional para cualquier decisión de salud.

### ¿Reemplaza a herramientas como VEP, GATK o ClinVar?

No. Es una plataforma científica y educativa con un núcleo verificable; no sustituye pipelines especializados. Ver [Alcance científico](SCIENTIFIC_SCOPE.md) y los [No-objetivos del roadmap](ROADMAP.md#-no-objetivos-explícito).

### ¿Para quién es?

Para investigadores, desarrolladores y educadores/estudiantes que quieran explorar genética molecular y genómica con resultados trazables. El [índice de documentación](INDEX.md) tiene un camino por perfil.

## Sobre las versiones y la madurez

### ¿Por qué todos los módulos son la versión 1.0.0?

Porque la **versión** es la del release de la plataforma y es única en todo el proyecto. La **evolución** de cada módulo se expresa con su **madurez** (`concept`, `experimental`, `validated`), no con un número de versión distinto. Así se evita mezclar dos señales que confundían. Ver [Glosario → Madurez](GLOSSARY.md#madurez-del-módulo) y [Versionado](VERSIONING.md).

### ¿Qué significa que un módulo sea `experimental`?

Que está implementado pero aún **no** tiene validación suficiente. Sus resultados deben leerse con las limitaciones que declara. Los criterios para subir de madurez están en [Definición de terminado](DEFINITION_OF_DONE.md).

### ¿Qué es el nivel de evidencia de un resultado?

Cada `ScientificResult` declara si su salida es `observed`, `experimentally_supported`, `computational_prediction` o `hypothesis`. Ver [Modelo de evidencia](EVIDENCE_MODEL.md).

## Sobre el uso

### ¿Puedo usar mis propios datos?

Sí. La CLI acepta archivos FASTA, GFF3 y VCF; ver la [guía de arranque](../GETTING_STARTED.md) y [CLI](CLI.md). Los datos grandes van en `datasets/raw/` y no se versionan.

### ¿Por qué coordenadas 0-based half-open?

Es la convención interna del contrato para evitar ambigüedad. GFF3 y VCF usan coordenadas 1-based; la plataforma **convierte explícitamente** entre ambas y lo indica en cada resultado. Ver [Glosario → Coordenadas](GLOSSARY.md#formatos-y-coordenadas).

### ¿Necesito conexión a internet?

No para el núcleo: el laboratorio web es una PWA que funciona offline tras la primera carga, y la CLI opera sobre archivos locales. Solo las descargas de referencias externas (NCBI, UniProt) requieren red.

## Sobre el entorno

### ¿Por qué pnpm y no npm o yarn?

El repositorio es un monorepo con workspaces y usa pnpm 11 de forma exclusiva para instalaciones reproducibles. Un hook `preinstall` bloquea otros gestores. Ver [GETTING_STARTED](../GETTING_STARTED.md).

### `pnpm check` falla en mi máquina, ¿qué reviso?

Confirma **Node 22+** y **pnpm 11** (`corepack prepare pnpm@11.0.0 --activate`). `pnpm check` ejecuta bundle, typecheck, validaciones, tests y build; el error suele indicar el paso concreto. Si persiste, abre un issue (ver [SUPPORT](../SUPPORT.md)).

### ¿Cómo abro el laboratorio sin instalar dependencias?

Con la distribución precompilada: `start_prebuilt_windows.bat` (Windows) o `./start_prebuilt.sh` (Linux/macOS), o el [sitio en vivo](https://vladimiracunadev-create.github.io/human-genome-labs/).

## Sobre la comunidad

### ¿Cómo cito el proyecto?

Usa [CITATION.cff](../CITATION.cff). Cita también las accesiones o fuentes de los datasets que analices, y distingue resultados observados de predicciones.

### ¿Cómo propongo o contribuyo una capacidad nueva?

Lee [CONTRIBUTING](../CONTRIBUTING.md) y, para cambios de contrato o modelo de datos, el [Proceso RFC](RFC_PROCESS.md). El [roadmap](ROADMAP.md#-cómo-influir-en-el-roadmap) explica cómo influir en las prioridades.
