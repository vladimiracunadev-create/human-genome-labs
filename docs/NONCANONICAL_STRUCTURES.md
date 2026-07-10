# Estructuras no canónicas

## Alcance

La doble hélice es la forma principal del ADN genómico celular, pero regiones locales pueden adoptar otras conformaciones. El repositorio documenta G-cuádruplex, tríplex, R-loops y cruciformes.

## G-cuádruplex

El detector implementa un motivo clásico:

```text
G{3,} N{1,7} G{3,} N{1,7} G{3,} N{1,7} G{3,}
```

Se exploran ambas orientaciones y se informan coordenadas base cero. Este patrón es deliberadamente simple y educativo.

### Lo que significa un resultado

- La secuencia posee un motivo compatible con formación G4 bajo ciertos modelos.
- El resultado se clasifica como `computational_prediction`.

### Lo que no significa

- que la estructura exista en la célula;
- que sea estable en el tejido analizado;
- que regule un gen;
- que produzca enfermedad;
- que sea un blanco terapéutico válido.

## Tríplex

Una tercera cadena de ADN o ARN puede asociarse localmente con ADN bicatenario. La estabilidad depende de secuencia, orientación, condiciones fisicoquímicas y proteínas.

## R-loops

Un híbrido RNA:DNA desplaza una hebra de DNA. Pueden participar en regulación y estabilidad, pero su detección requiere ensayos y controles específicos.

## Cruciformes

Repeticiones invertidas pueden favorecer extrusión de horquillas bajo condiciones topológicas apropiadas. Una repetición invertida es señal de potencial, no prueba estructural.
