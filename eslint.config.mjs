import antfu from '@antfu/eslint-config'

export default antfu(
  {
    react: true,
    type: 'app',
  },
  {
    ignores: ['components/ui', "*.config.ts", "*.config.mjs", "tsconfig.json", "components.json"],
  },
  {
    rules: {
      "style/no-mixed-operators": "off",
      "perfectionist/sort-imports": ["error", {
        groups: [
          'type',
          ['parent-type', 'sibling-type', 'index-type', 'internal-type'],

          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'side-effect',
          'object',
          'unknown',
        ],
        newlinesBetween: 'ignore',
        order: 'asc',
        type: 'natural',
        // @see https://perfectionist.dev/rules/sort-imports
        internalPattern: ['^@'],
      }]
    }
  }
)
