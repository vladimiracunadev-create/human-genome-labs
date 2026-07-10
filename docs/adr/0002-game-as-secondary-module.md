# ADR 0002: El juego es un módulo secundario

- Estado: aceptada
- Fecha: 2026-07-10

## Contexto

La primera versión se organizó alrededor del juego, lo que reducía claridad científica y reutilización.

## Decisión

El núcleo, los datos y la CLI son componentes principales. El juego consume esos componentes desde la aplicación web y no contiene reglas biológicas propias.

## Consecuencias

- mejora la trazabilidad;
- permite usar el repositorio sin interfaz lúdica;
- reduce divergencias entre resultados del juego y del análisis científico.
