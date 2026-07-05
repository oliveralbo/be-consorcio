---
name: cargar-contexto-completo
description: Carga todos los archivos de contexto del proyecto be-consorcio para entender su arquitectura completa, entidades, API y lógica de negocio.
---

## Qué hace
Carga y combina todos los archivos de contexto del proyecto desde `.opencode/context/` para dar al agente una comprensión completa del proyecto.

## Cuándo usarlo
Usa este skill cuando:
- Inicies una nueva sesión en el proyecto
- Necesites entender la arquitectura general
- Te asignen una tarea que involucre múltiples módulos
- No estés seguro de cómo está estructurado el proyecto

## Archivos que carga
Lee los siguientes archivos en orden:
1. `.opencode/context/01-project-overview.md` — Visión general del proyecto
2. `.opencode/context/02-architecture.md` — Arquitectura de módulos
3. `.opencode/context/03-entities.md` — Entidades y relaciones
4. `.opencode/context/04-api-endpoints.md` — Endpoints de la API
5. `.opencode/context/05-auth-and-guards.md` — Sistema de autenticación
6. `.opencode/context/06-business-logic.md` — Lógica de negocio clave
7. `.opencode/context/07-database-and-infra.md` — Base de datos e infraestructura
