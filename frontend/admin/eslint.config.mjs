import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
export default [
  ...nextVitals,
  ...nextTypescript,
  prettier,
  { ignores: ['.next/**', 'dist/**', 'coverage/**'] },
]
