---
trigger: always_on
---

# Entorno y base de datos

## Regla de oro

> **DEV primero. Producción nunca por defecto.** Si no podés probar a qué base apuntás, frená y preguntá.

## Antes de cualquier operación que toque la base

Aplica a: migraciones, seeds, `db:drop`, scripts de mantenimiento, SQL manual, tests que escriban datos.

1. Leer `.env` y verificar `DB_HOST`, `DB_PORT`, `DB_DATABASE`.
2. Confirmar que apunta a la base local: `localhost:5433` / `consorcio_db` (contenedor `consorcio-db`).
3. Si `DB_HOST` no es local, o hay dudas: **detenerse y preguntar**.

```bash
docker ps --filter name=consorcio-db     # ¿está arriba?
```

## Estado actual

Hoy este repo **solo tiene configuración local**. No hay `.env` de producción ni variables de producción en `docker-compose.yml`. Esta regla es preventiva: el día que aparezca un entorno real, se aplica igual.

## Lo que no se hace

- Cambiar `.env` para apuntar a otra base sin pedido explícito.
- Correr `npm run db:drop` (borra todas las tablas) sin confirmación.
- Ejecutar migraciones sobre una base que no sea la de desarrollo.
