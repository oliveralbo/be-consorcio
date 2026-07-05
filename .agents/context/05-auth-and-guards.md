# Auth System & Guards

## Flujo de Autenticación

### Login (POST /auth/login)
1. `LocalAuthGuard` activa `LocalStrategy`
2. `LocalStrategy` extrae `email` y `contrasenia` del body
3. Llama a `AuthService.validateUser(email, contrasenia)`
4. `validateUser` busca usuario por email en `UsuarioService.findOneByEmail()`
5. Compara password con bcrypt mediante `usuario.validatePassword()`
6. Si OK, retorna usuario; si no, lanza `UnauthorizedException`
7. `AuthController.login()` genera JWT vía `AuthService.login(user)`
8. Retorna `{ access_token, user: { id, id_persona, nombre, email, rol } }`

### JWT Token
- **Payload:** `{ email_login, sub: id_usuario, rol }`
- **Secreto:** `constants.ts` + `process.env.JWT_SECRET`
- **Expiración:** 3600s (1 hora)
- **Header:** `Authorization: Bearer <token>`

## Guards

### JwtAuthGuard
- Extiende `AuthGuard('jwt')`
- Se aplica a rutas protegidas
- `JwtStrategy` valida el token y retorna `{ id_usuario, email_login, rol }`

### LocalAuthGuard
- Extiende `AuthGuard('local')`
- Se aplica solo a `POST /auth/login`
- Extrae `email` como usernameField y `contrasenia` como passwordField

### RolesGuard
- Verifica el decorador `@Roles()` en el handler
- Compara con `request.user.rol`
- Implementación: `const requiredRoles = this.reflector.getAllAndOverride<RolUsuario[]>('roles', ...)`
- Si `requiredRoles` no existe o está vacío, permite el acceso
- Caso contrario, verifica que `requiredRoles.includes(user.rol)`

## Decoradores

### @Roles(...roles: RolUsuario[])
- Establece metadatos `roles` en el handler
- Uso: `@Roles(RolUsuario.ADMIN)` o `@Roles(RolUsuario.ADMIN, RolUsuario.TESORERO)`
- Se aplica por endpoint en el controlador

## Estrategias Passport

### LocalStrategy
- `usernameField: 'email'`
- `passwordField: 'contrasenia'`
- `validate(email, contrasenia)` -> `AuthService.validateUser()`

### JwtStrategy
- Extrae token de `Authorization: Bearer`
- `validate(payload)` -> `{ id_usuario: payload.sub, email_login: payload.email_login, rol: payload.rol }`

## Modelo de Usuario (UsuarioApp)
- `@BeforeInsert()` hashea password con bcrypt (10 rounds)
- `validatePassword(password)`: bcrypt.compare()
- Campo `rol` con enum `RolUsuario`
