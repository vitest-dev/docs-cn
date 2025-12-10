import antfu, { GLOB_SRC } from '@antfu/eslint-config'

export default antfu(
  {
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
      // contains technically invalid code to display pretty diff
      'guide/snapshot.md',
      // uses invalid js example
      'advanced/api/import-example.md',
      'api/advanced/import-example.md',
      'guide/examples/*.md',
    ],
  },
  {
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
      // let TypeScript handle this
      'no-undef': 'off',
      'ts/no-invalid-this': 'off',
      'eslint-comments/no-unlimited-disable': 'off',
      'curly': ['error', 'all'],

      // TODO: migrate and turn it back on
      'ts/ban-types': 'off',
      'ts/no-unsafe-function-type': 'off',

      'no-restricted-imports': [
        'error',
        {
          paths: ['path'],
        },
      ],
      'import/no-named-as-default': 'off',
      'style/max-statements-per-line': 'off',
    },
  },
  {
    files: [`**/*.md`, `**/*.md/${GLOB_SRC}`],
    rules: {
      'perfectionist/sort-imports': 'off',
      'import/newline-after-import': 'off',
      'import/first': 'off',
      'unused-imports/no-unused-imports': 'off',
      'ts/method-signature-style': 'off',
      'no-self-compare': 'off',
      'import/no-mutable-exports': 'off',
      'no-restricted-globals': 'off',
    },
  },
)
