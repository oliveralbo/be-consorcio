# NestJS 11

## Capas

- **Controller**: recibe HTTP, valida el DTO (pipe global), aplica guards y delega. Sin repositorios, sin reglas de negocio, sin cálculos.
- **Service**: reglas de negocio y acceso a datos. Único lugar donde vive la lógica.
- **Entity**: mapeo a tabla. Sin lógica.
- **Module**: declara controller, service y `TypeOrmModule.forFeature([Entity])`. Exporta el service solo si otro módulo lo consume.

## Inyección de dependencias

- Repositorios con `@InjectRepository(Entity)`.
- Nunca instanciar services con `new`: rompe el ciclo de vida y los mocks.
- `ConfigModule` es global (`isGlobal: true`). Usar `ConfigService`, no `process.env`.
- `process.env` solo en `main.ts` y `config/data-source.ts` (corren fuera del contenedor de Nest).

## DTOs y validación

- Todos los DTOs usan `class-validator`. El Update se arma con `PartialType(CreateDto)`.
- `@IsUUID()` para ids, `@IsDateString()` para fechas, `@IsNumber()` + `@Min(0)` para montos, `@IsEnum()` para enums.
- IDs que vienen por ruta: `ParseUUIDPipe`.
- **Deuda conocida**: el `ValidationPipe` global no tiene `whitelist`. No mandar campos "por las dudas". Si se toca `main.ts`, agregar `whitelist: true` y `forbidNonWhitelisted: true`.

## Errores

- Usar las excepciones de Nest: `NotFoundException`, `ConflictException`, `BadRequestException`, `UnauthorizedException`, `ForbiddenException`.
- No devolver `null` para representar "no existe": lanzar excepción.
- No inventar códigos de error propios si alcanza con la excepción estándar.

## Autenticación y roles

- Rutas protegidas: `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(RolUsuario.X)`.
- Nunca comparar roles con strings literales: usar el enum `RolUsuario`.
- Los guards no contienen lógica de negocio.

## Async

- `async`/`await` siempre. Nada de promesas flotantes (el lint lo marca).
- Varias escrituras relacionadas en una operación: usar transacción (ver `typeorm.md`).

## Módulos

- Sin dependencias circulares. Si aparece una, separar responsabilidades; no usar `forwardRef`.
- Cada módulo declara solo lo que necesita. No exponer repositorios.

## Tests

- Unitarios: `<archivo>.spec.ts` al lado del archivo.
- E2E: `test/*.e2e-spec.ts`, con `app.close()` en `afterAll`.
- Toda corrección de bug debería dejar un test que lo cubra, si el área ya tiene tests.
