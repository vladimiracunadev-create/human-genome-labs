# ADR 0004: distribución única e integrada

- Estado: aceptada
- Fecha: 2026-07-10

## Contexto

El proyecto se entregaba en archivos separados para el código fuente, la aplicación web compilada y las sumas de integridad. Esto introducía ambigüedad sobre cuál archivo representaba el repositorio completo.

## Decisión

Mantener una sola distribución versionada. La carpeta `dist/` forma parte del repositorio y contiene una compilación web coherente con la versión del código. El manifiesto de integridad también se incorpora al árbol.

## Consecuencias

- El repositorio puede ejecutarse inmediatamente con Node.js.
- Las versiones ocupan más espacio debido a la duplicación fuente/compilado.
- CI debe comprobar que la compilación sea reproducible.
- pnpm continúa siendo el único administrador de paquetes para desarrollo.
