# TypeORM 0.3 + PostgreSQL

## Esquema: solo migraciones

- `synchronize: false` **siempre**. Nunca activarlo, ni "solo para probar".
- Todo cambio de entidad que toque la tabla (columna, tipo, nullable, default, índice, relación) necesita su migración en `src/migrations/`.
- El CLI apunta a `dist/config/data-source.js`: **compilar antes** de generar o correr.

```bash
npm run build
npm run migration:generate -- src/migrations/NombreDescriptivo
npm run migration:run
npm run migration:revert   # solo dev, con confirmación
```

- Nunca editar una migración ya aplicada. Se corrige con una nueva.
- Nombre en PascalCase descriptivo (`AddTipoToGasto`), no `Migration123`.
- Antes de correr cualquier comando contra la DB: verificar el target (`entorno.md`).
- `db:drop` y `migration:revert` requieren confirmación explícita.

## Entidades

- Una entity por archivo, dentro de su módulo.
- Nombres de columna en snake_case, igual que la DB (`id_persona`, `fecha_vencimiento`).
- Relaciones explícitas con `@JoinColumn`. Sin `eager`.
- Soft delete con `@DeleteDateColumn()`: las queries normales ya excluyen los borrados. `withDeleted` solo para auditoría o restauración.
- Cuidado con `unique` + soft delete: la fila borrada sigue ocupando el valor (ver `RISKS.md`).

## Tipos en runtime

- `decimal` en Postgres vuelve como **string** por node-postgres. Tiparlo `number` no lo convierte. Si se opera el valor, transformar explícitamente o usar un `transformer` (hoy las entidades lo tipean como `number`: deuda).
- `date` vuelve como string `YYYY-MM-DD`, aunque la propiedad esté tipada `Date`. Cuidado al comparar y al serializar.
- Los ids son `uuid` (string).

## Queries

- Repositorios inyectados. Nunca `getRepository()` global ni `DataSource` suelto dentro de un service.
- Los listados hoy no paginan: devuelven todo. Si el endpoint puede crecer, paginar antes de agregarlo.
- Operaciones que escriben varias filas: `DataSource.transaction` o un único `save(array)`, nunca un loop de `save` suelto.
- SQL crudo solo si TypeORM no lo resuelve, y parametrizado.
