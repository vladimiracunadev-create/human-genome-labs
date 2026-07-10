# Distribución integrada

Human Genome Labs se entrega como un único repositorio y un único ZIP. El árbol incluye fuente, datos versionados, registro evolutivo, ejemplos, pruebas, documentación y `dist/` precompilado.

## Contenido

- `apps/`: CLI y laboratorio web;
- `packages/`: datos, contratos, formatos, perfiles y algoritmos;
- `modules/`: manifiestos conceptuales, experimentales y validados;
- `registry/`: capacidades consultables;
- `dist/`: aplicación web precompilada;
- `datasets/`: manifiestos y espacios para datos grandes;
- `docs/`: arquitectura, ciencia, RFCs y roadmap;
- `templates/`: creación de módulos;
- `tests/`: validación automatizada.

## Ejecutar sin dependencias

```bash
node tools/server.mjs dist
```

La web estática procesa las secuencias localmente y no descarga genomas por defecto.

## Desarrollo

```bash
corepack enable
corepack prepare pnpm@11.0.0 --activate
pnpm install --frozen-lockfile
pnpm check
```

No se admite npm ni yarn. Node.js directo se reserva para utilidades internas y para servir la distribución ya compilada.

## Integridad

```bash
pnpm verify:integrity
```

En Windows también puede ejecutar `verify_integrity_windows.bat`.

`INTEGRITY.sha256` excluye su propio archivo y los directorios temporales `.build`, `node_modules` y `.git`.
