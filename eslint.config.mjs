import nx from '@nx/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // ref: https://github.com/nrwl/nx/tree/master/packages/eslint-plugin/src/flat-configs
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  // common rules
  {
    files: ['**/*.ts', '**/*.js'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      // symbols, indents, quotes
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': 'error',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      // brackets, arrows, curly braces
      'arrow-parens': ['error', 'always'],
      'arrow-spacing': 'error',
      'block-spacing': 'error',
      'brace-style': 'error',
      'new-parens': 'error',
      'object-curly-spacing': ['error', 'always'],

      // other
      'eol-last': ['error', 'always'],
      'func-call-spacing': 'error',
      'rest-spread-spacing': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    rules: {
      ...prettierConfig.rules,
    }
  }
];
