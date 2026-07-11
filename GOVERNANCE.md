# 🏛️ Gobernanza

Cómo se toman las decisiones en Human Genome Labs. El objetivo es que un proyecto científico y abierto sea **predecible y confiable** para quien lo usa o contribuye.

## Principios

1. **La ciencia manda sobre la interfaz.** El código no decide la biología: consume un registro con evidencia y limitaciones explícitas.
2. **Evolución por madurez, no por promesa.** Una capacidad solo avanza (`concept` → `experimental` → `validated` → `stable`) cuando cumple criterios verificables.
3. **Honestidad de evidencia.** Toda salida declara su nivel de evidencia; una predicción no se presenta como un hecho.
4. **Cambios trazables.** Las decisiones relevantes quedan registradas (ADR/RFC), no en la memoria de nadie.

## Roles

- **Mantenedores del núcleo (`core-maintainers`)** — custodian los contratos, el núcleo científico y los formatos; revisan y aprueban cambios.
- **Mantenedores de investigación (`research-maintainers`)** — cuidan los módulos experimentales y de concepto.
- **Contribuidores** — cualquiera que proponga issues, PRs o RFCs.

Los responsables por módulo se declaran en el campo `owners` de `registry/modules.json`.

## Cómo se decide

| Tipo de cambio | Mecanismo |
|---|---|
| Corrección o mejora acotada | Pull request + revisión de un mantenedor |
| Cambio de contrato, coordenadas o modelo de datos | [RFC](docs/RFC_PROCESS.md) antes de implementar |
| Decisión de arquitectura de largo alcance | [ADR](docs/adr/0001-typescript-pnpm-monorepo.md) |
| Subir un módulo de madurez | Cumplir la [Definición de terminado](docs/DEFINITION_OF_DONE.md) |
| Prioridades del proyecto | [Roadmap](docs/ROADMAP.md) + issues `proposal:` |

## Criterios para promover madurez

Un módulo sube de nivel solo si cumple, de forma verificable, la [Definición de terminado](docs/DEFINITION_OF_DONE.md): pruebas, datos reproducibles, fuentes trazables, API documentada y comparación con herramientas o conjuntos conocidos. La promoción se refleja en `registry/modules.json` y en [PROJECT_STATUS](docs/PROJECT_STATUS.md).

## Convertirse en mantenedor

Se invita a mantenedores a quienes demuestran, con el tiempo, contribuciones de calidad y criterio en revisiones y RFCs. No hay un proceso burocrático: es reconocimiento a la trayectoria dentro del proyecto.

## Conducta

Toda participación se rige por el [Código de conducta](CODE_OF_CONDUCT.md). La seguridad se gestiona según [SECURITY.md](SECURITY.md).

## Versionado y compatibilidad

El proyecto sigue [Versionado Semántico](docs/VERSIONING.md). Los cambios se registran en el [CHANGELOG](CHANGELOG.md); la versión es única para toda la plataforma y la madurez expresa la evolución por módulo.
