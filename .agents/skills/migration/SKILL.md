---
name: migration
description: Crea y verifica migraciones TypeORM sin romper el esquema ni los datos.
---

## Antes de empezar

1. Verificá el entorno (`entorno.md`): `DB_HOST`, `DB_PORT` y `DB_DATABASE` deben
   apuntar a la base local (`localhost:5433` / `consorcio_db`).
2. Si hay dudas o el host no es local: **frená y preguntá**.
3. Confirmá que el cambio de esquema fue pedido. Una migración no se corre "para
   ver si anda".

## Procedimiento

```bash
# 1. Compilar: el CLI usa dist/config/data-source.js
npm run build

# 2. Generar contra la base actual
npm run migration:generate -- src/migrations/NombreDescriptivo

# 3. Revisar el SQL generado (obligatorio)
#    - ¿DROP de columna o tabla? Requiere confirmación.
#    - ¿Columna NOT NULL sin default sobre datos existentes? Necesita backfill.
#    - ¿Índices, FKs y defaults coherentes?
#    - ¿Nombre en PascalCase y descriptivo?

# 4. Aplicar
npm run migration:run

# 5. Verificar
npm run build   # si tocaste código
```

## Reglas

- Nunca editar una migración ya aplicada. Se corrige con una nueva.
- Nunca `synchronize: true`.
- `migration:revert` y `db:drop` solo en dev y con confirmación explícita.
- Si la migración transforma datos, hacerlo en la misma migración y de forma
  idempotente cuando sea posible.
- Commits: la migración va con el cambio de entidad en el mismo cambio lógico.
- Después de correr: `bash scripts/check-dod.sh`.
- Actualizá `.agents/docs/INFRA.md` (tabla de migraciones) y `DB.md` si cambió
  el modelo.
