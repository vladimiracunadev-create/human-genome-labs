# Alcance científico

## Propósito

Human Genome Labs permite estudiar cómo una secuencia se conecta con niveles crecientes de organización biológica sin confundirlos:

```text
secuencia → variante → molécula → regulación → cromatina → célula → tejido → fenotipo
```

El repositorio implementa con mayor profundidad los primeros niveles y representa los niveles posteriores mediante modelos de datos, documentación, catálogos de ensayos y talleres exploratorios.

## Unidades de análisis

- secuencias de ADN escritas 5′→3′;
- símbolos canónicos e IUPAC ambiguos;
- codones bajo un marco, hebra y código genético declarados;
- aminoácidos y proteínas computacionales;
- ORF computacionales;
- variantes simples relativas a una secuencia proporcionada;
- observaciones de lecturas alternativas y totales;
- intervalos genómicos semiabiertos `[start, end)`;
- motivos candidatos a estructuras no canónicas;
- representaciones y metadatos de pangenoma, regulación, cromatina y célula única.

## Capas científicas

### 1. Secuencia

Resultados deterministas derivados de reglas explícitas: complemento, transcripción, traducción, composición y ORF.

### 2. Variación molecular

Comparación de una secuencia de referencia con un alelo alternativo sobre una CDS aislada. El resultado describe cambios computacionales en la traducción; no determina patogenicidad.

### 3. Contexto regulatorio y celular

La base registra ensayos, marcas, estructuras y modalidades. La interpretación causal requiere datos experimentales que el repositorio no genera por sí solo.

### 4. Genómica de sistemas

Las fronteras de investigación describen cómo se integran pangenoma, regulación, espacio nuclear, células, tejidos, reparación y edición. Se evita presentar una representación conceptual como un pipeline completo.

## Supuestos y convenciones

1. Las secuencias se normalizan a ADN; `U` se convierte en `T`.
2. Las coordenadas computacionales son base cero y el extremo final es exclusivo.
3. La traducción exige declarar código genético, hebra y marco.
4. Un ORF no equivale automáticamente a un gen expresado.
5. Una variante debe coincidir con el alelo de referencia en la coordenada declarada.
6. Una inserción o deleción se representa con un alelo vacío; la CLI usa `-`.
7. La frecuencia alélica observada es una proporción de lecturas, no una estimación directa de células mutadas.
8. Un motivo G4 es una predicción de secuencia, no una prueba estructural.
9. El código mitocondrial corresponde a la tabla de vertebrados empleada para mitocondria humana.

## Fuera de alcance

- diagnóstico o consejo médico;
- clasificación ACMG/AMP;
- anotación clínica de variantes;
- inferencia de penetrancia o riesgo;
- ensamblaje de lecturas;
- llamado de variantes desde FASTQ/BAM;
- alineamiento de genomas completos;
- construcción real de grafos pangenómicos;
- cuantificación de expresión, accesibilidad o metilación desde datos crudos;
- análisis completo de Hi-C o datos de célula única;
- predicción estructural molecular de alta fidelidad;
- diseño de guías clínicas de edición genética.

## Evidencia y causalidad

El repositorio obliga a distinguir:

- **observación:** una medición;
- **asociación:** dos fenómenos varían conjuntamente;
- **predicción:** un algoritmo infiere un resultado;
- **apoyo causal:** una perturbación modifica el resultado bajo controles;
- **interpretación clínica:** integración regulada de evidencia, fuera de alcance.

Consulta [EVIDENCE_MODEL.md](EVIDENCE_MODEL.md).

## Ética, privacidad y representación

Los ejemplos son sintéticos. No se deben versionar genomas personales, BAM/CRAM identificables, metadatos sensibles ni resultados clínicos. El trabajo con datos humanos requiere consentimiento, gobernanza, controles de acceso, revisión institucional y cumplimiento legal.

Una referencia humana no representa de manera completa a todas las poblaciones. Cualquier análisis debe documentar la procedencia de muestras, limitaciones de representación y riesgo de extrapolación.
