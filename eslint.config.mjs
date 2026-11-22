import js from '@eslint/js';
import boundaries from 'eslint-plugin-boundaries';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/generated/**', 'devfest/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser } },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['packages/core/src/**/*.ts'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': [
        { type: 'platform', pattern: 'packages/core/src/platform/**', partialMatch: false },
        {
          type: 'module',
          pattern: 'packages/core/src/modules/*/**',
          capture: ['name'],
          partialMatch: false,
        },
        {
          type: 'service',
          pattern: 'packages/core/src/services/*/**',
          capture: ['name'],
          partialMatch: false,
        },
      ],
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: { element: { type: 'platform' } },
              allow: { to: { element: { type: 'platform' } } },
            },
            {
              from: { element: { type: 'module' } },
              allow: [
                { to: { element: { type: 'platform' } } },
                {
                  to: {
                    element: {
                      type: 'module',
                      captured: { name: '{{from.element.captured.name}}' },
                    },
                  },
                },
                { to: { element: { type: 'module' }, import: '*.facade.ts' } },
              ],
            },
            {
              from: { element: { type: 'service' } },
              allow: [
                { to: { element: { type: 'platform' } } },
                {
                  to: {
                    element: {
                      type: 'service',
                      captured: { name: '{{from.element.captured.name}}' },
                    },
                  },
                },
                { to: { element: { type: 'module' }, import: '*.facade.ts' } },
              ],
            },
          ],
        },
      ],
    },
  },
);
