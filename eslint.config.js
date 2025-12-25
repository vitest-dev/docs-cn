import antfu, { GLOB_SRC } from '@antfu/eslint-config'

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
    'guide/examples/*.md',
  ],
  rules: {
    // prefer global Buffer to not initialize the whole module
    'node/prefer-global/buffer': 'off',
    'node/prefer-global/process': 'off',
    'no-empty-pattern': 'off',
    'antfu/indent-binary-ops': 'off',
    'unused-imports/no-unused-imports': 'error',
    'style/member-delimiter-style': [
      'error',
      {
        multiline: { delimiter: 'none' },
        singleline: { delimiter: 'semi' },
      },
    ],

    'ts/no-invalid-this': 'off',

    // TODO: migrate and turn it back on
    'ts/ban-types': 'off',

    'no-restricted-imports': [
      'error',
      {
        paths: ['path'],
      },
    ],

    'import/no-named-as-default': 'off',
  },
}, {
  files: [`**/*.md`, `**/*.md/${GLOB_SRC}`],
  rules: {
    'style/max-statements-per-line': 'off',
    'import/newline-after-import': 'off',
    'import/first': 'off',
    'no-restricted-globals': 'off',
    'unused-imports/no-unused-imports': 'off',
  },
})
