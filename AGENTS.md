# be-consorcio — guía de IA

API REST para administración de consorcios. NestJS 11 + TypeORM 0.3 +
PostgreSQL 14, TypeScript, JWT + Passport, class-validator.

Este archivo es un **índice**. Las reglas de ingeniería viven en
`.agents/rules/`, el conocimiento del negocio en `.agents/docs/` y los flujos de
trabajo en `.agents/skills/`. Leé solo lo que la tarea necesita.

---

## Reglas críticas

### 1. Git — la IA no commitea sola

- **Nunca por iniciativa propia**: `commit`, `push`, `merge`, `rebase`,
  `reset --hard`, `clean`, `checkout --` ni `stash drop`.
- `commit` solo si Oli lo pide explícitamente en el mensaje.
- `push` nunca: lo hace él.
- **Nunca** escribir código en `main`: si estás en `main`, `git pull` y crear
  rama `tipo/slug` antes de tocar nada.
- Podés inspeccionar Git libremente.
- Detalle: `.agents/rules/git.md`.

### 2. Base de datos — migraciones y entorno

- `synchronize: false` siempre. Todo cambio de esquema va con migración en
  `src/migrations/`.
- Antes de migrar, sembrar o borrar: verificar que `DB_HOST`/`DB_PORT` apuntan
  a la base local (`localhost:5433` / `consorcio_db`).
- `npm run db:drop` y `migration:revert` requieren confirmación explícita.
- Detalle: `.agents/rules/typeorm.md` y `.agents/rules/entorno.md`.

### 3. Nada de auto-acciones

- Antes de implementar algo no trivial: plan y esperar aprobación.
- Nunca crear, modificar ni borrar datos de la base por iniciativa propia.
- Las sugerencias son verbales hasta que se pidan.
- Detalle: `.agents/rules/no-auto-actions.md`.

### 4. DoD mecánico

Antes de dar una tarea por cerrada:

```bash
bash scripts/check-dod.sh
```

Exit 0 = sin blockers. Exit 1 = hay que resolver. El script mira el **diff**,
no el repo entero. Detalle: skill `done`.

---

## Stack

| Componente | Tecnología |
| --- | --- |
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5.9 (ES2023, nodenext) |
| ORM | TypeORM 0.3 |
| Base de datos | PostgreSQL 14 |
| Auth | Passport + JWT + bcrypt |
| Validación | class-validator + class-transformer |
| Tests | Jest 30 + Supertest |

Sin frontend en este repo. Sin entorno de producción configurado (ver
`RISKS.md`).

## Comandos

```bash
npm run start:dev        # API en http://localhost:3001 (watch)
npm run build            # compilar a dist/ (necesario antes del CLI de TypeORM)
npm run lint             # ESLint --fix (modifica archivos)
npx eslint "{src,test}/**/*.ts"   # solo verificar
npm test                 # unitarios
npm run test:e2e         # e2e

npm run migration:generate -- src/migrations/Nombre   # después de build
npm run migration:run
npm run migration:revert
npm run seed:admin       # usuario administrador (interactivo)
npm run seed:load        # datos de demo
```

- API dev: `http://localhost:3001`
- PostgreSQL: contenedor `consorcio-db`, `localhost:5433`, base `consorcio_db`
- Trello: <https://trello.com/b/2pwp8i7D/consorcio> (lista `backlog` para
  especificaciones nuevas)

## Estructura

```
src/
├── main.ts, app.module.ts, app.controller.ts
├── config/data-source.ts       # DataSource del CLI
├── migrations/                 # esquema
├── seeds/                      # datos iniciales / demo
└── modules/<modulo>/           # dto/ controller entity module service
test/                           # e2e
scripts/check-dod.sh            # gate de cierre
.agents/                        # rules, docs, skills
```

Patrón completo y convenciones: `.agents/rules/estructura.md`.

## Reglas

| Archivo | Cuándo leerlo |
| --- | --- |
| `workflow.md` | Siempre. Proceso de 12 pasos. |
| `git.md` | Antes de tocar código y antes de cualquier acción de Git. |
| `no-auto-actions.md` | Siempre. Límites de autonomía. |
| `entorno.md` | Antes de cualquier operación contra la base. |
| `estructura.md` | Crear módulos o archivos nuevos. |
| `nest.md` | Escribir controllers, services, DTOs, guards. |
| `typeorm.md` | Entidades, migraciones, queries. |
| `typescript.md` | Tipos, imports, config del compilador. |
| `linter.md` | Antes de cerrar una tarea. |
| `no-magic-values.md` | Lógica de negocio con estados, roles o números. |
| `no-any.md` | Cualquier decisión de tipado. |

## Skills

| Tarea | Skill | Qué hace |
| --- | --- | --- |
| Cerrar una tarea | `done` | Corre el DoD y evalúa lo que el script no ve. |
| Implementar funcionalidad | `feature` | Endpoint, regla de negocio, módulo. |
| Crear un módulo | `modulo` | Scaffolding con el patrón del proyecto. |
| Cambiar el esquema | `migration` | Genera y verifica migraciones TypeORM. |
| Resolver un bug | `bugfix` | Diagnóstico, causa raíz, fix sin regresiones. |
| Revisar cambios | `review` | Findings por severidad sobre el diff. |
| Describir un MR | `mrdescription` | Título y descripción listos para pegar. |
| Actualizar la documentación | `upgrade` | Sincroniza `.agents/docs/` con el código. |
| Especificar antes de codear | `feature-planner` | Spec, alcance y tarjeta en Trello. |

## Documentación

| Archivo | Contenido |
| --- | --- |
| `OVERVIEW.md` | Qué es el sistema, propósito, stack, puertos. |
| `ARCH.md` | Módulos, patrón, flujo de request, dependencias. |
| `DB.md` | Entidades, campos, relaciones, diagrama. |
| `API.md` | Endpoints, auth, roles y DTOs por ruta. |
| `AUTH.md` | Login, JWT, guards, estrategias, decoradores. |
| `DOMAIN.md` | Reglas de negocio: expensas, gastos, balance, seeds. |
| `INFRA.md` | Config de DB, variables, Docker, migraciones, tests. |
| `RISKS.md` | Deuda técnica y riesgos conocidos, con estado. |

## Contexto y suposiciones

- **No hay frontend en este repo**: es solo la API. Los endpoints de vecino se
  consumen desde otro proyecto.
- **No hay entorno productivo configurado** hoy: solo `.env` local y
  `docker-compose.yml` con la DB. La regla de entorno es preventiva.
- Los valores de `.env` no se leen ni se imprimen sin necesidad. Está
  gitignoreado.
