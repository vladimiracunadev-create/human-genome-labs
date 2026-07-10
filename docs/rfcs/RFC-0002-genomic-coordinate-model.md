# RFC-0002-genomic-coordinate-model: Modelo de coordenadas genómicas

**Estado:** `implemented`  
**Versión objetivo:** v1.x

## Problema

Adoptar 0-based half-open internamente y convertir formatos en los bordes.

## Alcance

Definir contratos, responsabilidades y compatibilidad. La implementación debe conservar evidencia y limitaciones.

## Alternativas

Mantener lógica dentro de aplicaciones fue descartado porque duplica algoritmos y dificulta validación.

## Riesgos

Complejidad arquitectónica, contratos prematuros y falsa sensación de cobertura científica.

## Validación

Pruebas automatizadas, ejemplos pequeños, documentación y revisión del registro de capacidades.
