# Reproducibilidad

## Entorno

- Node.js 20 o superior.
- pnpm 11.
- lockfile versionado.
- TypeScript estricto.

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm check
```

## Registro mínimo por ejecución

```json
{
  "software": "human-genome-labs",
  "version": "1.0.0",
  "command": "pnpm cli -- ...",
  "input_sha256": "...",
  "reference_accession": "...",
  "parameters": {},
  "evidence_level": "computational_prediction",
  "executed_at": "ISO-8601"
}
```

## Datasets

Los datos grandes se almacenan en `datasets/raw/` y no se versionan. Cada descarga debe conservar:

- nombre original;
- acceso y versión;
- URL o comando oficial;
- fecha;
- checksum;
- licencia o términos;
- notas de procesamiento.

## Predicciones

Para candidatos G4, registre además:

- patrón utilizado;
- longitud mínima del tracto G;
- rango de bucles;
- orientación;
- versión del algoritmo;
- afirmación explícita de que es una predicción.

## Variantes

Registre:

- sistema de coordenadas;
- secuencia o transcrito;
- marco y código genético;
- posición base cero;
- alelos;
- checksum de la secuencia;
- limitación de que la CDS es aislada.

## Frecuencia alélica

Conserve conteos brutos, profundidad, filtros, calidad, plataforma y región. El intervalo estadístico no corrige sesgos experimentales.
