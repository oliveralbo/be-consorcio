---
name: modulo
description: Crea un módulo NestJS nuevo con el patrón del proyecto (entity, DTOs, service, controller, module).
---

Antes de crear: **verificá si la funcionalidad entra en un módulo existente**.
Si entra, extender es mejor que crear.

## 1. Estructura

```
src/modules/<modulo>/
├── dto/
│   ├── create-<modulo>.dto.ts
│   └── update-<modulo>.dto.ts
├── <modulo>.controller.ts
├── <modulo>.entity.ts
├── <modulo>.module.ts
└── <modulo>.service.ts
```

## 2. Entity

- `@Entity()` con nombre de tabla en snake_case si no coincide con la clase.
- PK `@PrimaryGeneratedColumn('uuid')`.
- Columnas en snake_case, con tipo explícito cuando no es obvio
  (`decimal`, `date`, `text`, `enum`).
- `@CreateDateColumn`, `@UpdateDateColumn`, `@DeleteDateColumn`.
- Relaciones con `@JoinColumn({ name: 'id_...' })`, sin `eager`.
- Enums de dominio en el mismo archivo o en el módulo que los define.

## 3. Migración

No crear la tabla a mano. Seguí la skill `migration`:

```bash
npm run build
npm run migration:generate -- src/migrations/Create<Modulo>
npm run migration:run
```

## 4. DTOs

- `CreateDto` con `class-validator`: `@IsNotEmpty`, `@IsUUID`, `@IsNumber` +
  `@Min(0)`, `@IsDateString`, `@IsEnum`.
- `UpdateDto extends PartialType(CreateDto)`.
- No exponer la entidad como body.

## 5. Service

- `@InjectRepository(Entity)`.
- CRUD con `find`, `findOne`, `create`, `save`, `preload`, `softDelete`.
- `NotFoundException` si no existe; `ConflictException` si duplica una regla.
- Relaciones cargadas explícitamente en `relations`.
- Reglas de negocio acá, no en el controller.

## 6. Controller

- `@Controller('<ruta>')` + `@UseGuards(JwtAuthGuard, RolesGuard)`.
- `@Roles(...)` por endpoint, con `RolUsuario`.
- `ParseUUIDPipe` en los `:id`.
- DELETE devuelve 204.
- Sin lógica: solo delega.

## 7. Module

- `TypeOrmModule.forFeature([Entity])`.
- Importar `AuthModule` si el controller usa guards.
- `exports: [Service]` solo si otro módulo lo consume.
- Registrar el módulo en `src/app.module.ts`.

## 8. Verificación

- `npm run build`.
- `npx eslint "{src,test}/**/*.ts"`.
- `bash scripts/check-dod.sh`.
- Si hay app corriendo: probar listar, crear, editar y borrar con un token.
