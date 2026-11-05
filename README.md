# be-consorcio

API REST para administración de consorcios. NestJS 11 + TypeORM + PostgreSQL 14.

---

## Requisitos

- Node.js 22 (hay `.nvmrc`: `nvm use` te deja en la versión correcta).
- Docker y Docker Compose (para la base de datos).
- npm.

---

## Entorno

El `.env` es local y está gitignoreado. Copiá el ejemplo:

```bash
cp .env.example .env
```

Los valores por defecto ya apuntan a la DB de Docker (`localhost:5433`). Si
levantás la app en Docker, ese archivo no se usa.

No commitees `.env` ni reutilices los secretos de ejemplo fuera de local.

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

### Diagrama del esquema

`db/schema.dbml` refleja las entidades y se mantiene sincronizado con la skill
`dbml`. Abrilo con la extensión `dbdiagram.dbdiagram-vscode` (VS Code la
recomienda al abrir el proyecto) para ver el ERD. `db/schema.dbdiagram` es el
layout exportado desde dbdiagram.io y se actualiza a mano desde la web.

---

## Gestión de contenedores

### Ver qué hay levantado

```bash
docker ps                                   # solo corriendo
docker ps -a                                # incluye apagados
docker compose ls -a                        # proyectos compose: nombre, estado, archivo
docker port consorcio-db                    # puertos publicados en el host
docker stats --no-stream                    # uso de CPU / RAM por contenedor
docker volume ls                            # volúmenes
```

Con formato de tabla:

```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
```

`docker compose ls -a` es el más útil para ubicarse: muestra el nombre del
proyecto, si está corriendo o no, y de qué `docker-compose.yml` sale.

### Ciclo de vida de la DB

```bash
docker compose up db -d           # levantar
docker compose stop db            # detener (mantiene el contenedor)
docker compose start db           # volver a arrancar
docker compose restart db         # reiniciar
docker compose logs -f db         # logs en vivo
```

### Logs y shell

```bash
docker logs -f consorcio-db
docker exec -it consorcio-db psql -U consorcio_user -d consorcio_db
docker exec consorcio-db psql -U consorcio_user -d consorcio_db -c '\dt'   # listar tablas
```

### Peligro: no ejecutar sin pensar

```bash
docker compose down        # apaga el contenedor, conserva el volumen: los datos quedan
docker compose down -v     # BORRA el volumen be-consorcio_postgres_data => se pierde la DB entera
docker volume rm be-consorcio_postgres_data
```

`down -v` y `volume rm` no tienen vuelta atrás. Para volver a tener datos hay que
aplicar migraciones (`npm run migration:run`) y los seeds.

---

## Portainer — UI web de Docker (opcional)

Setup local, no es requisito para levantar el proyecto.

**http://localhost:9000**

| Dato | Valor |
|---|---|
| Imagen | `portainer/portainer-ce` |
| Contenedor | `portainer` |
| Puerto host | `9000` (los `8000` / `9443` del borde son internos, no publicados) |
| Datos | volumen `portainer_data` en `/data` |
| Acceso a Docker | bind `/var/run/docker.sock` |
| Restart policy | `always` (arranca solo con la máquina) |

Sirve para ver contenedores, logs, consolas, imágenes, volúmenes y redes desde
el browser, sin escribir comandos.

Es un **contenedor suelto**: no está en este `docker-compose.yml`, así que
`docker compose down` no lo apaga ni lo afecta. Tiene `restart=always`, por eso
vuelve solo después de reiniciar la máquina.

Si hay que recrearlo:

```bash
docker run -d \
  --name portainer \
  --restart=always \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

> `-v portainer_data:/data` es lo que conserva la configuración y los usuarios
> de Portainer. Sin ese volumen hay que configurarlo de cero.
> Montar `docker.sock` le da control total sobre el daemon de Docker: es la
> razón por la que Portainer no debe quedar expuesto fuera de localhost.

---

## Comandos

```bash
# Instalar dependencias (usa el lockfile)
npm ci

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

## Flujo de trabajo

- No se commitea en `main`. Creá una rama `feat/`, `fix/`, `chore/`, `docs/` o
  `refactor/` antes de tocar código.
- El hook de pre-commit (`.husky/pre-commit`) corre Prettier y ESLint sobre los
  archivos staged, el gate `scripts/check-dod.sh` y los tests unitarios. Si
  falla, el commit no se crea.
- Bypass excepcional: `git commit --no-verify` (evitalo; el gate deja de correr).
- El mismo gate se puede correr a mano: `bash scripts/check-dod.sh`.
- Todo cambio de esquema va con una migración nueva en `src/migrations/`. No se
  editan migraciones ya aplicadas.
- Detalle de las reglas: `.agents/rules/workflow.md` y `.agents/rules/git.md`.

---

## API

| Recurso | Base URL |
|---|---|
| App local | `http://localhost:3001` |
| App Docker | `http://localhost:3000` |

Endpoint público: `GET /` → `"API CONSORCIO - NESTJS 11"`

Documentación de endpoints en `.agents/docs/API.md`. El índice del harness de
IA está en `AGENTS.md`.

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
└── seeds/                     # Seeders (admin, datos demo)
```
