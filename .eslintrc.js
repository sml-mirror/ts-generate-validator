module.exports = {
  env: {
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // https://github.com/prettier/eslint-plugin-prettier#recommended-configuration
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.eslint.json'
  },
  plugins: ['import', '@typescript-eslint', 'eslint-comments', 'jest'],
  rules: {
    // General
    'comma-dangle': [2, 'never'], // allow or disallow trailing commas
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-inferrable-types': 0,
    'no-prototype-builtins': 0,
    'no-control-regex': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'object-curly-spacing': 0,
    'array-bracket-spacing': 0,
    'computed-property-spacing': 0
  }
};
