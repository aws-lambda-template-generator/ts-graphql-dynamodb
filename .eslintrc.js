module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:fp/recommended',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jest',
    'fp',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      node: {
          extensions: ['.ts'],
          paths: ['node_modules/', 'node_modules/@types']
      },
      typescript: {},
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2019,
  },
  rules: {
    'import/no-extraneous-dependencies': 'off',
    'import/extensions': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'radix': 'off',
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  },
  overrides: [
    // Models use classes and decorators
    {
      files: ['src/entities/*.ts'],
      rules: {
        'fp/no-class': 'off',
        'fp/no-this': 'off',
        'fp/no-mutation': 'off',
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['src/services/SessionService.ts'],
      rules: {
        'fp/no-mutation': ['off'],
        'fp/no-nil': ['off'],
      },
    },
  ]
};
