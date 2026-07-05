# be-consorcio

API REST para administración de consorcios. NestJS 11 + TypeORM + PostgreSQL 14.

---

## Requisitos

- Node.js 18+
- Docker y Docker Compose (para la base de datos)
- npm

---

## Entorno

Crear archivo `.env` en la raíz (ya incluido en el repo):

```
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=consorcio_user
DB_PASSWORD=1234
DB_DATABASE=consorcio_db
JWT_SECRET=SECRET_KEY_PARA_PRODUCCION
```

---

## Base de datos con Docker

La DB corre en un contenedor PostgreSQL 14. El `docker-compose.yml` expone:

```yaml
ports:
  - "5433:5432"
```

**Significado:** el puerto `5433` de tu máquina local (host) se redirige al puerto `5432` del contenedor.  
`5433` es el puerto por el que accedés **desde tu PC** (localhost:5433).  
`5432` es el puerto **interno del contenedor** al que se conecta la app cuando corre también en Docker.

### Levantar solo la DB (recomendado para desarrollo local)

```bash
docker compose up db -d
```

La app la corrés localmente con `npm run start:dev`.  
En `.env` usás `DB_HOST=localhost` y `DB_PORT=5433`.

La app se levanta en **`http://localhost:3001`**.

### Conectarse desde DBeaver / cualquier cliente SQL

| Campo | Valor |
|---|---|
| Host | `localhost` |
| Puerto | `5433` |
| Database | `consorcio_db` |
| Usuario | `consorcio_user` |
| Password | `1234` |

### Levantar todo (app + db)

```bash
docker compose up -d
```

La app queda en **`http://localhost:3000`** (puerto interno del contenedor).  
El `.env` **no se usa** en este caso; Docker pasa sus propias variables al contenedor app con `DB_HOST=db`.

---

## Comandos

```bash
# Instalar dependencias
npm install

# Desarrollo (DB en Docker, app local)
npm run start:dev

# Migraciones (después de levantar la DB)
npm run migration:run

# Generar migración
npm run migration:generate -- src/migrations/NombreMigration

# Revertir migración
npm run migration:revert

# Seed: crear usuario administrador
npm run seed:admin

# Tests
npm run test
npm run test:e2e

# Lint
npm run lint
```

---

## API

| Recurso | Base URL |
|---|---|
| App local | `http://localhost:3001` |
| App Docker | `http://localhost:3000` |

Endpoint público: `GET /` → `"API CONSORCIO - NESTJS 11"`

Documentación de endpoints en `.agents/context/04-api-endpoints.md`.

---

## Estructura del proyecto

```
src/
├── main.ts                    # Bootstrap, CORS, ValidationPipe
├── config/data-source.ts      # TypeORM DataSource
├── modules/
│   ├── auth/                  # JWT, Passport, guards, decorators
│   ├── persona/               # CRUD personas
│   ├── usuario/               # CRUD usuarios del sistema
│   ├── unidad-funcional/      # CRUD unidades funcionales
│   ├── expensa/               # Expensas + generación mensual
│   ├── gasto/                 # Gastos + generación mensual
│   └── dashboard/             # Balance financiero
├── migrations/                # Migraciones TypeORM
└── seeds/                     # Seeders (admin-user)
```
