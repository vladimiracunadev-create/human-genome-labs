# Fronteras de investigación genómica

## Idea central

Conocer el orden de A, C, G y T no significa comprender completamente el genoma. La investigación actual intenta conectar secuencia, variación, regulación, organización espacial, estado celular, ambiente y fenotipo.

Las diez fronteras se almacenan en `biology.json#research_frontiers` y se muestran en la aplicación web.

## 1. Pangenoma y diversidad humana

**Pregunta:** ¿cómo representar múltiples haplotipos, inserciones y variantes estructurales sin depender de una única referencia lineal?

**En el repositorio:** modelos `linear_reference`, `telomere_to_telomere` y `pangenome_graph`; fuentes HGRP/HPRC; tipos de datos FASTA, GFA y VCF.

**No implementado:** construcción o indexación de grafos pangenómicos reales.

## 2. Función del genoma no codificante

**Pregunta:** ¿qué regiones regulan genes o cumplen funciones estructurales y en qué contexto?

**En el repositorio:** catálogo de elementos, ensayos ENCODE, advertencia de que actividad bioquímica no equivale a necesidad funcional.

## 3. Regulación y epigenómica

**Pregunta:** ¿cómo se combinan metilación, histonas, accesibilidad y factores de transcripción?

**En el repositorio:** marcas epigenéticas, asociaciones típicas, cautelas y ensayos relacionados.

## 4. Organización 3D y 4D

**Pregunta:** ¿cómo influyen contactos, bucles, dominios y cambios temporales del núcleo?

**En el repositorio:** características de cromatina, escalas, tipos de datos y ensayos Hi-C/Micro-C.

## 5. De variante a función y fenotipo

**Pregunta:** ¿cómo una variante altera mecanismos moleculares y rasgos?

**En el repositorio:** análisis molecular limitado a CDS, catálogo MPRA/CRISPR y documentación IGVF.

**Límite:** no predice patogenicidad ni fenotipo.

## 6. Célula única y genómica espacial

**Pregunta:** ¿qué tipos y estados celulares existen y dónde se ubican?

**En el repositorio:** modalidades scRNA-seq, scATAC-seq, multiome y transcriptómica espacial, con desafíos técnicos.

## 7. Mosaicismo somático

**Pregunta:** ¿qué variantes aparecen durante la vida y cómo se distribuyen entre tejidos?

**En el repositorio:** frecuencia alélica observada e intervalo Wilson, fuentes SMaHT y advertencias sobre pureza, ploidía y errores.

## 8. Daño, reparación y envejecimiento

**Pregunta:** ¿cómo elige la célula una vía de reparación y por qué algunos daños persisten?

**En el repositorio:** BER, NER, MMR, HR y NHEJ; relación con edición genómica y estabilidad.

## 9. Estructuras no canónicas

**Pregunta:** ¿cuándo se forman G-cuádruplex, tríplex, R-loops y cruciformes?

**En el repositorio:** catálogo estructural y detector de candidatos G4 clasificado como predicción computacional.

## 10. Edición genómica segura

**Pregunta:** ¿cómo modificar el sitio, tejido y momento correctos minimizando efectos no deseados?

**En el repositorio:** CRISPR-Cas9, edición de bases, prime editing y edición epigenómica, con capacidades y riesgos.

## Uso correcto

Estas fronteras son una guía de investigación y arquitectura. Cada área debe evolucionar mediante módulos desacoplados, fuentes verificables, formatos estándar y niveles de evidencia explícitos. Ningún módulo futuro debe convertir automáticamente una señal computacional en una afirmación clínica.
