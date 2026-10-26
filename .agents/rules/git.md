---
trigger: always_on
---

# Git

## La IA no commitea sola

- **Nunca por iniciativa propia**: `git commit`, `push`, `merge`, `rebase`, `reset --hard`, `clean`, `checkout --`, `stash drop`.
- **Commit**: solo si Oli lo pide explícitamente en el mensaje. Si no lo pidió, se avisa y el comando exacto queda para que lo corra él.
- **Push**: nunca. Lo hace Oli.
- Tampoco se crean ni aprueban PRs.

## Nunca escribir en `main`

- Antes de tocar código: `git branch --show-current`.
- Si es `main`: `git pull` y después `git checkout -b <tipo/slug>`.
- Los cambios sin commitear se arrastran con el checkout, no se pierden.
- Ramas: Conventional Commits → `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`.
- Si ya estás en otra rama, seguir ahí.

## Lo que sí se puede

Inspeccionar libremente: `status`, `diff`, `diff --staged`, `log`, `show`, `branch`, `merge-base`, `diff <rama>..<rama>`.

## Cuidado con los archivos

- No descartar cambios ajenos. Si hay trabajo sin commitear que no es de esta tarea, se avisa antes de tocarlo.
- No commitear `.env`, credenciales ni tokens.
