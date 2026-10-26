# Entities

## Persona (`persona`)
Representa una persona física (propietario, inquilino).

| Campo | Tipo | Constraints |
|---|---|---|
| id_persona | uuid (PK) | auto-generado |
| nombre | varchar | NOT NULL |
| apellido | varchar | NOT NULL |
| dni | varchar | NOT NULL, UNIQUE |
| telefono | varchar | NOT NULL |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| deleted_at | timestamp | soft delete |

**Relaciones:**
- 1:1 con `UsuarioApp` (id_persona -> usuario_app.id_persona, CASCADE)
- 1:N con `UnidadFuncional` como propietario (id_propietario)
- 1:N con `UnidadFuncional` como inquilino (id_inquilino, nullable)

---

## UsuarioApp (`usuario_app`)
Usuario del sistema con acceso a la plataforma.

| Campo | Tipo | Constraints |
|---|---|---|
| id_usuario | uuid (PK) | auto-generado |
| email_login | varchar | NOT NULL, UNIQUE |
| password | varchar | NOT NULL (bcrypt, 10 rounds) |
| rol | enum (RolUsuario) | DEFAULT 'vecino' |
| id_persona | uuid (FK) | NOT NULL, UNIQUE, CASCADE |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| deleted_at | timestamp | soft delete |

**RolUsuario:** `tesorero` | `vecino` | `administrador`

**Relaciones:**
- 1:1 con `Persona` (JoinColumn id_persona)
- 1:N con `Gasto` (gasto.registrado_por -> id_usuario)

---

## UnidadFuncional (`unidad_funcional`)
Departamento, local o unidad dentro del consorcio.

| Campo | Tipo | Constraints |
|---|---|---|
| id_unidad | uuid (PK) | auto-generado |
| numero | varchar | NOT NULL |
| superficie | decimal(10,2) | nullable |
| ambientes | integer | NOT NULL |
| piso | varchar | DEFAULT 'PB' |
| monto_base | decimal(10,2) | DEFAULT 0 |
| id_propietario | uuid (FK) | NOT NULL -> persona |
| id_inquilino | uuid (FK) | nullable -> persona |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| deleted_at | timestamp | soft delete |

**Relaciones:**
- N:1 con `Persona` como propietario
- N:1 con `Persona` como inquilino (nullable)
- 1:N con `Expensa` (expensa.id_unidad -> id_unidad)

---

## Expensa (`expensa`)
Expensa mensual generada para una unidad funcional.

| Campo | Tipo | Constraints |
|---|---|---|
| id_expensa | uuid (PK) | auto-generado |
| id_unidad | uuid (FK) | -> unidad_funcional |
| mes | integer | NOT NULL (1-12) |
| anio | integer | NOT NULL |
| tipo | enum (TipoExpensa) | DEFAULT 'ordinaria' |
| descripcion | text | nullable |
| monto | decimal(10,2) | NOT NULL |
| monto_pagado | decimal(10,2) | DEFAULT 0 |
| estado | enum (EstadoExpensa) | DEFAULT 'pendiente' |
| fecha_vencimiento | date | nullable |
| fecha_pago | date | nullable |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| deleted_at | timestamp | soft delete |

**TipoExpensa:** `ordinaria` | `extraordinaria`
**EstadoExpensa:** `pendiente` | `parcial` | `pagado`

**Relaciones:**
- N:1 con `UnidadFuncional`

---

## Gasto (`gasto`)
Gasto registrado del consorcio (servicios, reparaciones, etc.).

| Campo | Tipo | Constraints |
|---|---|---|
| id_gasto | uuid (PK) | auto-generado |
| concepto | varchar | NOT NULL |
| descripcion | text | nullable |
| monto | decimal(10,2) | NOT NULL |
| fecha | date | NOT NULL |
| medio | varchar | NOT NULL |
| registrado_por | uuid (FK) | -> usuario_app |
| tipo | enum (TipoGasto) | DEFAULT 'mensual' |
| created_at | timestamp | DEFAULT now() |
| updated_at | timestamp | DEFAULT now() |
| deleted_at | timestamp | soft delete |

**TipoGasto:** `mensual` | `extraordinario`

**Relaciones:**
- N:1 con `UsuarioApp`

---

## Diagrama de Relaciones

```
Persona (1) ── (1) UsuarioApp        [id_persona FK, CASCADE]
Persona (1) ── (N) UnidadFuncional   [como propietario]
Persona (1) ── (N) UnidadFuncional   [como inquilino, nullable]
UnidadFuncional (1) ── (N) Expensa   [id_unidad FK]
UsuarioApp (1) ── (N) Gasto          [registrado_por FK]
```

Todas las tablas implementan **soft delete** (columna `deleted_at`).
