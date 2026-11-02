---
trigger: always_on
---

# Repos separados

Este repo es el **backend**. El frontend vive en otro repo:

| Repo | Path | Stack |
| --- | --- | --- |
| `be-consorcio` (acá) | `~/Proyectos/nest/be-consorcio` | NestJS |
| `fe-consorcio` | `~/Proyectos/next/fe-consorcio` | Next.js |

## Regla

- **No se modifica el frontend desde acá.** Ni un archivo, ni un componente, ni
  una variable de entorno, ni un script.
- La única excepción es que Oli lo pida explícitamente para esa tarea, nombrando
  el repo y el cambio. "Acomodar el FE", "consumir el endpoint nuevo" o "probar
  la pantalla" **no** son pedidos explícitos.
- Si el cambio de BE rompe o cambia el contrato: se documenta el contrato nuevo
  (endpoint, request, response, errores) en `docs/API.md` y se avisa. El FE lo
  adapta en su repo.
- Nada de correr comandos del otro repo: `npm run dev`, `next build`, lint del
  frontend.

## Lo que sí está permitido

- **Leer** el otro repo para entender cómo consume la API: hooks, `fetcher`,
  tipos, rutas.
- Leer sus reglas antes de proponer un cambio de contrato.
- Verificar que un DTO nuevo cubre lo que el FE necesita, leyendo el código.

## Git

- Cada repo tiene su rama y su historia. No se commitea cruzado ni se mezclan
  cambios de los dos en una misma tarea.
- Si la tarea requiere tocar ambos, son dos ramas y dos PRs, y Oli lo decide.
