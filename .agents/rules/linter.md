# Linter y formato

- ESLint 9 flat config (`eslint.config.mjs`): `@eslint/js` recommended + `typescript-eslint` recommendedTypeChecked + Prettier.
- Prettier (`.prettierrc`): comillas simples, `trailingComma: all`. El resto son defaults (incluye punto y coma, `printWidth` 80).
- `npm run lint` corre `eslint --fix`: **modifica archivos**. Para solo verificar:

```bash
npx eslint "{src,test}/**/*.ts"
```

- No dejar errores ni warnings. `no-floating-promises` y `no-unsafe-argument` están en `warn`: se tratan como error.
- `@typescript-eslint/no-explicit-any` es **error** en este proyecto (ver `no-any.md`).
- No deshabilitar reglas con `eslint-disable` sin justificar en el mismo renglón.
- No pelear con Prettier: si el formato queda raro, se cambia el código, no el config.
