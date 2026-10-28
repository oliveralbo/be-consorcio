# Prohibido `any`

- `any` está prohibido en `src/`, `test/` y `scripts/`. `@typescript-eslint/no-explicit-any` es **error**.
- Usar `unknown` + type guard, genéricos o una interfaz que describa lo que se usa.
- Prohibido `as any` y `as unknown as X` para saltear el sistema de tipos.
- Librería sin tipos: definir una interfaz mínima con lo que realmente se consume.
- Respuestas de terceros (JWT payload, `request.user`): tiparlas con interfaces propias, como ya se hace con `JwtPayload` y `RequestWithUser`.
- Si un tipo es realmente inclasificable, se pregunta antes de meter `any`.
