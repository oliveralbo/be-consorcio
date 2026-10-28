#!/usr/bin/env bash
# DoD mecánico — corre contra el DIFF, no contra el repo entero.
# La deuda preexistente no bloquea una tarea; solo lo que tocaste.
#
# Uso:  bash scripts/check-dod.sh [ref-base]
#   sin argumento      → cambios sin commitear (HEAD + untracked)
#   bash scripts/check-dod.sh main   → todo lo que difiere de main
#
# Exit 0 = sin blockers. Exit 1 = hay blockers.
#
# No verifica el estado de la base (migraciones pendientes, datos). Eso es
# juicio + regla de entorno.

set -uo pipefail

BASE="${1:-HEAD}"
ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || {
  echo "No estás dentro de un repo git." >&2
  exit 1
}
cd "$ROOT" || exit 1

if ! git rev-parse --verify --quiet "$BASE" >/dev/null; then
  echo "La referencia '$BASE' no existe." >&2
  exit 1
fi

BLOCKERS=0

block() { printf '  \033[31mBLOCKER\033[0m %s\n' "$1"; BLOCKERS=$((BLOCKERS + 1)); }
note()  { printf '  \033[33mshould \033[0m %s\n' "$1"; }
pass()  { printf '  \033[32mok     \033[0m %s\n' "$1"; }

# git diff no ve archivos untracked: se suman aparte.
TRACKED=$(git diff --name-only "$BASE" -- 2>/dev/null)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null)
FILES=$(printf '%s\n%s\n' "$TRACKED" "$UNTRACKED" | sed '/^[[:space:]]*$/d' | sort -u)

echo
echo "DoD — diff contra '$BASE'"
echo "════════════════════════════════════════════════════════"

if [ -z "$FILES" ]; then
  echo "  Sin cambios. Nada que verificar."
  exit 0
fi

echo "  Archivos en el diff: $(printf '%s\n' "$FILES" | wc -l | tr -d ' ')"
echo

# ── 1. Tipos ────────────────────────────────────────────────
echo "Tipos (tsc --noEmit)"
if printf '%s\n' "$FILES" | grep -qE '\.ts$'; then
  TSC_OUT=$(npx tsc --noEmit -p tsconfig.json 2>&1)
  if [ $? -eq 0 ]; then
    pass "sin errores de tipos"
  else
    block "tsc --noEmit falló"
    printf '%s\n' "$TSC_OUT" | head -30 | sed 's/^/          /'
  fi
else
  pass "sin archivos .ts en el diff"
fi
echo

# ── 2. ESLint ───────────────────────────────────────────────
echo "ESLint (solo archivos del diff)"
TS_FILES=$(printf '%s\n' "$FILES" | grep -E '\.ts$' | while IFS= read -r f; do
  [ -f "$f" ] && printf '%s\n' "$f"
done)
if [ -n "$TS_FILES" ]; then
  ESLINT_OUT=$(printf '%s\n' "$TS_FILES" | xargs npx eslint 2>&1)
  if [ $? -eq 0 ]; then
    pass "sin errores de lint"
  else
    block "ESLint falló"
    printf '%s\n' "$ESLINT_OUT" | head -40 | sed 's/^/          /'
  fi
else
  pass "sin archivos .ts existentes para lint"
fi
echo

# ── 3. Entidad sin migración ────────────────────────────────
echo "Entidades y migraciones"
ENTITY_FILES=$(printf '%s\n' "$FILES" | grep -E '^src/modules/.*\.entity\.ts$' || true)
DELETED_ENTITIES=$(git diff --name-only --diff-filter=D "$BASE" -- 'src/modules/**/*.entity.ts' 2>/dev/null || true)

# Una migración ya aplicada no se edita: solo cuenta una NUEVA.
ADDED_MIGRATIONS=$(git diff --name-only --diff-filter=A "$BASE" -- 'src/migrations/*.ts' 2>/dev/null || true)
UNTRACKED_MIGRATIONS=$(git ls-files --others --exclude-standard -- 'src/migrations/*.ts' 2>/dev/null || true)
MIGRATION_NEW=$(printf '%s\n%s\n' "$ADDED_MIGRATIONS" "$UNTRACKED_MIGRATIONS" | sed '/^[[:space:]]*$/d')
MODIFIED_MIGRATIONS=$(git diff --name-only --diff-filter=M "$BASE" -- 'src/migrations/*.ts' 2>/dev/null || true)

if [ -n "$ENTITY_FILES" ] || [ -n "$DELETED_ENTITIES" ]; then
  MAPPING=0
  if [ -n "$DELETED_ENTITIES" ]; then
    MAPPING=1
  fi
  for f in $ENTITY_FILES; do
    if [ ! -f "$f" ]; then
      continue
    fi
    if ! git ls-files --error-unmatch "$f" >/dev/null 2>&1; then
      MAPPING=1 # archivo nuevo
    elif git diff "$BASE" -- "$f" | grep -qE '^[+-][^+-].*@(Column|JoinColumn|ManyToOne|OneToOne|OneToMany|Index|Entity)'; then
      MAPPING=1
    fi
  done

  if [ "$MAPPING" -eq 1 ]; then
    if [ -n "$MIGRATION_NEW" ]; then
      pass "entidad modificada con migración nueva"
    else
      block "entidad modificada sin migración nueva en src/migrations/"
      printf '%s\n' "$ENTITY_FILES" "$DELETED_ENTITIES" | sed '/^$/d' | sed 's/^/          /'
    fi
  else
    note "entidad tocada sin cambios de mapeo detectados; confirmá que no requiere migración"
  fi
else
  pass "sin cambios de entidades"
fi

if [ -n "$MODIFIED_MIGRATIONS" ]; then
  COUNT=$(printf '%s\n' "$MODIFIED_MIGRATIONS" | sed '/^$/d' | wc -l | tr -d ' ')
  note "$COUNT migración(es) existente(s) modificada(s): una migración aplicada no se edita"
fi
echo

# ── 4. Secretos ─────────────────────────────────────────────
echo "Secretos"
SECRET_FILES=$(printf '%s\n' "$FILES" | grep -E '(^|/)\.env($|\.)|\.(pem|key)$' | grep -v '\.env\.example' || true)
if [ -n "$SECRET_FILES" ]; then
  block "archivo sensible en el diff"
  printf '%s\n' "$SECRET_FILES" | sed 's/^/          /'
else
  pass "sin .env, .pem ni .key"
fi

if git diff "$BASE" -- . 2>/dev/null | grep -qE '^\+.*BEGIN (RSA |OPENSSH |EC )?PRIVATE KEY'; then
  block "clave privada agregada en el diff"
fi
echo

# ── 5. Tamaño de archivos ───────────────────────────────────
echo "Tamaño (máx. 400 líneas)"
BIG=0
while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in
    src/seeds/* | src/migrations/* | test/* | *.spec.ts) continue ;;
    *.ts) ;;
    *) continue ;;
  esac
  [ -f "$f" ] || continue
  LINES=$(wc -l <"$f" | tr -d ' ')
  if [ "$LINES" -gt 400 ]; then
    block "$f tiene $LINES líneas"
    BIG=1
  fi
done <<<"$FILES"
if [ "$BIG" -eq 0 ]; then
  pass "sin archivos nuevos o modificados por encima de 400"
fi
echo

# ── Resumen ─────────────────────────────────────────────────
echo "════════════════════════════════════════════════════════"
if [ "$BLOCKERS" -eq 0 ]; then
  printf 'DoD: \033[32mexit 0\033[0m (0 blockers) — cerrable\n'
  exit 0
else
  printf 'DoD: \033[31mexit 1\033[0m (%s blocker(s)) — no cerrable\n' "$BLOCKERS"
  exit 1
fi
