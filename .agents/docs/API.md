# API

Base: `http://localhost:3001` en desarrollo. Todas las respuestas son JSON.

Roles: `ADMIN` = `administrador`, `TESORERO` = `tesorero`, `VECINO` = `vecino`.
Todas las rutas protegidas esperan `Authorization: Bearer <token>`. Sin token:
401. Con token y rol insuficiente: 403.

## Health

| Método | Ruta | Auth |
| --- | --- | --- |
| GET | `/` | No |

Devuelve `API CONSORCIO - NESTJS 11`.

## Auth

| Método | Ruta | Guard | Body |
| --- | --- | --- | --- |
| POST | `/auth/login` | `LocalAuthGuard` | `{ email, contrasenia }` |

Respuesta:

```json
{
  "access_token": "jwt...",
  "user": {
    "id": "uuid",
    "id_persona": "uuid",
    "nombre": "Nombre Apellido",
    "email": "usuario@ejemplo.com",
    "rol": "vecino"
  }
}
```

## Personas (`/personas`)

| Método | Ruta | Roles | DTO |
| --- | --- | --- | --- |
| POST | `/personas/create` | ADMIN | `CreatePersonaDto` |
| GET | `/personas` | ADMIN, TESORERO, VECINO | — |
| GET | `/personas/:id` | ADMIN, TESORERO, VECINO | — |
| PATCH | `/personas/:id` | ADMIN | `UpdatePersonaDto` |
| DELETE | `/personas/:id` | ADMIN | — (204) |

## Usuarios (`/usuarios`)

| Método | Ruta | Roles | DTO |
| --- | --- | --- | --- |
| POST | `/usuarios/create` | ADMIN | `CreateUsuarioAppDto` |
| GET | `/usuarios` | ADMIN | — |
| GET | `/usuarios/:id` | ADMIN | — |
| PATCH | `/usuarios/:id` | ADMIN | `UpdateUsuarioAppDto` |
| DELETE | `/usuarios/:id` | ADMIN | — (204) |

## Unidades funcionales (`/unidades-funcionales`)

| Método | Ruta | Roles | DTO |
| --- | --- | --- | --- |
| POST | `/unidades-funcionales` | ADMIN | `CreateUnidadFuncionalDto` |
| GET | `/unidades-funcionales` | ADMIN, TESORERO, VECINO | — |
| GET | `/unidades-funcionales/:id` | ADMIN, TESORERO, VECINO | — |
| PATCH | `/unidades-funcionales/:id` | ADMIN | `UpdateUnidadFuncionalDto` |
| DELETE | `/unidades-funcionales/:id` | ADMIN | — (204) |

## Expensas (`/expensa`)

| Método | Ruta | Roles | DTO |
| --- | --- | --- | --- |
| POST | `/expensa/create` | ADMIN, TESORERO | `CreateExpensaDto` |
| POST | `/expensa/generar-mes` | ADMIN, TESORERO | `GenerarExpensasDto` |
| GET | `/expensa` | ADMIN, TESORERO, VECINO | — |
| GET | `/expensa/:id` | ADMIN, TESORERO, VECINO | — |
| PATCH | `/expensa/:id` | ADMIN, TESORERO | `UpdateExpensaDto` |
| DELETE | `/expensa/:id` | ADMIN, TESORERO | — (204) |

## Gastos (`/gasto`)

| Método | Ruta | Roles | DTO |
| --- | --- | --- | --- |
| POST | `/gasto/create` | ADMIN, TESORERO | `CreateGastoDto` |
| POST | `/gasto/generar-mes` | ADMIN, TESORERO | `GenerarMesGastoDto` |
| GET | `/gasto` | ADMIN, TESORERO, VECINO | — |
| GET | `/gasto/:id` | ADMIN, TESORERO, VECINO | — |
| PATCH | `/gasto/:id` | ADMIN, TESORERO | `UpdateGastoDto` |
| DELETE | `/gasto/:id` | ADMIN, TESORERO | — (204) |

## Dashboard (`/dashboard`)

| Método | Ruta | Roles | Descripción |
| --- | --- | --- | --- |
| GET | `/dashboard/balance` | ADMIN, TESORERO, VECINO | Ingresos, egresos y balance |

## Matriz de acceso

| Rol | Permisos |
| --- | --- |
| ADMIN | Todo |
| TESORERO | Lectura general; crear/editar/borrar expensas y gastos |
| VECINO | Solo lectura en personas, unidades, expensas, gastos y dashboard |

## Notas

- Los listados devuelven **todas** las filas: no hay paginación (ver
  `RISKS.md`).
- Los DELETE son soft delete: la fila queda con `deleted_at`.
- El detalle de reglas por endpoint está en `DOMAIN.md` y `AUTH.md`.
