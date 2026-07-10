# Changelog

Este proyecto sigue [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2026-07-10

Primer release estable de la plataforma.

### Added

- núcleo TypeScript para secuencias: normalización, composición, transcripción, traducción, ORF, uso de codones, variantes sobre CDS, G-cuádruplex y estadísticas;
- contratos comunes `ScientificResult<T>` y coordenadas genómicas 0-based half-open;
- paquetes `scientific-contracts`, `genetics-core`, `file-formats`, `organism-profiles` y `biology-data`;
- lectores iniciales FASTA, GFF3 y VCF;
- perfiles de organismo y compartimento versionados;
- base científica JSON dividida por dominios y compilada como bundle generado;
- registro de módulos y capacidades con madurez, evidencia y limitaciones explícitas;
- CLI científica, laboratorio web y juego secundario;
- plantillas y comando para crear módulos, RFCs, roadmap, versionado y definición de terminado;
- distribución web precompilada integrada en el repositorio;
- verificación de integridad por checksums (`INTEGRITY.sha256`);
- pruebas para núcleo, datos, formatos, contratos y registro.

### Notes

- la plataforma es evolutiva: mantiene un núcleo verificable e incorpora investigación mediante módulos con madurez explícita;
- no realiza diagnóstico ni interpretación clínica; las predicciones computacionales no equivalen a evidencia funcional.
