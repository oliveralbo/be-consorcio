# Architecture

## Estructura de Módulos

```
src/
├── main.ts                          # Bootstrap + ValidationPipe global + CORS
├── app.module.ts                    # Módulo raíz
├── app.controller.ts                # Health check GET /
├── app.service.ts                   # Mensaje de bienvenida
├── config/
│   └── data-source.ts               # Configuración TypeORM DataSource
├── modules/
│   ├── auth/                        # Autenticación JWT
│   ├── persona/                     # CRUD personas
│   ├── usuario/                     # CRUD usuarios del sistema
│   ├── unidad-funcional/            # CRUD unidades funcionales
│   ├── expensa/                     # CRUD expensas + generación mensual
│   ├── gasto/                       # CRUD gastos + generación mensual
│   └── dashboard/                   # Balance financiero
├── migrations/                      # Migraciones TypeORM
└── seeds/                           # Seeders
```

## Patrón por Módulo
Cada módulo funcional sigue la misma estructura:
```
modulo/
├── dto/                      # Data Transfer Objects con validación
│   ├── create-*.dto.ts
│   └── update-*.dto.ts
├── modulo.controller.ts      # Rutas HTTP
├── modulo.entity.ts          # Entidad TypeORM
├── modulo.module.ts          # Declaración del módulo
└── modulo.service.ts         # Lógica de negocio
```

## Flujo de Solicitud
1. Request -> Controller
2. Controller -> ValidationPipe (valida DTO)
3. Guards (JwtAuthGuard -> RolesGuard)
4. Controller -> Service
5. Service -> TypeORM Repository
6. Service -> Response

## Dependencias entre Módulos
```
AppModule
├── AuthModule ──────────────► UsuarioModule
├── PersonaModule
├── UsuarioModule
├── UnidadFuncionalModule
├── ExpensaModule ───────────► AuthModule, UnidadFuncionalModule
├── GastoModule ─────────────► AuthModule
└── DashboardModule ─────────► AuthModule, GastoModule, ExpensaModule
```
