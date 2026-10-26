# AI Workspace

Este directorio centraliza el conocimiento del proyecto para que cualquier
herramienta de IA (OpenCode, Claude Code, Codex, Cursor, Copilot, etc.) trabaje
con la misma base.

## Principios

- **Simplicidad**: cada archivo tiene una única responsabilidad.
- **Bajo acoplamiento**: rules, docs y skills son independientes entre sí.
- **Reutilización**: las rules son convenciones de ingeniería; el conocimiento
  del negocio vive en docs.
- **Evolución incremental**: se documenta cuando el proyecto crece, no antes.
- **Sin duplicación**: cada conocimiento vive en un solo archivo.

## Organización

| Carpeta | Responsabilidad |
| --- | --- |
| `rules/` | Convenciones permanentes de ingeniería. No contienen datos del negocio. |
| `docs/` | Conocimiento del proyecto: arquitectura, DB, API, auth, dominio, infra, riesgos. |
| `skills/` | Flujos de trabajo reutilizables para tareas específicas. |

## Cómo navegar

1. Leer `AGENTS.md` en la raíz: es el índice y tiene las reglas críticas.
2. Seguir siempre `.agents/rules/workflow.md`.
3. Abrir de `.agents/docs/` solo lo que la tarea necesita.
4. Usar la skill que corresponda al tipo de tarea.

## Cómo agregar

- **Rule nueva**: convención estable, sin datos del negocio. Un tema por archivo.
- **Doc nuevo**: conocimiento que se consulta, no proceso. Si es un flujo, va a
  `skills/`.
- **Skill nueva**: tiene frontmatter `name` y `description`; la descripción
  decide cuándo se activa.
- Si algo se desactualiza, se corrige en el mismo cambio que lo rompió o se
  corre la skill `upgrade`.
