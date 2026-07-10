# Seguridad

No publiques vulnerabilidades, credenciales ni datos sensibles en issues públicos. Reporta problemas de forma privada al responsable del repositorio.

## Datos genómicos humanos

Los datos genómicos pueden ser identificables y revelar relaciones familiares o información sensible. Este proyecto no está diseñado para almacenar genomas personales.

Antes de procesar datos reales, evalúa:

- consentimiento y finalidad permitida;
- minimización y seudonimización;
- cifrado en tránsito y reposo;
- control de acceso y registro de auditoría;
- ubicación, retención y eliminación;
- restricciones de uso del dataset;
- normativa y revisión institucional aplicables.

Nunca incluyas FASTQ, BAM, CRAM, VCF, fenotipos o metadatos personales en commits, issues, artefactos públicos o ejemplos.

## Dependencias y descargas

- instala exclusivamente con `pnpm install --frozen-lockfile`;
- verifica sumas SHA-256;
- descarga desde proveedores oficiales;
- revisa cambios de accesiones y esquemas;
- evita ejecutar datos o scripts descargados sin inspección;
- mantén permisos mínimos en GitHub Actions.

## Resultados científicos

Una interpretación incorrecta también puede generar daño. Mantén visibles las advertencias clínicas, el nivel de evidencia y las limitaciones de cada análisis.
