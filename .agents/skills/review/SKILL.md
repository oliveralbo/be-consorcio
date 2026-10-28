---
name: review
description: Revisa código contra las reglas del proyecto y reporta hallazgos por severidad.
---

## Antes de revisar

Corré el gate mecánico. No tiene sentido leer a ojo código que ya tiene errores
de tipos o de lint:

```bash
bash scripts/check-dod.sh
```

Si hay blockers, se arreglan primero. Después seguí con el criterio, que es lo
que el script **no** puede ver.

## Severidad

Rúbrica completa en la skill `done`:

- **blocker** — rompe una regla dura, viola datos o rompe el build.
- **should** — funciona, pero por debajo del estándar. Deuda nueva.
- **nit** — preferencia, sin cambio de comportamiento.

Todo lo que no viole una regla escrita es `should` o `nit`, nunca blocker.

## Checklist

### Arquitectura y capas

- Lógica de negocio en el service, no en el controller ni en la entidad.
- Repositorios inyectados; sin `getRepository()` global.
- Sin dependencias circulares ni `forwardRef`.
- Módulo registrado y con los imports que necesita.

### NestJS

- DTO con `class-validator`; Update con `PartialType`.
- `ParseUUIDPipe` en ids de ruta.
- Excepciones de Nest en vez de `return null` o `throw new Error`.
- Guards y `@Roles` en cada endpoint que lo requiera, con enums.
- `ConfigService` en vez de `process.env` (salvo `main.ts` y `data-source.ts`).

### TypeORM

- Entidad modificada ⇒ migración en `src/migrations/`.
- Sin `synchronize: true`.
- Relaciones explícitas y cargadas cuando se usan.
- Soft delete respetado; `withDeleted` solo si es intencional.
- Escrituras múltiples en transacción.
- Cuidado con `decimal` (string en runtime) y `date` (string).

### TypeScript

- Sin `any` ni `as any`.
- Sin `as` innecesario ni `!` sin invariante.
- Tipos de retorno explícitos en métodos públicos.

### Dominio y datos

- Reglas de `DOMAIN.md` respetadas.
- Roles correctos según `API.md`.
- Sin cambios de contrato silenciosos (rutas, campos, respuestas).
- Sin efectos secundarios no pedidos (seeds, migraciones, borrados).

### Consistencia

- Reutilización de enums, DTOs y patrones existentes.
- Imports muertos, código comentado, `console.log` olvidado.
- Nombres coherentes con el resto del módulo.

## Formato de respuesta

Agrupá por severidad, de más grave a menos:

```
🚫 BLOCKER  [categoría] Descripción breve
   Archivo: ruta:línea
   Por qué: explicación
   Arreglo: cómo se corrige

⚠️ should   [categoría] Descripción breve
   Archivo: ruta:línea

· nit       [categoría] Descripción breve
   Archivo: ruta:línea
```

Resumen final:

```
DoD: exit N (M blockers) — <cerrable | no cerrable>
```

Si no hay nada que objetar:

```
✅ Sin hallazgos.

DoD: exit 0 (0 blockers) — cerrable
```
