import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: true,
  typescript: true,
  vue: true,
  jsonc: false,
  yaml: false,
  ignores: [
    'dist',
    'node_modules',
    '*.svelte',
    '*.snap',
    '*.d.ts',
    'coverage',
    '!.vitepress',
  ],
  rules: {
    'no-restricted-globals': 'off',
    'no-empty-pattern': 'off',
  },
})
