# Modelo de datos para genómica de sistemas

## Diseño

La base científica separa entidades estables de observaciones contextuales.

```text
fuente
  ├── referencia o ensamblaje
  ├── representación genómica
  ├── frontera de investigación
  ├── ensayo
  └── entidad molecular o celular
```

## Secciones principales

### `evidence_levels`

Vocabulario controlado para observación, apoyo experimental, predicción, hipótesis y desconocido.

### `genome_representations`

Describe referencias lineales, ensamblajes telómero-a-telómero y pangenomas en grafo. No confunde copias cromosómicas, segmentos ni hebras moleculares.

### `research_frontiers`

Cada registro incluye pregunta, razón por la que sigue abierta, métodos actuales, tipos de datos, madurez, evidencia y fuentes.

### `assay_catalog`

Define qué mide cada ensayo, salidas usuales, fortalezas y limitaciones. Un formato de salida no es equivalente a evidencia interpretada.

### `epigenetic_marks` y `chromatin_features`

Registran asociaciones típicas con advertencias. No codifican reglas universales de activación o represión.

### `single_cell_modalities`

Separa unidad de observación, modalidad medida y desafíos como dropout, dobletes, lotes o desconvolución.

### `dna_repair_pathways`

Describe daño principal, uso de molde y notas de mecanismo. No modela cinética ni elección completa de vía.

### `noncanonical_structures`

Registra polímero, alcance local, participantes, señal de secuencia y advertencia de evidencia.

### `genome_editing_tools`

Describe clase de edición, capacidad y riesgos. No contiene protocolos de intervención humana.

### `ethical_principles`

Define requisitos mínimos para privacidad, consentimiento, representación, reproducibilidad y separación clínica.

## Convenciones de coordenadas

- Base cero.
- Intervalos semiabiertos `[start, end)`.
- Secuencias de entrada 5′→3′.
- La hebra se declara como `+` o `-`.
- Las inserciones usan `reference: ""`; las deleciones usan `alternate: ""`.
- La CLI acepta `-` y lo convierte en cadena vacía.

## Evolución del esquema

Los cambios incompatibles incrementan `schema_version`. Cada migración debe:

1. actualizar tipos TypeScript;
2. actualizar JSON Schema;
3. actualizar validación de integridad;
4. agregar pruebas;
5. documentar el cambio en `CHANGELOG.md`;
6. preservar o migrar identificadores estables.
