---
name: feature
description: Implementa funcionalidades backend (endpoint, regla de negocio, módulo) siguiendo la arquitectura existente.
---

Seguí las reglas globales de `.agents/rules/`.

1. **Validá la rama** antes de tocar código. Si estás en `main`: `git pull` y
   `git checkout -b feat/slug`. Nunca escribir en `main` (ver `git.md`).
2. **Identificá las áreas afectadas**: módulo, entidad, DB, auth/roles, regla de
   negocio.
3. **Leé solo la documentación necesaria** de `.agents/docs/`: `API.md` para
   rutas, `DOMAIN.md` para reglas, `DB.md` para el modelo, `AUTH.md` para
   permisos.
4. **Buscá una implementación similar**. El módulo `expensa` es la referencia
   para CRUD + lógica de negocio.
5. **Reutilizá** services, DTOs, enums y patrones existentes antes de crear.
6. **No inventes reglas de negocio**: si falta información (quién puede hacer
   qué, qué pasa en un borde), preguntá.
7. **Respetá las capas** (`nest.md`): controller delgado, lógica en el service,
   repositorio inyectado, DTO validado.
8. **Si cambia el esquema**, usá la skill `migration`. No toques `synchronize`.
9. **Si es un módulo nuevo**, usá la skill `modulo`.
10. **Validá**:
    - `npm run build` y `npx eslint "{src,test}/**/*.ts"`.
    - Si la app está corriendo, probá el endpoint con `curl` usando un token
      real. No modifiques datos sin permiso.
    - `bash scripts/check-dod.sh`.
11. Si cambió el proyecto, sugerí `upgrade` para sincronizar docs.

## Criterio de alcance

- Un endpoint, una responsabilidad. No mezclar refactors no pedidos.
- No agregar dependencias nuevas sin justificarlo.
- No cambiar contratos existentes (rutas, campos, roles) sin avisar: puede
  romper el frontend.
