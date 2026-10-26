# Database & Infrastructure

## Configuración de Base de Datos

**Archivo:** `src/config/data-source.ts`

```typescript
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!, 10),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  entities: [__dirname + '/../modules/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  synchronize: false,
};
```

**Nota:** `synchronize: false` — todos los cambios de esquema se hacen mediante migraciones.

## Variables de Entorno (`.env`)

| Variable | Dev | Docker | Descripción |
|---|---|---|---|
| DB_HOST | localhost | db | Host PostgreSQL |
| DB_PORT | 5433 | 5432 | Puerto PostgreSQL |
| DB_USERNAME | consorcio_user | consorcio_user | Usuario DB |
| DB_PASSWORD | 1234 | 1234 | Password DB |
| DB_DATABASE | consorcio_db | consorcio_db | Nombre DB |
| JWT_SECRET | SECRET_KEY_PARA_PRODUCCION | SECRET_KEY_PARA_PRODUCCION | Secreto JWT |
| PORT | 3001 | 3000 | Puerto API |

## Docker

### docker-compose.yml
```yaml
services:
  db:
    image: postgres:14
    ports: ["5433:5432"]
    volumes: [postgres_data]
    environment: [POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB]
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
    environment: [DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, JWT_SECRET]
```

### Dockerfile
- Base: `node:18-alpine`
- Expone puerto 3000
- Comando: `npm run start:dev`
- Workdir: `/app`

## Comandos Útiles

```bash
# Desarrollo
npm run start:dev          # Iniciar con watch mode

# Base de datos
npm run migration:run      # Ejecutar migraciones pendientes
npm run migration:generate -- src/migrations/NombreMigration  # Generar migración
npm run migration:revert   # Revertir última migración
npm run db:drop            # Dropear todas las tablas

# Seeders
npm run seed:admin         # Crear usuario administrador

# Testing
npm run test               # Test unitarios
npm run test:e2e           # Test end-to-end

# Lint
npm run lint               # ESLint + Prettier fix
```

## Migraciones (orden cronológico)

| # | Migración | Cambios |
|---|---|---|
| 1 | InitialSchema | Creación de tablas iniciales |
| 2 | RemoveEmailAndTelefonoFromPersona | Drop email y telefono de persona |
| 3 | AddPisoRemoveCoeficienteUnidadFuncional | Add piso, remove coeficiente |
| 4 | AddTelefonoToPersonaAndPopulate | Re-add telefono con datos |
| 5 | AddDescripcionToGastoAndExpensa | Add columna descripcion |
| 6 | RemoveCierreMensualTable | Drop tabla cierre_mensual |
| 7 | MakePersonaMandatoryInUsuario | id_persona NOT NULL + CASCADE |
| 8 | UpdateExpensaAndUnidadFuncional | Sistema de pagos: monto_pagado, estado, fecha_vencimiento |
| 9 | AddTipoToGasto | Add columna tipo (mensual/extraordinario) |
