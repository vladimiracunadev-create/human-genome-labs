# Contribuir

Human Genome Labs acepta crecimiento incremental, no acumulación desordenada.

## Preparación

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm check
```

## Cambios científicos

1. Abra o actualice un RFC cuando cambie arquitectura, contrato, coordenadas o esquema.
2. Cree un módulo con `pnpm new:module -- id maturity "Título"` si la capacidad no pertenece al núcleo.
3. Declare madurez, evidencia, entradas, salidas, fuentes y limitaciones.
4. Agregue pruebas y ejemplos pequeños reproducibles.
5. Actualice registro, documentación y CHANGELOG.

No se aceptarán resultados presentados como clínicos, predicciones sin etiqueta de evidencia ni datos externos sin procedencia y licencia.
