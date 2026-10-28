# Dominio

Reglas de negocio implementadas. Si una regla no está acá, no está definida:
preguntar antes de inventarla.

## Glosario

| Término | Significado |
| --- | --- |
| Consorcio | Edificio administrado. |
| Unidad funcional | Departamento o local del edificio. |
| Propietario | Persona dueña de una unidad. |
| Inquilino | Persona que alquila una unidad (opcional). |
| Expensa ordinaria | Gasto común mensual, calculado sobre `monto_base`. |
| Expensa extraordinaria | Gasto puntual (reparación, obra), cargado a mano. |
| Pago parcial | `monto_pagado` mayor a 0 y menor a `monto`. |
| Pozo / balance | Ingresos cobrados menos egresos pagados hasta hoy. |

## Expensas: generación mensual

`ExpensaService.generarExpensasMes(mes, anio)`:

1. Obtiene todas las unidades funcionales activas.
2. Por cada unidad, verifica si ya existe una expensa `ORDINARIA` de ese
   `mes`/`anio`.
3. Si no existe, crea:
   - `monto = unidad.monto_base`
   - `tipo = ORDINARIA`
   - `estado = PENDIENTE` (default)
   - `fecha_vencimiento` = día **10** del mes solicitado
   - `descripcion` = `Expensa ordinaria correspondiente a {mes}/{anio}`
4. Si no se creó ninguna (todas existían o no hay unidades):
   `ConflictException`.

No genera extraordinarias. No valida que `mes`/`anio` sean futuros.

## Expensas: actualización y estado automático

En `ExpensaService.update()` el estado se recalcula siempre:

```
monto_pagado >= monto   → PAGADO  (y setea fecha_pago si falta)
monto_pagado > 0        → PARCIAL
monto_pagado = 0        → PENDIENTE
```

- No se limita `monto_pagado` a `monto`: se puede pagar de más.
- Si el update no manda `monto_pagado`, se recalcula con el valor actual.
- `fecha_pago` no se limpia si la expensa vuelve a `PENDIENTE` o `PARCIAL`.

## Gastos: generación mensual

`GastoService.generarMes(mes, anio, userId)`:

1. Calcula el mes anterior (enero → diciembre del año anterior).
2. Busca los gastos `MENSUAL` con `fecha` dentro de ese mes.
3. Si no hay: `NotFoundException`.
4. Clona concepto, descripción, monto y medio de cada uno.
5. Los nuevos gastos quedan con `fecha` = día 1 del mes solicitado,
   `tipo = MENSUAL` y `registrado_por = userId`.
6. Guarda todos juntos.

No verifica si el mes destino ya fue generado: correrlo dos veces duplica los
gastos (ver `RISKS.md`).

## Dashboard: balance

`DashboardService.getBalanceActual()`:

```
ingresos = Σ monto de expensas con estado = PAGADO y fecha_pago <= hoy
egresos  = Σ monto de gastos con fecha <= hoy
balance  = ingresos - egresos
```

- Se usa `monto` (total), no `monto_pagado`. Una expensa parcial no suma como
  ingreso hasta estar `PAGADO`.
- Los montos se convierten con `parseFloat`, porque Postgres devuelve `decimal`
  como string.
- No hay filtro por consorcio: el sistema asume un consorcio único.

## Soft delete

- Todas las entidades tienen `deleted_at`.
- Los DELETE de la API son soft delete y responden 204.
- Las queries normales excluyen las filas borradas.
- Consecuencia: un DNI o email borrado sigue ocupando el valor único
  (ver `RISKS.md`).

## Seeds

| Script | Qué hace |
| --- | --- |
| `npm run seed:admin` | Interactivo. Crea Persona + UsuarioApp con rol `ADMIN`. |
| `npm run seed:load` | Carga datos de demo (personas, unidades, expensas, gastos). |

Son datos de desarrollo. No ejecutarlos sin pedido explícito ni contra una base
que no sea local (ver `.agents/rules/entorno.md`).
