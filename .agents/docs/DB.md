# Base de datos

PostgreSQL 14. Esquema manejado **solo** por migraciones TypeORM
(`synchronize: false`). El historial de migraciones está en `INFRA.md`.

Todas las tablas usan **soft delete** (`deleted_at` con `@DeleteDateColumn()`).
Las queries normales excluyen las filas borradas.

## Persona (`persona`)

Persona física: propietario o inquilino.

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id_persona` | uuid | PK, autogenerado |
| `nombre` | varchar | NOT NULL |
| `apellido` | varchar | NOT NULL |
| `dni` | varchar | NOT NULL, UNIQUE |
| `telefono` | varchar | NOT NULL |
| `created_at` | timestamp | default now() |
| `updated_at` | timestamp | default now() |
| `deleted_at` | timestamp | soft delete |

## UsuarioApp (`usuario_app`)

Usuario con acceso al sistema.

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id_usuario` | uuid | PK, autogenerado |
| `email_login` | varchar | NOT NULL, UNIQUE |
| `password` | varchar | NOT NULL, bcrypt (10 rounds, en `@BeforeInsert`) |
| `rol` | enum `RolUsuario` | default `vecino` |
| `id_persona` | uuid | FK → `persona`, NOT NULL, UNIQUE, ON DELETE CASCADE |
| `created_at` / `updated_at` | timestamp | default now() |
| `deleted_at` | timestamp | soft delete |

`RolUsuario`: `tesorero` | `vecino` | `administrador`.

Relación 1:1 con `Persona`.

## UnidadFuncional (`unidad_funcional`)

Departamento, local o unidad del consorcio.

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id_unidad` | uuid | PK, autogenerado |
| `numero` | varchar | NOT NULL |
| `superficie` | decimal(10,2) | nullable |
| `ambientes` | integer | NOT NULL |
| `piso` | varchar | default `'PB'` |
| `monto_base` | decimal(10,2) | default `0` |
| `id_propietario` | uuid | FK → `persona`, NOT NULL |
| `id_inquilino` | uuid | FK → `persona`, nullable |
| `created_at` / `updated_at` | timestamp | default now() |
| `deleted_at` | timestamp | soft delete |

Relaciones N:1 con `Persona` como propietario y como inquilino.

## Expensa (`expensa`)

Expensa mensual de una unidad funcional.

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id_expensa` | uuid | PK, autogenerado |
| `id_unidad` | uuid | FK → `unidad_funcional`, NOT NULL |
| `mes` | integer | NOT NULL (1–12) |
| `anio` | integer | NOT NULL |
| `tipo` | enum `TipoExpensa` | default `ordinaria` |
| `descripcion` | text | nullable |
| `monto` | decimal(10,2) | NOT NULL |
| `monto_pagado` | decimal(10,2) | default `0` |
| `estado` | enum `EstadoExpensa` | default `pendiente` |
| `fecha_vencimiento` | date | nullable |
| `fecha_pago` | date | nullable |
| `created_at` / `updated_at` | timestamp | default now() |
| `deleted_at` | timestamp | soft delete |

`TipoExpensa`: `ordinaria` | `extraordinaria`.
`EstadoExpensa`: `pendiente` | `parcial` | `pagado`.

## Gasto (`gasto`)

Gasto del consorcio (servicios, reparaciones, etc.).

| Campo | Tipo | Restricciones |
| --- | --- | --- |
| `id_gasto` | uuid | PK, autogenerado |
| `concepto` | varchar | NOT NULL |
| `descripcion` | text | nullable |
| `monto` | decimal(10,2) | NOT NULL |
| `fecha` | date | NOT NULL |
| `medio` | varchar | NOT NULL |
| `registrado_por` | uuid | FK → `usuario_app`, NOT NULL |
| `tipo` | enum `TipoGasto` | default `mensual` |
| `created_at` / `updated_at` | timestamp | default now() |
| `deleted_at` | timestamp | soft delete |

`TipoGasto`: `mensual` | `extraordinario`.

## Diagrama

```
Persona (1) ── (1) UsuarioApp        [id_persona FK, CASCADE]
Persona (1) ── (N) UnidadFuncional   [propietario]
Persona (1) ── (N) UnidadFuncional   [inquilino, nullable]
UnidadFuncional (1) ── (N) Expensa   [id_unidad FK]
UsuarioApp (1) ── (N) Gasto          [registrado_por FK]
```

## Tipos en runtime

- Las columnas `decimal` vuelven como **string** desde node-postgres, aunque las
  entidades las tipen como `number`.
- Las columnas `date` vuelven como string `YYYY-MM-DD`.
- Implicancias y deuda: `.agents/rules/typeorm.md` y `RISKS.md`.
