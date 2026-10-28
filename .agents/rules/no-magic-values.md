# Sin magic numbers ni magic strings

Los valores literales con significado de negocio deben tener nombre.

## Strings

- Estados, tipos y roles se escriben con los enums existentes:
  - `RolUsuario` (`tesorero`, `vecino`, `administrador`)
  - `TipoExpensa` (`ordinaria`, `extraordinaria`)
  - `EstadoExpensa` (`pendiente`, `parcial`, `pagado`)
  - `TipoGasto` (`mensual`, `extraordinario`)
- Nunca `'pendiente'`, `'ordinaria'` ni `'admin'` sueltos en comparaciones, defaults o asignaciones.
- Un valor que se puede tipear mal sin que el compilador avise ya es candidato a enum o unión de literales.

## Números

Extraer a constante nombrada todo número con significado:

| Valor | Dónde está hoy |
| --- | --- |
| Día de vencimiento de expensas (`10`) | `src/modules/expensa/expensa.service.ts` |
| Expiración del JWT (`3600s`) | `src/modules/auth/auth.module.ts` |
| Rounds de bcrypt (`10`) | `src/modules/usuario/usuario.entity.ts` |
| Piso default (`'PB'`) | `src/modules/unidad-funcional/unidad-funcional.entity.ts` |
| Puerto default (`3001`) | `src/main.ts` |

- Constante local al tope del archivo si se usa una vez; `src/config/constants.ts` si la comparten varios módulos. No crear un archivo gigante de constantes.
- Números triviales (`0`, `1`, `100` para porcentaje) no necesitan constante.

## Dónde no aplica

- Datos de seed (`src/seeds/load-data.seed.ts`): son datos, no reglas.
- Tamaños de columna (`precision: 10, scale: 2`): son parte del esquema.
