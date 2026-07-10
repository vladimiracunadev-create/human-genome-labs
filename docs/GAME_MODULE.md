# Módulo de juego

El juego está dentro de `apps/web-lab`, pero es **secundario**. Su objetivo es practicar reglas ya implementadas por `packages/genetics-core`.

## Modos

- codón → aminoácido;
- aminoácido → codón;
- ADN → ARN;
- complemento;
- desafío mixto.

## Restricciones arquitectónicas

- no define tablas genéticas propias;
- no modifica `biology.json`;
- no implementa algoritmos científicos duplicados;
- puntaje y progreso se guardan solo en almacenamiento local;
- ninguna secuencia se envía fuera del navegador.

## Uso pedagógico

Los ejercicios simplifican procesos complejos. La interfaz debe diferenciar claramente una regla didáctica de una afirmación experimental o clínica.
