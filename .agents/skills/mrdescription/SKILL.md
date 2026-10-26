---
name: mrdescription
description: Genera una descripción clara y profesional para Merge/Pull Requests a partir del diff.
---

Analizá únicamente los cambios del diff (no el repo entero) y generá una
descripción breve, clara y profesional.

Incluí:

- **Objetivo**: qué problema resuelve o qué funcionalidad agrega.
- **Cambios principales**: archivos creados, modificados o eliminados, con una
  línea cada uno.
- **Bugs corregidos**: si aplica, cuál y cómo.
- **Refactors**: si aplica, qué se reestructuró y por qué.
- **Impacto**: cambios de contrato de API, migraciones, variables de entorno,
  dependencias nuevas.
- **Testing**: qué se corrió y con qué resultado (build, lint, unit, e2e, DoD).

Reglas:

- No inventar cambios que no están en el diff.
- Si hay una migración, nombrarla y aclarar si es reversible.
- Si cambia un endpoint, indicar método, ruta y roles.
- Sé conciso; no repitas información obvia.

La salida va **siempre** dentro de un bloque de código markdown listo para
copiar y pegar en GitHub (título, secciones, listas y negritas).
