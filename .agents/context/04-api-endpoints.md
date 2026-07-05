# API Endpoints

## Health Check
| Método | Ruta | Auth | Roles |
|---|---|---|---|
| GET | `/` | No | - |

## Auth
| Método | Ruta | Auth | Roles |
|---|---|---|---|
| POST | `/auth/login` | LocalAuthGuard | - |

**Login Response:**
```json
{
  "access_token": "jwt...",
  "user": { "id", "id_persona", "nombre", "email", "rol" }
}
```

## Personas (`/personas`)
| Método | Ruta | Auth | Roles | DTO |
|---|---|---|---|---|
| POST | `/personas/create` | JWT + Roles | ADMIN | CreatePersonaDto |
| GET | `/personas` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| GET | `/personas/:id` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| PATCH | `/personas/:id` | JWT + Roles | ADMIN | UpdatePersonaDto |
| DELETE | `/personas/:id` | JWT + Roles | ADMIN | - (204) |

## Usuarios (`/usuarios`)
| Método | Ruta | Auth | Roles | DTO |
|---|---|---|---|---|
| POST | `/usuarios/create` | JWT + Roles | ADMIN | CreateUsuarioAppDto |
| GET | `/usuarios` | JWT + Roles | ADMIN | - |
| GET | `/usuarios/:id` | JWT + Roles | ADMIN | - |
| PATCH | `/usuarios/:id` | JWT + Roles | ADMIN | UpdateUsuarioAppDto |
| DELETE | `/usuarios/:id` | JWT + Roles | ADMIN | - (204) |

## Unidades Funcionales (`/unidades-funcionales`)
| Método | Ruta | Auth | Roles | DTO |
|---|---|---|---|---|
| POST | `/unidades-funcionales` | JWT + Roles | ADMIN | CreateUnidadFuncionalDto |
| GET | `/unidades-funcionales` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| GET | `/unidades-funcionales/:id` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| PATCH | `/unidades-funcionales/:id` | JWT + Roles | ADMIN | UpdateUnidadFuncionalDto |
| DELETE | `/unidades-funcionales/:id` | JWT + Roles | ADMIN | - (204) |

## Expensas (`/expensa`)
| Método | Ruta | Auth | Roles | DTO |
|---|---|---|---|---|
| POST | `/expensa/create` | JWT + Roles | ADMIN, TESORERO | CreateExpensaDto |
| POST | `/expensa/generar-mes` | JWT + Roles | ADMIN, TESORERO | GenerarExpensasDto |
| GET | `/expensa` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| GET | `/expensa/:id` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| PATCH | `/expensa/:id` | JWT + Roles | ADMIN, TESORERO | UpdateExpensaDto |
| DELETE | `/expensa/:id` | JWT + Roles | ADMIN, TESORERO | - (204) |

## Gastos (`/gasto`)
| Método | Ruta | Auth | Roles | DTO |
|---|---|---|---|---|
| POST | `/gasto/create` | JWT + Roles | ADMIN, TESORERO | CreateGastoDto |
| POST | `/gasto/generar-mes` | JWT + Roles | ADMIN, TESORERO | GenerarMesGastoDto |
| GET | `/gasto` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| GET | `/gasto/:id` | JWT + Roles | ADMIN, TESORERO, VECINO | - |
| PATCH | `/gasto/:id` | JWT + Roles | ADMIN, TESORERO | UpdateGastoDto |
| DELETE | `/gasto/:id` | JWT + Roles | ADMIN, TESORERO | - (204) |

## Dashboard (`/dashboard`)
| Método | Ruta | Auth | Roles | Descripción |
|---|---|---|---|---|
| GET | `/dashboard/balance` | JWT + Roles | ADMIN, TESORERO, VECINO | Balance (ingresos - egresos) |

## Resumen de Roles por Endpoint
| Rol | Acceso |
|---|---|
| ADMIN | Todo |
| TESORERO | Todo excepto CRUD de personas, usuarios y unidades (solo lectura) |
| VECINO | Solo lectura en personas, unidades, expensas, gastos y dashboard |
