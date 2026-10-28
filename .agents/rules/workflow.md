# Workflow Global

Toda skill debe seguir este proceso. No es opcional.

1. **Validar la rama (Git)** — nunca escribir código en `main`. Si la rama actual es `main`, actualizar con `git pull` y crear una rama `tipo/slug` (Conventional Commits). Ver `git.md`.
2. **Comprender la tarea** — qué se pide, y qué NO se pide.
3. **Analizar el código existente** — explorar el proyecto antes de proponer. No adivinar nombres de propiedades, rutas ni firmas.
4. **Identificar qué docs necesita** — mirar el índice de `AGENTS.md`. Leer **solo** lo relevante de `.agents/docs/`.
5. **Buscar implementaciones similares** — el módulo `expensa` es el patrón de referencia para CRUD + lógica de negocio.
6. **Reutilizar antes de crear** — extender un módulo existente antes que duplicar.
7. **Si falta información, preguntar** — no inventar reglas de negocio, roles ni permisos.
8. **Ejecutar** — respetando `estructura.md`, `nest.md`, `typeorm.md` y el resto de las reglas.
9. **Validar** — `bash scripts/check-dod.sh`. Exit 0 = cerrable. Un fix destapa otro: repetir hasta 0.
10. **Revisar con criterio** — lo que el script no ve: regresiones silenciosas, lógica de negocio en el controller, cambios fuera de alcance. Severidad `blocker` / `should` / `nit` (ver skill `done`).
11. **Si cambió el proyecto, sugerir `upgrade`** — para mantener `.agents/docs/` al día.
12. **No commitear por iniciativa propia** — solo si Oli lo pide explícitamente. Push nunca. Ver `git.md`.
