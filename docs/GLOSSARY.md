# 📗 Glosario

Términos de genética, genómica y del propio proyecto. Pensado para lectura educativa; las definiciones son operativas, no exhaustivas.

## Biología molecular

- **ADN / ARN** — polímeros de nucleótidos. El ADN usa las bases A, C, G, T; el ARN sustituye T por U.
- **Base / nucleótido** — unidad de una secuencia (A, C, G, T/U).
- **Símbolos IUPAC** — códigos para bases ambiguas (p. ej. `R` = A o G). El proyecto reconoce los 15 símbolos.
- **Hebra (strand)** — cada una de las dos cadenas del ADN; `+` (directa) y `-` (reversa).
- **Complementaria / complementaria inversa** — la hebra opuesta; la inversa se lee en sentido contrario.
- **Transcripción** — copia de ADN a ARN mensajero (ARNm).
- **Traducción** — lectura del ARNm en codones para producir una proteína.
- **Codón** — triplete de bases que codifica un aminoácido o una señal de parada (STOP).
- **Marco de lectura (frame)** — punto de inicio de la lectura en tripletes (1, 2 o 3).
- **Código genético** — tabla codón→aminoácido. El proyecto soporta el estándar nuclear y el mitocondrial humano.
- **Aminoácido** — unidad de una proteína; hay 20 canónicos.
- **ORF (Open Reading Frame)** — marco abierto de lectura; región que podría codificar una proteína. Su detección **no** demuestra expresión.
- **CDS (Coding Sequence)** — secuencia codificante de un transcrito.
- **Transcrito / exón / intrón** — un gen puede producir varios transcritos; los exones se conservan y los intrones se eliminan.
- **Proteoma** — conjunto de proteínas; no es una lista estática de todo lo expresado en toda condición.
- **Contenido GC** — proporción de bases G y C en una secuencia.
- **G-cuádruplex (G4)** — estructura no canónica de ADN/ARN rica en G. El detector reporta **candidatos de secuencia**, no estructuras demostradas.
- **Mosaicismo somático** — presencia de variantes en solo una fracción de las células de un individuo.

## Variantes

- **Variante** — diferencia respecto a una referencia (sustitución, inserción, deleción).
- **SNV** — variante de un solo nucleótido. **Indel** — inserción o deleción.
- **Alelo** — cada versión alternativa en una posición. Un `-` representa un alelo vacío.
- **Multialélico** — posición con más de un alelo alternativo.
- **Fracción alélica** — proporción de lecturas con el alelo alternativo. **No** equivale directamente a la fracción de células mutadas.
- **Genotipo** — combinación de alelos observada en una muestra.

## Formatos y coordenadas

- **FASTA** — texto para secuencias.
- **GFF3** — anotaciones de características genómicas (coordenadas 1-based, cerradas).
- **VCF** — variantes con encabezado, INFO, FORMAT y muestras (posición 1-based).
- **Coordenadas 0-based half-open** — convención interna del proyecto: el inicio cuenta desde 0 y el final es exclusivo. Se convierte explícitamente desde/hacia las coordenadas 1-based de GFF3/VCF.
- **Pangenoma** — representación en grafo de múltiples genomas (haplotipos y rutas), frente a una única referencia lineal.

## Conceptos del proyecto

- **`ScientificResult<T>`** — contrato de salida común: incluye análisis, módulo, versión, madurez, nivel de evidencia, parámetros, resultado, advertencias y limitaciones. Ver [contrato](SCIENTIFIC_RESULT_CONTRACT.md).
- **Módulo** — unidad que agrupa capacidades con una madurez, evidencia y limitaciones declaradas. Ver [sistema de módulos](MODULE_SYSTEM.md).
- **Capacidad** — función concreta que ofrece un módulo (p. ej. `sequence.orf`).
- **Registro** — `registry/modules.json`, fuente ejecutable del estado de módulos y capacidades.
- **Perfil de organismo** — contexto configurable (polímero, hebras, topología, compartimento, código genético) para no asumir siempre ADN humano nuclear. Ver [perfiles](ORGANISM_PROFILES.md).
- **Bundle** — `biology.json` generado desde `data/domains/` con `pnpm data:bundle`.

## Nivel de evidencia

De mayor a menor respaldo. Detalle en el [modelo de evidencia](EVIDENCE_MODEL.md).

- **observed** — medido u observado directamente.
- **experimentally_supported** — respaldado por experimentos.
- **computational_prediction** — predicho por un método; requiere validación.
- **hypothesis** — propuesta no confirmada.
- **unknown** — sin clasificar.

## Madurez del módulo

Es la **señal de evolución** del proyecto (la versión de todos los módulos es la del release; ver [FAQ](FAQ.md)).

- **concept** — contrato o idea, sin implementación completa.
- **experimental** — implementado, sin validación suficiente.
- **validated** — validado dentro de su alcance declarado.
- **stable** — estable y con compatibilidad cuidada.
- **deprecated** — en retirada.
