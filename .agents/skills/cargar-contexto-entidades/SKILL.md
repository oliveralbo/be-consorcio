---
name: cargar-contexto-entidades
description: Carga los contextos de entidades, base de datos y esquema del proyecto be-consorcio. Ideal para tareas de modelo de datos y migraciones.
---

## Qué hace
Carga los archivos de contexto enfocados en el modelo de datos del proyecto be-consorcio.

## Cuándo usarlo
Usa este skill cuando:
- Necesites crear o modificar entidades TypeORM
- Trabajes con migraciones
- Modifiques DTOs o validaciones
- Necesites entender relaciones entre tablas
- Configures aspectos de base de datos

## Archivos que carga
Lee los siguientes archivos en orden:
1. `.opencode/context/03-entities.md` — Entidades y relaciones
2. `.opencode/context/07-database-and-infra.md` — Base de datos e infraestructura
