// noinspection JSUnusedGlobalSymbols

import antfu from '@antfu/eslint-config'

/** @type {import('@antfu/eslint-config').UserConfigItem[]} */
const overrides = [
  {
    files: ['**/*.js', '**/*.ts'],
    rules: {
      'import/order': [
        'error',
        {
          'groups': [
            'index',
            'sibling',
            'parent',
            'internal',
            'external',
            'builtin',
            'object',
            'unknown',
            'type',
          ],
          'newlines-between': 'always',
          'alphabetize': {
            order: 'asc',
          },
        },
      ],
      'curly': [
        'error',
        'multi-line',
        'consistent',
      ],
      'antfu/if-newline': [
        'off',
      ],
      'node/prefer-global/process': [
        'off',
      ],
    },
  },
]

export default await antfu(
  {},
  ...overrides,
)
