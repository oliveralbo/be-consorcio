---
name: done
description: Criterios de completitud del repo. Cargala ANTES de dar cualquier tarea por terminada y repetila en cada iteración hasta que no queden blockers.
---

# Definition of Done

Cargá esta skill antes de decir "listo".

## El gate no sos vos

```bash
bash scripts/check-dod.sh          # cambios sin commitear
bash scripts/check-dod.sh main     # contra una rama
```

Exit 0 = cerrable. Exit 1 = **no terminada**. El script es la autoridad, no tu
percepción.

Juzga **solo el diff**: la deuda preexistente del repo no bloquea esta tarea.

## Severidad

| Severidad | Qué es | Bloquea |
| --- | --- | --- |
| **blocker** | Rompe una regla dura, rompe el build o viola datos. | **Sí** |
| **should** | Funciona, pero por debajo del estándar. Deuda nueva. | No |
| **nit** | Preferencia personal, sin cambio de comportamiento. | No |

Todo lo que no viole una regla escrita es `should` o `nit`, nunca blocker.

## Blockers mecánicos

Los detecta el script; no los reimplementes a mano:

- Errores de `tsc --noEmit`.
- Errores de ESLint en archivos del diff, incluido `any`.
- Entidad modificada sin migración nueva en `src/migrations/`.
- `.env`, `*.pem` o `*.key` en el diff.
- Archivo `.ts` nuevo o que creció por encima de 400 líneas (excepto
  `src/seeds/`, `src/migrations/` y tests).

## Blockers de juicio

El script no los ve, son tu trabajo:

- **Datos**: migración, seed, delete o backfill que Oli no pidió explícitamente.
- **Entorno**: operar contra la base sin verificar `.env` (ver `entorno.md`).
- **Alcance**: cambios en archivos que la tarea no justifica.
- **Regresión silenciosa**: algo andaba antes, se rompe ahora y compila igual.
- **Lógica en el lugar equivocado**: negocio en el controller o en la entidad en
  vez del service.
- **DTO sin validar** o endpoint sin `@Roles` cuando corresponde.
- **`any` o `as any`** aunque el lint no lo haya visto.

## El loop

1. Corré `bash scripts/check-dod.sh`.
2. Si hay blockers, arreglalos.
3. **Volvé a correr el script.** Sin excepción.
4. Con exit 0, revisá con criterio (skill `review`).
5. Recién ahí, cerrá.

Un fix de tipos suele destapar warnings; un fix de lint suele destapar un error
de `tsc`. Repetir el ciclo no es opcional.

## Estado conocido del repo

No bloquea tareas nuevas, pero no agregues deuda:

- 2 suites de tests: banner y health e2e.
- Listados sin paginación, login sin rate limiting.
- `Dockerfile` en Node 18 y modo desarrollo.
- Detalle y prioridades: `.agents/docs/RISKS.md`.

## Cómo cerrar

Informá en pocas líneas:

- Qué quedó hecho, en una frase.
- Exit code de `bash scripts/check-dod.sh`.
- `should` y `nit` abiertos, si hay.
- Si tocaste `.agents/docs/`, sugerí `upgrade`.

Nunca digas "listo" sin el exit code del script atrás.
