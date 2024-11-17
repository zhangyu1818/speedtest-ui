import { defineConfig } from '@zhangyu1818/eslint-config'

export default defineConfig(
  {
    parserOptions: {
      project: ['./tsconfig.json', './tsconfig.node.json'],
    },
    presets: {
      prettier: true,
      tailwindcss: true,
    },
  },
  [
    {
      ignores: ['src-tauri/**', 'scripts/**'],
    },
  ],
)
