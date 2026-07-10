# Sistema de módulos

## Ubicación

```text
modules/
├── concept/
├── experimental/
└── validated/
```

Los algoritmos reutilizables permanecen en `packages/`; `modules/` declara alcance científico, madurez, capacidades y hoja de ruta.

## Manifiesto

Cada módulo contiene `module.json`, validado contra `registry/schema/module.schema.json`. La propiedad `clinicalUse` debe ser `false`.

## Crear un módulo

```bash
pnpm new:module -- nombre-del-modulo experimental "Título del módulo"
```

El comando crea un directorio desde `templates/module/`. Luego se debe agregar el manifiesto al registro, implementar pruebas y documentar las fuentes.

## Promoción

- `concept → experimental`: contrato definido y prototipo ejecutable.
- `experimental → validated`: pruebas de referencia, limitaciones, fuentes y comparación independiente.
- `validated → stable`: API pública congelada durante al menos una serie menor y política de compatibilidad.
- `* → deprecated`: reemplazo documentado y periodo de transición.
