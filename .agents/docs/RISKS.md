# Riesgos y deuda técnica

Estado al 2026-10-25. Ordenado por impacto. Lo marcado como **supuesto** no fue
reproducido, solo inferido del código.

## Alta

### 1. `JWT_SECRET` débil y versionado

- `.env.example` y `docker-compose.yml` usan el mismo secreto de ejemplo.
- Si se despliega sin cambiarlo, cualquiera puede firmar tokens válidos.
- Hoy no hay producción configurada, pero el valor quedó en el historial de Git.
- **Acción**: secreto real por entorno, rotar antes de cualquier deploy.

### 2. Comparación de `decimal` como string en expensas (**supuesto**)

- Postgres devuelve `decimal` como string; `preload` carga `monto` y
  `monto_pagado` como strings.
- Si el update no envía `monto_pagado`, `expensa.monto_pagado >= expensa.monto`
  compara strings lexicográficamente: `'900' >= '1000'` es `true`.
- No fue reproducido con datos reales. Verificar con un test antes de confiar en
  el cálculo de estado.
- **Acción**: convertir a número (o `transformer` en la entidad) antes de
  comparar.

## Media

### 3. Sin paginación

- Todos los listados (`personas`, `usuarios`, `unidades`, `expensas`, `gastos`)
  usan `find()` sin `skip`/`take`.
- Con datos reales crece el tiempo de respuesta y el uso de memoria.
- **Acción**: paginar cuando algún listado supere un volumen razonable.

### 4. `ValidationPipe` sin `whitelist`

- `new ValidationPipe()` acepta campos no declarados en el DTO.
- Un cliente puede mandar `estado`, `deleted_at` o cualquier propiedad y, según
  el service, terminar en el `save`.
- **Acción**: `whitelist: true` + `forbidNonWhitelisted: true` en `main.ts`.

### 5. Cobertura de tests mínima

- Solo 2 suites: el banner del health y el GET `/` e2e.
- Auth, roles, expensas, gastos y balance no tienen tests.
- **Acción**: cubrir al menos login, guards y generación de expensas.

### 6. Sin rate limiting en login

- No está `@nestjs/throttler` ni ningún límite.
- Permite fuerza bruta sobre `POST /auth/login`.
- **Acción**: throttler global o específico en auth.

### 7. Dockerfile desactualizado

- `node:18-alpine` está fuera de soporte; el entorno local usa Node 22.17.
- Corre `npm run start:dev` en el contenedor: no es un build de producción.
- **Acción**: Node 22, `npm ci`, `npm run build` y `node dist/main`.

### 8. `unique` + soft delete

- `persona.dni` y `usuario_app.email_login` son únicos a nivel DB.
- Borrar (soft delete) no libera el valor: no se puede recrear con el mismo DNI
  o email.
- **Acción**: decidir si se restaura, se anonimiza o se usa un índice parcial
  `WHERE deleted_at IS NULL`.

### 9. `generarMes` de gastos duplica

- No verifica si el mes destino ya se generó.
- Correrlo dos veces crea los gastos dos veces.
- **Acción**: validar existencia antes de clonar.

### 10. CORS hardcodeado

- `main.ts` permite `http://localhost:3000` y `http://192.168.1.7:3000`.
- Cambiar de red o de frontend obliga a editar código.
- **Acción**: mover a variable de entorno.

### 11. Deuda de tipos en `decimal`

- Entidades tipan `monto`, `monto_pagado`, `superficie` y `monto_base` como
  `number`; en runtime son strings.
- El dashboard lo compensa con `parseFloat`; no hay garantía en el resto.
- **Acción**: `transformer` reutilizable o tipos honestos (`string`) y
  conversión explícita.

## Baja

### 12. `tsconfig.build.json` incluye `migration/**/*`

- La carpeta real es `src/migrations`; el include no existe.
- No rompe porque `src/**/*` ya la cubre. Corregir el nombre.

### 13. N+1 en `generarExpensasMes`

- Una query por unidad para verificar si ya existe la expensa.
- Con muchas unidades es lento. **Acción**: traer las existentes en una sola
  query y comparar en memoria.

### 14. Sin refresh token

- El JWT dura 1 hora y no hay renovación ni logout del servidor.
- Hay una card en Trello sobre "extender sesión". **Acción**: definir estrategia.

### 15. Índices en FKs

- Postgres no indexa automáticamente las columnas FK.
- `id_unidad`, `id_propietario`, `id_inquilino`, `registrado_por` no tienen
  índice explícito. Impacta en joins y filtros grandes.

### 16. Un solo consorcio

- No hay `id_consorcio` en ninguna tabla: el modelo asume un edificio único.
- Si el producto crece a multi-consorcio, es una migración grande.

## Resuelto

| Ítem | Estado |
| --- | --- |
| Vulnerabilidad de `multer` | `overrides.multer: 2.5.0`, `npm audit` en 0. |
| Secreto JWT hardcodeado en `constants.ts` | Eliminado; todo por `ConfigService.getOrThrow`. |
| Migración huérfana fuera de `src/migrations` | Eliminada. |
| Lint con 153 errores | 0 errores. |
| Tests rotos | Ambos pasan. |
| `any` explícito | 0 usos; regla ESLint en `error`. |
