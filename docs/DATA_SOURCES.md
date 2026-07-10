# Fuentes y procedencia

## Recursos moleculares y referencias

| Recurso | Identificador/uso |
|---|---|
| NCBI Genetic Codes | tablas estándar y mitocondrial de vertebrados |
| NCBI GRCh38.p14 | `GCF_000001405.40` |
| NCBI T2T-CHM13v2.0 | `GCF_009914755.1` |
| UniProt Homo sapiens | `UP000005640` |

## Programas y consorcios de investigación

| Dominio | Fuente principal |
|---|---|
| referencia y pangenoma | NHGRI Human Genome Reference Program / HPRC |
| elementos funcionales | ENCODE |
| epigenómica | NHGRI Epigenomics |
| organización nuclear | NIH 4D Nucleome |
| variante a función | IGVF |
| célula única | Human Cell Atlas |
| mosaicismo somático | NIH SMaHT |
| reparación | NCBI Bookshelf |
| G-cuádruplex | revisión indexada en PubMed |
| tríplex RNA-DNA | revisión indexada en PubMed |
| edición genómica | NIH CRISPR Revolution |

Las URLs exactas, autoridad, propósito y fecha de acceso se almacenan en `biology.json#sources`.

## Política de actualización

1. Preferir organismos oficiales, consorcios o publicaciones primarias.
2. Verificar que la fuente sostenga exactamente el registro.
3. Registrar fecha de acceso y propósito.
4. Evitar cifras volátiles si no se fija una versión.
5. Actualizar JSON, esquema, tipos y documentación.
6. Ejecutar `pnpm check`.
7. Documentar cambios científicos en `CHANGELOG.md`.

## Datos derivados

Todo archivo en `datasets/processed/` debe incluir metadatos con:

- acceso o archivo de origen;
- checksum SHA-256;
- versión del proyecto;
- comando y parámetros;
- fecha y zona horaria;
- formatos de entrada/salida;
- advertencias y nivel de evidencia.

## Precisión terminológica

- Un ensamblaje no representa a todas las personas.
- Un pangenoma no elimina automáticamente sesgos poblacionales.
- Una señal ENCODE no demuestra función causal.
- Un contacto Hi-C no demuestra regulación.
- Una expresión de RNA no demuestra abundancia proteica.
- Una frecuencia alélica de lecturas no equivale a proporción celular.
