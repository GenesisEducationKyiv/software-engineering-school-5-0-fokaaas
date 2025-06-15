const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/*.spec.ts', '**/*.ispec.ts'],
  passWithNoTests: true,
};
