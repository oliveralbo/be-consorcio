---
trigger: always_on
---

# Nada de auto-acciones

- **Nunca** implementar un cambio sin que Oli lo pida explícitamente.
- Antes de implementar algo no trivial: mostrar el plan y **esperar aprobación**.
- Las sugerencias son verbales (opciones y tradeoffs), no código.
- Incluye: crear/modificar archivos, instalar dependencias, correr comandos, cambiar configuración.
- **Nunca** crear, modificar ni borrar datos en la base, aunque el script exista y funcione. Excepción: instrucción directa y explícita.
- Tampoco correr migraciones ni seeds "para ver si anda" sin pedido explícito.
