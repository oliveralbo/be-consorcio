# Business Logic

## Expensa: Generación Mensual (`ExpensaService.generarExpensasMes`)

```
Input: { mes, anio }

1. Obtener todas las UnidadFuncional activas
2. Por cada unidad:
   a. Verificar si ya existe una expensa ORDINARIA para ese mes/anio
   b. Si no existe, crear:
      - monto = unidad.monto_base
      - fecha_vencimiento = 10 del mes solicitado
      - tipo = 'ordinaria'
      - estado = 'pendiente'
3. Si TODAS las unidades ya tienen expensa, lanzar ConflictException
```

## Expensa: Actualización con Estado Automático

Cuando se actualiza `monto_pagado` en una expensa:

```typescript
if (monto_pagado >= monto) {
  estado = PAGADO
  if (!fecha_pago) fecha_pago = today
} else if (monto_pagado > 0) {
  estado = PARCIAL
} else {
  estado = PENDIENTE
}
```

## Gasto: Generación Mensual (`GastoService.generarMes`)

```
Input: { mes, anio }, userId

1. Buscar todos los gastos de tipo MENSUAL del mes anterior
2. Para cada gasto mensual encontrado:
   - Crear un nuevo gasto clonando concepto, descripcion, monto, medio
   - fecha = primer día del mes solicitado
   - registrado_por = userId
3. Guardar todos los clones
```

## Dashboard: Balance (`DashboardService.getBalance`)

```
Ingresos = SUM(monto) de Expensa WHERE estado = PAGADO AND fecha_pago <= today
Egresos  = SUM(monto) de Gasto WHERE fecha <= today
Balance  = Ingresos - Egresos
```

## Soft Delete
Todas las entidades tienen `deleted_at` (nullable). TypeORM `@DeleteDateColumn()`.
Los endpoints DELETE realizan soft delete y retornan 204.
Los queries de listado filtran automáticamente soft-deleted (TypeORM `softDelete` + `FindOptionsWhere` implícito).

## Seeders
- `src/seeds/admin-user.seed.ts` - Script interactivo que crea un usuario ADMIN
- Ejecutar con: `npm run seed:admin`
- Pregunta datos de persona + login, crea Persona y UsuarioApp con rol ADMIN
