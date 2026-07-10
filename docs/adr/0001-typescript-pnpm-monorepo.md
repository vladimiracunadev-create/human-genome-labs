# ADR 0001: TypeScript y pnpm workspace

- Estado: aceptada
- Fecha: 2026-07-10

## Contexto

El proyecto combina núcleo científico, CLI, aplicación web y datos estructurados. Se requiere compartir tipos y algoritmos sin duplicación.

## Decisión

Usar TypeScript estricto en un workspace administrado exclusivamente con pnpm.

## Consecuencias

- tipos compartidos entre navegador y terminal;
- una sola instalación y lockfile;
- compilación sencilla a JavaScript estándar;
- el análisis masivo futuro podría incorporar componentes especializados sin desplazar el núcleo actual.
