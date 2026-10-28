# Estructura del proyecto

API NestJS. Todo el código de aplicación vive en `src/`.

```
src/
├── main.ts                  # bootstrap: CORS + ValidationPipe + listen
├── app.module.ts            # raíz: ConfigModule + TypeOrmModule.forRootAsync + módulos
├── app.controller.ts        # GET / (health)
├── config/
│   └── data-source.ts       # DataSource para el CLI de TypeORM (migraciones)
├── migrations/              # migraciones (fuente de verdad del esquema)
├── seeds/                   # scripts de carga (admin, datos demo)
└── modules/
    └── <modulo>/
        ├── dto/
        │   ├── create-<modulo>.dto.ts
        │   └── update-<modulo>.dto.ts
        ├── <modulo>.controller.ts
        ├── <modulo>.entity.ts
        ├── <modulo>.module.ts
        └── <modulo>.service.ts

test/                        # e2e (jest-e2e.json)
scripts/                     # herramientas del repo (check-dod.sh)
.agents/                     # harness de IA (rules, docs, skills)
```

## Reglas

- Un módulo nuevo es una carpeta propia en `src/modules/` con los cinco archivos del patrón.
- Los DTOs de entrada van en `dto/`. Nunca usar la entidad como body de un request.
- **Las migraciones van en `src/migrations/`**, no en `migrations/` en la raíz.
- La lógica de negocio vive en el service. El controller solo traduce HTTP.
- Los seeds van en `src/seeds/` y se exponen como script `seed:*`.
- Las constantes compartidas van en `src/config/`. Las locales, al tope del archivo.
- No crear carpetas `utils/`, `helpers/` o `common/` genéricas sin justificación concreta.
- No crear archivos fuera de esta estructura sin explicar por qué.
