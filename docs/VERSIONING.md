# Versionado y compatibilidad

El proyecto usa SemVer para el repositorio y versiones independientes en los manifiestos de módulos.

- **MAJOR:** ruptura de contratos, coordenadas, esquemas o API pública.
- **MINOR:** nueva capacidad compatible, nuevo formato o módulo.
- **PATCH:** corrección sin cambio de contrato.

Los archivos JSON declaran `schemaVersion`. Un cambio incompatible de esquema incrementa su versión mayor aunque el contenido científico solo cambie en forma menor.
