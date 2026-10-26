# Overview

## Qué es

API REST para la administración de consorcios (edificios): personas, unidades
funcionales, expensas, gastos y balance financiero.

Es **solo backend**: no tiene frontend. La consumen una app de vecinos y un
panel de administración que viven en otros repos.

## Alcance funcional

- Personas: propietarios e inquilinos.
- Usuarios del sistema con roles `administrador`, `tesorero` y `vecino`.
- Unidades funcionales (departamentos, locales) con propietario e inquilino.
- Expensas ordinarias y extraordinarias, con pago parcial.
- Gastos mensuales y extraordinarios.
- Dashboard con balance (ingresos - egresos).

## Stack

| Componente | Tecnología |
| --- | --- |
| Framework | NestJS 11 |
| Lenguaje | TypeScript 5.9 (ES2023, `nodenext`) |
| ORM | TypeORM 0.3 |
| Base de datos | PostgreSQL 14 |
| Autenticación | Passport + JWT + bcrypt |
| Validación | class-validator + class-transformer |
| Tests | Jest 30 + Supertest |
| Contenedores | Docker + Docker Compose |

## Puertos

| Servicio | Puerto |
| --- | --- |
| API en desarrollo (`npm run start:dev`) | `3001` |
| API en Docker (`consorcio-app`) | `3000` |
| PostgreSQL desde el host | `5433` |
| PostgreSQL dentro de Docker | `5432` |

## Documentación

El índice está en `AGENTS.md` (raíz). Arquitectura, DB, API, auth, dominio,
infra y riesgos viven en `.agents/docs/`.
