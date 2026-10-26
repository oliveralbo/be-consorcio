# TypeScript

## Config real (`tsconfig.json`)

- `module` / `moduleResolution`: `nodenext`; target `ES2023`; CommonJS (`package.json` no tiene `"type": "module"`).
- `strictNullChecks: true`.
- `noImplicitAny: false`: el compilador **no** frena `any`. Lo frena ESLint (ver `no-any.md`).
- `baseUrl: "./"`, sin path alias. Imports relativos (`../../persona/persona.entity`) o desde `src/...`.
- `isolatedModules: true`: exportar tipos con `export type` cuando corresponda.

## Tipos

- `interface` para formas de objetos; `type` para uniones y utilidades.
- Enums de dominio ya definidos: `RolUsuario`, `TipoExpensa`, `EstadoExpensa`, `TipoGasto`. No redefinirlos ni usar strings equivalentes.
- Retorno explícito en métodos públicos de services y controllers.
- `unknown` + type guard antes que `any`.
- Evitar `as`; si es inevitable, justificar. Evitar `!` salvo invariante claro.
- Tipar `request.user` con las interfaces de auth (`JwtPayload`, `RequestWithUser`). No `any`.

## Fechas y números

- En DTOs, fechas como string ISO con `@IsDateString()`; convertir a `Date` en el service.
- Los `decimal` llegan como string desde Postgres (ver `typeorm.md`): no asumir `number` sin convertir.
