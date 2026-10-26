# Autenticación y guards

## Login (`POST /auth/login`)

1. `LocalAuthGuard` activa `LocalStrategy`.
2. `LocalStrategy` extrae `email` y `contrasenia` del body
   (`usernameField: 'email'`, `passwordField: 'contrasenia'`).
3. Llama a `AuthService.validateUser(email, contrasenia)`.
4. `validateUser` busca el usuario con `UsuarioService.findOneByEmail()`.
5. Compara con bcrypt vía `usuario.validatePassword()`.
6. Si falla: `UnauthorizedException('Credenciales incorrectas')`.
7. `AuthController.login()` arma el JWT con `AuthService.login(user)`.
8. Devuelve `{ access_token, user: { id, id_persona, nombre, email, rol } }`.

## JWT

- **Payload**: `{ email_login, sub: id_usuario, rol }`.
- **Secreto**: `JWT_SECRET`, resuelto con `ConfigService.getOrThrow()`.
  - `AuthModule` usa `JwtModule.registerAsync`.
  - `JwtStrategy` lo inyecta por constructor.
  - Ya **no** existe `src/modules/auth/constants.ts` ni un secreto hardcodeado
    de fallback. Si falta `JWT_SECRET`, la app no arranca.
- **Expiración**: `3600s` (1 hora), configurada en `JwtModule.registerAsync`.
- **Header**: `Authorization: Bearer <token>`.
- Sin refresh token ni logout del lado del servidor.

## Guards

| Guard | Archivo | Qué hace |
| --- | --- | --- |
| `JwtAuthGuard` | `guards/jwt-auth.guard.ts` | `AuthGuard('jwt')`. Valida el token. |
| `LocalAuthGuard` | `guards/local-auth.guard.ts` | `AuthGuard('local')`. Solo en `/auth/login`. |
| `RolesGuard` | `guards/roles.guard.ts` | Compara `request.user.rol` con `@Roles()`. |

`RolesGuard` usa `Reflector.getAllAndOverride(ROLES_KEY, [handler, class])`:

- Sin `@Roles()`: permite el acceso.
- Con `@Roles(...)`: exige que el rol del usuario esté en la lista. Si no,
  devuelve `false` → 403.

## Decorador `@Roles`

```ts
@Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)
```

Setea el metadato `roles` en el handler. Se usa siempre junto a
`@UseGuards(JwtAuthGuard, RolesGuard)`.

## Estrategias

- `LocalStrategy.validate(email, contrasenia)` → `AuthService.validateUser()`.
- `JwtStrategy.validate(payload: JwtPayload)` → `{ id_usuario, email_login, rol }`,
  que queda como `request.user`.

`JwtPayload` y `RequestWithUser` son interfaces locales: no usar `any` para
tipar el request.

## Modelo de usuario

- Password hasheado con bcrypt (10 rounds) en `@BeforeInsert`.
- `validatePassword(password)` usa `bcrypt.compare`.
- `rol` es `RolUsuario`: `tesorero` | `vecino` | `administrador`.

## Deuda conocida

- Sin rate limiting en el login (no está `@nestjs/throttler`).
- Token de 1 hora sin renovación; no hay endpoint de refresh.
- Ver `RISKS.md` para el detalle y el resto.
