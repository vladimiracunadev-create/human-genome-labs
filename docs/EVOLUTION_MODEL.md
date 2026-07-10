# Modelo de evolución del producto

Human Genome Labs no se define como producto terminado. Es una plataforma científica que conserva un núcleo pequeño y verificable mientras incorpora capacidades mediante módulos versionados.

## Principios

1. **Núcleo estable, fronteras abiertas.** Las funciones moleculares fundamentales permanecen pequeñas; la investigación nueva comienza fuera del núcleo.
2. **Madurez explícita.** Todo módulo es `concept`, `experimental`, `validated`, `stable` o `deprecated`.
3. **Evidencia explícita.** Cada salida distingue observación, apoyo experimental, predicción, hipótesis o desconocido.
4. **Compatibilidad antes que crecimiento desordenado.** Las capacidades se registran mediante identificadores persistentes.
5. **Reproducibilidad.** Entradas, parámetros, procedencia, versión, advertencias y limitaciones forman parte del resultado.
6. **Una sola fuente científica; múltiples interfaces.** CLI, web, API y juego consumen los mismos paquetes.

## Flujo de madurez

```text
concept → experimental → validated → stable
                         ↘ deprecated
```

Un módulo no avanza solo porque compile. Debe aportar pruebas, referencias, documentación, datos reproducibles y comparación con resultados conocidos.

## Unidad de crecimiento

La unidad de crecimiento es una **capacidad**, no una pantalla. Cada capacidad pertenece a un módulo y declara entradas, salidas, interfaces, evidencia y limitaciones en `registry/modules.json`.
