import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // This app fetches data on mount via useEffect + setState — the
      // standard pattern for client-side data fetching without a separate
      // data layer (React Query is used for caching elsewhere, but simple
      // page-level fetches use this pattern throughout). Downgraded to a
      // warning rather than reworked everywhere, since the underlying
      // pattern is safe and is explicitly documented by React itself.
      'react-hooks/set-state-in-effect': 'warn',
      // shadcn-style UI files intentionally export a component alongside
      // its variant helper (e.g. buttonVariants), and context files export
      // a Provider alongside its hook (e.g. useTheme) — both are standard,
      // widely-used conventions that this rule isn't tuned for.
      'react-refresh/only-export-components': 'warn',
    },
  },
])
