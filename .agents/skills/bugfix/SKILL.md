---
name: bugfix
description: Resuelve bugs de forma estructurada, sin introducir regresiones.
---

Si no hay descripción del problema, pedila antes de empezar.

Seguí las reglas globales de `.agents/rules/`.

1. **Validá la rama**: si estás en `main`, `git pull` y
   `git checkout -b fix/slug`. Nunca escribir en `main`.
2. **Reproducí el bug** antes de tocar código. Si no se puede reproducir,
   decilo y pedí más contexto.
3. **Identificá el área**: controller, service, entidad, migración, auth, DTO.
4. **Leé solo la documentación necesaria** de `.agents/docs/`.
5. **Buscá la causa raíz**, no el síntoma. Un `try/catch` que oculta el error no
   es un fix.
6. **Revisá implementaciones similares** para no romper consistencia.
7. **Proponé el fix mínimo**. Sin refactors oportunistas ni cambios de alcance.
8. **Si el fix toca el esquema**, usá `migration`.
9. **Agregá o actualizá un test** si el área ya tiene tests o si el bug es
   reproducible de forma automática.
10. **Validá**:
    - `npm run build`
    - `npx eslint "{src,test}/**/*.ts"`
    - `npm test` y `npm run test:e2e`
    - `bash scripts/check-dod.sh`

## Qué reportar

- Causa raíz en una frase.
- Qué se cambió y por qué.
- Cómo se verificó.
- Riesgo de regresión, si queda alguno.
