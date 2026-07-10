# ADR 0003: Genómica de sistemas consciente del nivel de evidencia

- Estado: aceptado
- Fecha: 2026-07-10

## Contexto

La secuencia del ADN no basta para representar regulación, diversidad, organización nuclear, heterogeneidad celular o fenotipo. Sin embargo, ampliar el repositorio crea el riesgo de presentar predicciones o asociaciones como hechos demostrados.

## Decisión

1. El repositorio incorpora dominios de genómica de sistemas mediante datos versionados y módulos desacoplados.
2. Toda entidad interpretativa puede declarar un nivel de evidencia.
3. Los detectores de motivos estructurales se etiquetan como predicciones.
4. El análisis de variantes se limita a efectos moleculares sobre una CDS aislada.
5. La interfaz y CLI muestran advertencias de alcance.
6. La interpretación clínica permanece fuera del proyecto.

## Consecuencias

- Aumenta la claridad científica y la trazabilidad.
- El JSON y los tipos son más extensos.
- Cada módulo futuro debe documentar qué mide, qué infiere y qué no puede concluir.
