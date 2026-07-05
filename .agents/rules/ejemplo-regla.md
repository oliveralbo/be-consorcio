---
description: Regla de ejemplo para el proyecto be-consorcio
glob: "src/modules/**/*.ts"
---

# Reglas de Estilo para Módulos

## Estructura de Archivos
Cada módulo debe mantener la siguiente estructura:
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

## Convenciones de Código
- Usar `@IsNotEmpty()` y validación específica en todos los DTOs
- Nombrar archivos en kebab-case: `mi-modulo.controller.ts`
- Nombrar clases en PascalCase: `MiModuloService`
- Usar `PartialType()` de `@nestjs/mapped-types` para Update DTOs
- Decorar controladores con `@Controller('ruta')`
- Implementar soft delete con `@DeleteDateColumn()` y `deleted_at`

## Validación
- Todos los DTOs deben usar `class-validator`
- Los IDs deben validarse con `@IsUUID()` y `ParseUUIDPipe`
- Las fechas deben usar `@IsDateString()`
- Los montos deben usar `@Min(0)` y `@IsNumber()`

## Seguridad
- Endpoints de ADMIN deben tener `@Roles(RolUsuario.ADMIN)` + `@UseGuards(JwtAuthGuard, RolesGuard)`
- Endpoints de TESORERO deben incluir `RolUsuario.TESORERO` en el decorador de roles
- Rutas de solo lectura para VECINO no deben modificar datos
