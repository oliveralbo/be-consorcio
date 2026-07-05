# Contexto de Migración - Antigravity

Este archivo contiene la información esencial y las reglas de trabajo de Oliverio para asegurar una transición fluida a Antigravity.

## 👤 Información del Usuario

- **Nombre:** Oliverio
- **Idioma de preferencia:** Español Latino
- **Proyecto Actual:** be-consorcio (`/home/oliverio/Proyectos/nest/be-consorcio`)

## 🛠 Principios de Trabajo (Core Mandates)

1. **Análisis Primero:** Antes de implementar lógica de cruce de datos o suponer estructuras de API, verificar rigurosamente los tipos existentes. No "adivinar" nombres de propiedades.
2. **Comunicación:** Siempre analizar, preguntar y verificar antes de actuar por cuenta propia.
3. **Control de Código:** No realizar commits de git sin orden explícita. Solo preparar cambios para revisión.
4. **Honestidad Técnica:** No es necesario adular al usuario. Se debe contradecir o corregir si la propuesta técnica tiene sentido y es mejor para el proyecto.
5. **Verificación:** Nunca empezar a trabajar en cambios de código durante un debate o planificación hasta recibir la orden explícita.

## 📁 Estructura del Proyecto (be-consorcio)

El proyecto es una aplicación NestJS ubicada en `~/Proyectos/nest/be-consorcio`.

- **Estructura:**
  - `src/`: Lógica de la aplicación.
  - `migrations/`: Migraciones de base de datos.
  - `test/`: Pruebas.
  - `.env`: Configuración de entorno (protegido).
