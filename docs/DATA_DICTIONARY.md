# Diccionario de datos

## Metadatos y procedencia

| Campo | Descripción |
|---|---|
| `metadata.version` | versión semántica de la base |
| `metadata.schema_version` | versión del contrato estructural |
| `metadata.scope` | alcance científico declarado |
| `metadata.limitations` | límites obligatorios de interpretación |
| `sources[]` | fuente, autoridad, URL, fecha de acceso y propósito |

## Biología molecular

| Sección | Contenido |
|---|---|
| `bases` | bases de ADN/ARN y apareamiento |
| `iupac_dna_symbols` | 15 símbolos, posibilidades y complemento |
| `amino_acids` | códigos, propiedades y codones |
| `codons` | 64 codones y traducciones estándar/mitocondrial |
| `signals` | señales de inicio y parada |
| `genetic_codes` | tablas de traducción implementadas |
| `molecules` | ADN, ARN y otras entidades introductorias |
| `processes` | replicación, transcripción, traducción, etc. |
| `mutation_types` | vocabulario básico de cambios |

## Referencias humanas

| Sección | Contenido |
|---|---|
| `reference_assemblies` | accesiones de ensamblajes humanos |
| `proteomes` | proteomas de referencia |
| `human_chromosomes` | cromosomas y notas de copia |
| `genome_representations` | referencia lineal, T2T y pangenoma en grafo |

## Evidencia y preguntas abiertas

| Sección | Contenido |
|---|---|
| `evidence_levels` | vocabulario controlado de evidencia |
| `research_frontiers` | diez preguntas abiertas con métodos y fuentes |
| `assay_catalog` | qué mide cada ensayo, salidas y limitaciones |

## Regulación y organización

| Sección | Contenido |
|---|---|
| `epigenetic_marks` | marcas y asociaciones contextuales |
| `chromatin_features` | bucles, TAD, compartimentos y territorios |
| `single_cell_modalities` | modalidades, unidad y desafíos |

## Estabilidad y estructuras

| Sección | Contenido |
|---|---|
| `dna_repair_pathways` | BER, NER, MMR, HR y NHEJ |
| `noncanonical_structures` | G4, tríplex, R-loop y cruciforme |
| `genome_editing_tools` | clases de edición, capacidades y riesgos |

## Gobernanza

| Sección | Contenido |
|---|---|
| `ethical_principles` | privacidad, consentimiento, equidad y trazabilidad |
| `game` | configuración del módulo educativo secundario |

## Identificadores

- Se mantienen estables y usan `snake_case` o kebab-case según la sección histórica.
- `source_ids` debe resolver a un elemento de `sources`.
- Los valores de `evidence_level` deben resolver a `evidence_levels[].id`.

## Organización evolutiva

`packages/biology-data/data/biology.json` es un artefacto generado. Sus fuentes editables se encuentran en `packages/biology-data/data/domains/` y se ensamblan según `manifest.json`.

| Recurso | Contenido |
|---|---|
| `registry/modules.json` | módulos, madurez, capacidades, interfaces y limitaciones |
| `registry/schema/module.schema.json` | contrato de manifiestos de módulo |
| `packages/organism-profiles/data/profiles.json` | contexto de organismo, compartimento, polímero, hebras y código genético |
| `ScientificResult<T>` | procedencia, parámetros, evidencia, advertencias y resultado tipado |
