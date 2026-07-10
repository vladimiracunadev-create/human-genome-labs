# Gestión de datasets

Esta carpeta separa el **código versionado** de los datos científicos voluminosos.

- `raw/`: descargas originales, inmutables y excluidas de Git.
- `processed/`: resultados derivados, también excluidos de Git.
- `manifest.json`: identificadores, proveedores y comandos reproducibles.

Cada script de descarga genera un archivo `.sha256`. No cambies manualmente un archivo original; descarga otra versión y actualiza el manifiesto con su acceso, fecha y justificación.

## Descargas

```bash
pnpm download:grch38
pnpm download:t2t
pnpm download:proteome
pnpm download:proteome -- --reviewed
```

Las descargas de NCBI requieren la herramienta oficial **NCBI Datasets CLI** disponible en el `PATH`.
