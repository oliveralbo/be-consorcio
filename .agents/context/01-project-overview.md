# Project Overview

## Descripción
API REST para la gestión de consorcios (administración de edificios). Desarrollada con **NestJS 11** + **TypeORM** + **PostgreSQL 14**.

## Propósito
Sistema de administración de consorcios que permite gestionar:
- Personas (propietarios/inquilinos)
- Unidades funcionales (departamentos, locales)
- Expensas (ordinarias y extraordinarias)
- Gastos del edificio
- Usuarios y autenticación con roles
- Dashboard con balance financiero

## Stack Tecnológico
| Componente | Tecnología |
|---|---|
| Framework | NestJS 11 |
| Lenguaje | TypeScript (ES2023) |
| ORM | TypeORM 0.3 |
| Base de datos | PostgreSQL 14 |
| Autenticación | Passport + JWT + bcrypt |
| Validación | class-validator + class-transformer |
| Contenedores | Docker + Docker Compose |

## Puertos
- **API (dev):** `3001`
- **API (Docker):** `3000`
- **PostgreSQL (host):** `5433`
- **PostgreSQL (interno):** `5432`
