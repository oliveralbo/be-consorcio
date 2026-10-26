---
name: upgrade
description: Mantiene actualizada la documentación del proyecto en .agents/docs/ después de un cambio.
---

Seguí las reglas globales de `.agents/rules/`.

Antes de editar, validá la rama: nunca escribir en `main`. Si estás en `main`,
`git pull` y `git checkout -b docs/slug`.

Detectá qué cambió y actualizá **solo** los docs que correspondan:

| Cambio detectado | Archivo |
| --- | --- |
| Alcance, propósito, stack, puertos | `.agents/docs/OVERVIEW.md` |
| Módulos, capas, dependencias, flujo | `.agents/docs/ARCH.md` |
| Entidades, campos, relaciones, enums | `.agents/docs/DB.md` |
| Endpoints, DTOs, roles, respuestas | `.agents/docs/API.md` |
| Login, JWT, guards, estrategias | `.agents/docs/AUTH.md` |
| Reglas de negocio, generación, balance, seeds | `.agents/docs/DOMAIN.md` |
| Variables de entorno, Docker, migraciones, comandos, tests | `.agents/docs/INFRA.md` |
| Deuda técnica, riesgos, mitigaciones | `.agents/docs/RISKS.md` |

## Reglas

- No modificar código de la aplicación. Solo documentación.
- No duplicar información: cada dato vive en un solo doc.
- No inventar: reflejar solo lo que existe en el código.
- Si un área no cambió, no tocarla.
- Si agregaste una migración, actualizá la tabla de `INFRA.md`.
- Si agregaste un endpoint, actualizá la tabla de `API.md` con roles y DTO.
- Si cambió una regla de negocio, actualizá `DOMAIN.md` y verificá que no
  contradiga `RISKS.md`.
- Al terminar, corré `bash scripts/check-dod.sh` (los docs no rompen el gate,
  pero confirma que no tocaste código sin querer).
