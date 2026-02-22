import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  { ignores: ['build/**', '.react-router/**'] },
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    // React Router framework mode auto-splits route modules — static imports are fine here
    files: ['app/routes/**/*.ts', 'app/routes/**/*.tsx'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
