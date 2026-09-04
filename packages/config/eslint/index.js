module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
    'plugin:react/jsx-runtime'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react',
    'react-hooks',
    'prettier',
    '@typescript-eslint',
    'simple-import-sort'
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-debugger': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      typescript: {
        alwaysTryTypes: true
      }
    },
    react: {
      version: 'detect'
    }
  }
}
