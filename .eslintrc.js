module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  // extends: [
  //   'airbnb-base',
  //   'plugin:@typescript-eslint/recommended',
  //   'plugin:@typescript-eslint/recommended-requiring-type-checking',
  //   'plugin:fp/recommended',
  //   'plugin:prettier/recommended',
  //   'plugin:import/typescript',
  // ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
  env: {
    'browser': true,
    'commonjs': true,
    'es2021': true
  },
  plugins: [
    '@typescript-eslint',
  ],
  parserOptions: {
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
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
  rules: {
    semi: ['error', 'always'],
    quotes: [2, 'single'],
    indent: ['error', 2]
  }
};
