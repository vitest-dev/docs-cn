import antfu, { GLOB_SRC } from '@antfu/eslint-config'
import mdStyle from 'eslint-plugin-md-style'

export default antfu(
  {
    stylistic: true,
    typescript: true,
    vue: true,
    jsonc: false,
    yaml: false,
    formatters: {
      markdown: 'prettier',
    },
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
      'guide/examples/*.md',
      'README.md',
      '.github/*.md',
    ],
    rules: {
      'no-restricted-globals': 'off',
      'no-empty-pattern': 'off',
    },
  },
  mdStyle.configs.all,
  {
    files: [`**/*.md`, `**/*.md/${GLOB_SRC}`],
    rules: {
      'perfectionist/sort-imports': 'off',
      'style/max-statements-per-line': 'off',
      'import/newline-after-import': 'off',
      'import/first': 'off',
      'unused-imports/no-unused-imports': 'off',
      'ts/method-signature-style': 'off',
      'no-self-compare': 'off',
      'import/no-mutable-exports': 'off',
      'markdown/no-multiple-h1': 'off',
    },
  },
)
