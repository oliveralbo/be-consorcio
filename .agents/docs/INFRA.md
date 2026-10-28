# Infraestructura

## Base de datos

`src/config/data-source.ts` (usado por la app y por el CLI):

```ts
{
  type: 'postgres',
  host, port, username, password, database,   // desde .env
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
}
```

- Valida que estén `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD` y
  `DB_DATABASE`.
- `JWT_SECRET` no está en esa lista, pero la app lo exige vía
  `ConfigService.getOrThrow()`: sin él, el arranque falla.

## Variables de entorno

El archivo `.env` está gitignoreado. `.env.example` documenta las necesarias.

| Variable | Para qué |
| --- | --- |
| `DB_HOST` | Host de PostgreSQL (`localhost` en dev). |
| `DB_PORT` | Puerto (`5433` en dev, `5432` dentro de Docker). |
| `DB_USERNAME` / `DB_PASSWORD` | Credenciales de la base. |
| `DB_DATABASE` | Nombre de la base (`consorcio_db`). |
| `PORT` | Puerto de la API (default `3001`). |
| `JWT_SECRET` | Firma de los JWT. Obligatoria. |
| `TRELLO_API_KEY` / `TRELLO_TOKEN` | Solo para la skill `feature-planner`. No las usa la app. |
| `TRELLO_BOARD_ID` / `TRELLO_LIST_ID` | Board `consorcio` y lista `backlog`. |

Los valores locales no se copian a documentación ni se imprimen. Los defaults
de `.env.example` y `docker-compose.yml` son débiles: ver `RISKS.md`.

## Docker

`docker-compose.yml` define dos servicios:

| Servicio | Imagen | Puerto | Notas |
| --- | --- | --- | --- |
| `db` | `postgres:14` | `5433:5432` | Contenedor `consorcio-db`, volumen `postgres_data`. |
| `app` | build local | `3000:3000` | Contenedor `consorcio-app`, depende de `db`. |

- El `Dockerfile` usa `node:18-alpine` y corre `npm run start:dev` (modo
  desarrollo, no build de producción). Deuda: ver `RISKS.md`.
- En Docker, `DB_HOST=db` y `DB_PORT=5432`.
- La app en Docker no tiene healthcheck.

## Migraciones

Están en `src/migrations/`, todas aplicadas. Orden cronológico:

| # | Migración | Cambio |
| --- | --- | --- |
| 1 | `InitialSchema` | Tablas iniciales. |
| 2 | `RemoveEmailAndTelefonoFromPersona` | Quita email y teléfono de persona. |
| 3 | `AddPisoRemoveCoeficienteUnidadFuncional` | Agrega piso, quita coeficiente. |
| 4 | `AddTelefonoToPersonaAndPopulate` | Re-agrega teléfono con datos. |
| 5 | `AddDescripcionToGastoAndExpensa` | Agrega descripción. |
| 6 | `RemoveCierreMensualTable` | Elimina `cierre_mensual`. |
| 7 | `MakePersonaMandatoryInUsuario` | `id_persona` NOT NULL + CASCADE. |
| 8 | `UpdateExpensaAndUnidadFuncional` | Pagos: `monto_pagado`, `estado`, vencimiento. |
| 9 | `AddTipoToGasto` | Agrega `tipo` (mensual/extraordinario). |

El CLI compila a `dist/`, así que **siempre** `npm run build` antes de
`migration:generate` o `migration:run`. Procedimiento completo en
`.agents/rules/typeorm.md`.

## Comandos

```bash
npm run start:dev          # desarrollo con watch (3001)
npm run build              # compila a dist/
npm run lint               # ESLint --fix
npx eslint "{src,test}/**/*.ts"   # solo verificar

npm test                   # unitarios (Jest)
npm run test:e2e           # e2e (Supertest)

npm run migration:generate -- src/migrations/Nombre
npm run migration:run
npm run migration:revert
npm run db:drop            # borra todas las tablas (requiere confirmación)

npm run seed:admin
npm run seed:load
```

## Tests

- 2 suites: `src/app.controller.spec.ts` (unitario del banner) y
  `test/app.e2e-spec.ts` (GET `/` con `app.close()` en `afterAll`).
- No hay tests de auth, expensas, gastos ni dashboard. Ver `RISKS.md`.

## Dependencias y seguridad

- Nest 11.2.x, TypeORM 0.3.27, Jest 30, TypeScript 5.9. Resueltas por
  `package-lock.json`.
- `overrides.multer: 2.5.0` corrige la vulnerabilidad de `@nestjs/platform-express`.
- `npm audit` da 0 vulnerabilidades al momento de documentar.
- Nest 12 requiere Node 24.15+; el proyecto está en Node 22.17. No actualizar
  sin plan (ver `RISKS.md`).

## Trello

- Board: <https://trello.com/b/2pwp8i7D/consorcio>
- Listas: `backlog`, `to do`, `in progress`, `done`.
- Las credenciales viven en `.env` (gitignoreado) y las usa la skill
  `feature-planner`.
