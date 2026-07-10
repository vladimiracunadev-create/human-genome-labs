# Modelo de evidencia

## Objetivo

Evitar uno de los errores más comunes en bioinformática: presentar una predicción, asociación o enriquecimiento como si fuera una función demostrada.

## Niveles

### `observed`

Dato medido mediante un ensayo definido. Debe registrar muestra, protocolo, controles, versión y procesamiento.

### `experimentally_supported`

Conclusión respaldada por experimentos, pero dependiente del sistema, tejido, momento y perturbación.

### `computational_prediction`

Inferencia derivada de reglas, modelos estadísticos o aprendizaje automático. Requiere validación independiente.

### `hypothesis`

Explicación plausible que organiza observaciones, pero aún no dispone de apoyo suficiente.

### `unknown`

Información insuficiente o procedencia incapaz de sostener una clasificación.

## Aplicación en el código

- `findGQuadruplexCandidates` devuelve siempre `computational_prediction`.
- `summarizeAlleleObservation` informa una observación de lecturas, no una fracción celular.
- `analyzeCodingVariant` describe una consecuencia molecular computacional sobre una CDS aislada.
- `research_frontiers` declara el nivel asociado con el estado del conocimiento descrito.
- `assay_catalog` declara qué mide un ensayo y sus limitaciones.

## Reglas para contribuciones

1. Toda afirmación nueva debe enlazar fuentes.
2. Un dato derivado debe conservar procedencia y parámetros.
3. Una predicción debe usar lenguaje como “candidato”, “posible” o “estimado”.
4. Una asociación no debe etiquetarse como causal sin perturbación y controles apropiados.
5. Una conclusión clínica queda fuera de alcance, incluso si existen bases externas relacionadas.
