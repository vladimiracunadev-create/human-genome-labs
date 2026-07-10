# Validación

## Cadena completa

```bash
pnpm check
```

Ejecuta:

1. `pnpm data:bundle`;
2. `pnpm typecheck`;
3. `pnpm validate:data`;
4. `pnpm validate:registry`;
5. `pnpm validate:docs`;
6. `pnpm test`;
7. `pnpm build`.

## Integridad de datos y registro

La validación comprueba:

- cinco dominios sin claves raíz duplicadas;
- 64 codones, 20 aminoácidos canónicos y 15 símbolos IUPAC;
- referencias y fuentes declaradas;
- niveles de evidencia;
- módulos físicos y registrados;
- unicidad de capacidades;
- resolución módulo → capacidad y módulo → fuente;
- `clinicalUse=false` y limitaciones obligatorias;
- enlaces internos de documentación.

## Pruebas automatizadas

La suite cubre genética molecular, traducción, ORF, variantes, G4, frecuencia alélica, intervalos, contratos científicos, coordenadas, FASTA, GFF3, VCF, registro evolutivo y perfiles de organismo.

Las pruebas confirman implementación y contratos; no validan por sí mismas una hipótesis biológica. Un módulo experimental requiere benchmarks y comparación independiente antes de promoverse.
