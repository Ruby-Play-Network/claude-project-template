import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import vue from 'eslint-plugin-vue';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(
  { ignores: ['**/dist/**', '**/coverage/**', '**/migrations/**'] },
  js.configs.recommended,
  typescriptEslint.configs.recommended,
  vue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: { parserOptions: { parser: typescriptEslint.parser } },
  },
  {
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Identifier[name=/^.$/]',
          message: 'Single-letter names are not allowed; name things for what they are.',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      // Express identifies error handlers by arity, so the trailing `next` must stay.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'no-console': 'off',
    },
  },
  prettier,
);
