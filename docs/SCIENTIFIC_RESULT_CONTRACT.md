# Contrato de resultados científicos

`@human-genome-labs/scientific-contracts` define `ScientificResult<T>`.

Todo análisis nuevo debería devolver:

- identificación y versión del módulo;
- madurez;
- estado;
- nivel de evidencia;
- procedencia de la entrada;
- parámetros;
- resultado tipado;
- advertencias y limitaciones;
- fecha de generación.

El contrato no convierte una predicción en evidencia. Su función es conservar contexto y evitar resultados huérfanos.

## Coordenadas

El contrato interno es **base cero, extremo final exclusivo**. GFF3 y VCF se convierten al ingresar, conservando también sus coordenadas originales.
