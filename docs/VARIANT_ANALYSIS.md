# Análisis exploratorio de variantes

## Propósito

El módulo permite observar cómo una variante simple modifica una secuencia codificante proporcionada por el usuario.

## Representación

```ts
interface SequenceVariant {
  position: number;    // base cero
  reference: string;  // vacío para inserción
  alternate: string;  // vacío para deleción
}
```

Antes de aplicar la variante, el programa comprueba que el alelo de referencia coincide exactamente en la posición declarada.

## Efectos informados

- `unchanged`
- `synonymous`
- `missense`
- `nonsense`
- `start-loss`
- `stop-loss`
- `inframe-indel`
- `frameshift`
- `invalid`

## Limitaciones

El análisis no incorpora:

- genes ni transcritos reales;
- exones o splicing;
- orientación genómica automática;
- múltiples isoformas;
- variantes estructurales complejas;
- normalización izquierda de VCF;
- frecuencias poblacionales;
- conservación;
- evidencia funcional;
- guías clínicas.

Por ello, el resultado se denomina **efecto molecular exploratorio**.

## Frecuencia alélica

`summarizeAlleleObservation` calcula:

- lecturas de referencia;
- fracción alternativa observada;
- intervalo Wilson del 95 %.

No convierte la fracción de lecturas en fracción celular. La relación depende de pureza, ploidía, número de copias, sesgo alélico, profundidad, mapeo y errores.

## Ejemplos

```bash
pnpm cli -- variant examples/sequences/example.fasta \
  --position 3 --ref G --alt A --json

pnpm cli -- allele-fraction --alt-reads 12 --total-reads 100 --json
```
