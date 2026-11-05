---
name: dbml
description: Sincroniza db/schema.dbml con el esquema real de TypeORM (entidades y migraciones) y verifica que no queden diferencias.
---

# Actualizar el DBML

## Cuándo usarla

- Cambió una entidad o se agregó una migración.
- Antes de cerrar una tarea que modifica el esquema.
- Cuando `db/schema.dbml` y el código no coinciden.

## Fuente de verdad

Las entidades en `src/modules/**/*.entity.ts` y las migraciones en
`src/migrations/`. El DBML es una representación: nunca inventa tablas,
columnas ni relaciones que no existan en el código.

## Procedimiento

1. Verificá la rama: nunca trabajar en `main` (ver `git.md`). Si estás en
   `main`, `git pull` y `git checkout -b docs/dbml-<slug>`.
2. Leé todas las entidades y las migraciones nuevas.
3. Leé `db/schema.dbml` completo.
4. Compará tabla por tabla y anotá las diferencias antes de editar.
5. Editá **solo** lo que difiere.
6. Si la base local está levantada, contrastá en modo lectura.
7. Cerrá con `bash scripts/check-dod.sh`.

## Mapeo TypeORM → DBML

| TypeORM | DBML |
| --- | --- |
| `@PrimaryGeneratedColumn('uuid')` | `id_xxx string [pk]` |
| `varchar` / `string` | `string` |
| `text` | `text` |
| `int` / `integer` | `int` |
| `decimal(p, s)` | `decimal(p, s)` |
| `date` | `date` |
| `timestamp` | `datetime` |
| `@CreateDateColumn()` | `datetime [default: \`now()\`]` |
| `@UpdateDateColumn()` | `datetime [default: \`now()\`]` |
| `@DeleteDateColumn()` | `datetime` |
| `nullable: true` | sin `not null` |
| `unique: true` | `[unique]` |
| `default: X` | `[default: X]` |
| enum de TypeScript | `Enum Nombre { ... }` y el tipo del campo |

- Usá el **nombre real de la columna**, no el de la propiedad. Si hay
  `@JoinColumn({ name: 'id_persona' })`, la columna es `id_persona`.
- Los valores de un enum van exactamente como en el código, en el mismo orden.
- Respetá el formato existente: `decimal(10, 2)`, comillas simples en strings y
  comillas invertidas en `now()`.

## Relaciones

Son las FK reales de las entidades:

| Caso | DBML |
| --- | --- |
| `@ManyToOne` (FK en la tabla hija) | `Ref: "hija".fk > "padre".pk` |
| `@OneToOne` (FK única en la hija) | `Ref: "hija".fk - "padre".pk` |
| FK nullable | misma flecha; la nullability se ve en la columna |

- No agregues un `Ref` sin su FK en la entidad.
- Verificá la dirección: el lado `>` es el que tiene la FK.
- Si una entidad tiene dos relaciones a la misma tabla (propietario e
  inquilino), van dos `Ref` distintos.

## Reglas de edición

- Preservá cabecera, orden de tablas, alias (`Table X as "x"`) y el formato.
- Tablas nuevas al final, antes de los `Ref`. `Ref` al final del archivo.
- No reformatees líneas que no cambiaron: el diff tiene que ser mínimo.
- No agregues `Project`, `TableGroup` ni notas si el archivo no los usa.
- **No toques `db/schema.dbdiagram`**: es el layout exportado desde
  dbdiagram.io y se regenera a mano desde la web, no desde el DBML.

## Verificación

- Cada tabla del DBML tiene su entidad, y cada entidad su tabla.
- Cada columna coincide en nombre, tipo, nullability, default y unique.
- Cada enum existe con exactamente los mismos valores.
- Cada FK tiene su `Ref` con la dirección correcta.
- El archivo abre sin errores en la extensión `dbdiagram.dbdiagram-vscode`.

## Contra la base local

Solo lectura. Si el contenedor está arriba:

```bash
docker exec consorcio-db psql -U consorcio_user -d consorcio_db -c '\d+ <tabla>'
```

Nunca corras migraciones, seeds ni modifiques datos desde esta skill. Si el
esquema de la base no coincide con las entidades, frená y avisá: hay una
migración pendiente o una inconsistencia que se resuelve con la skill
`migration`.

## Cierre

- `bash scripts/check-dod.sh` con exit 0.
- Informá en pocas líneas qué tablas y columnas cambiaron.
- Si cambió el modelo, sugerí la skill `upgrade` para actualizar
  `.agents/docs/DB.md`.
