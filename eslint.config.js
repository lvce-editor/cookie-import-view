import { defineConfig, globalIgnores } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedActions,
  ...config.recommendedRegex,
  ...config.recommendedTsconfig,
  ...config.recommendedVirtualDom,
  globalIgnores(['**/*.js', '**/*.cjs', '**/*.mjs']),
  {
    // The pinned application supplies its own Node runtime.
    files: ['.github/workflows/integration.yml'],
    rules: { 'github-actions/node-version-file': 'off', 'github-actions/on': 'off' },
  },
  {
    // Preserve real DOM input events covered by the migrated application scenarios.
    files: ['packages/e2e-integration/src/viewlet.cookie-import-view-not-implemented.ts'],
    rules: { '@typescript-eslint/no-deprecated': 'off' },
  },
])
