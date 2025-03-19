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
      "style/no-mixed-operators": "off"
    }
  }
)
