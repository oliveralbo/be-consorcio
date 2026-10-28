# Arquitectura

## Estructura

```
src/
├── main.ts                    # bootstrap: CORS + ValidationPipe + listen
├── app.module.ts              # ConfigModule (global) + TypeORM + módulos
├── app.controller.ts          # GET / (health)
├── config/
│   └── data-source.ts         # DataSource del CLI de TypeORM
├── migrations/                # 9 migraciones aplicadas
├── seeds/
│   ├── admin-user.seed.ts     # usuario admin interactivo
│   └── load-data.seed.ts      # datos de demo
└── modules/
    ├── auth/
    │   ├── decorators/roles.decorator.ts
    │   ├── guards/{jwt-auth,local-auth,roles}.guard.ts
    │   ├── strategies (local.strategy.ts, jwt.strategy.ts)
    │   ├── auth.controller.ts | auth.module.ts | auth.service.ts
    ├── persona/
    ├── usuario/
    ├── unidad-funcional/
    ├── expensa/
    ├── gasto/
    └── dashboard/
```

Cada módulo funcional sigue el mismo patrón:

```
modulo/
├── dto/
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── modulo.controller.ts
├── modulo.entity.ts
├── modulo.module.ts
└── modulo.service.ts
```

## Flujo de un request

```
Request
  → Controller (routing)
  → Guards (JwtAuthGuard → RolesGuard)
  → ValidationPipe global (DTO)
  → Handler
  → Service (reglas de negocio)
  → Repository (TypeORM)
  → Response
```

El orden importa: los guards corren **antes** de la validación del DTO. Un
request sin token recibe 401 aunque el body sea inválido.

## Dependencias entre módulos

```
AppModule
├── ConfigModule (global)
├── TypeOrmModule.forRoot()
├── AuthModule ─────────────► UsuarioModule
├── PersonaModule
├── UsuarioModule
├── UnidadFuncionalModule
├── ExpensaModule ──────────► AuthModule, UnidadFuncionalModule
├── GastoModule ────────────► AuthModule
└── DashboardModule ────────► AuthModule, GastoModule, ExpensaModule
```

- `ExpensaModule` exporta `ExpensaService` y `GastoModule` exporta
  `GastoService` porque `DashboardModule` los consume.
- `AuthModule` importa `UsuarioModule` para validar credenciales.
- No hay dependencias circulares.

## Convenciones

- Archivos en kebab-case; clases en PascalCase.
- Una entidad por archivo, dentro de su módulo.
- La lógica de negocio vive en los services; los controllers solo traducen HTTP.
- Detalle de reglas: `.agents/rules/estructura.md` y `.agents/rules/nest.md`.
